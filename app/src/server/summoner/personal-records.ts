import { eq, sql } from "drizzle-orm";

import { db } from "~/db";
import { matchInfo, matchParticipant } from "~/db/schema";

export type PersonalRecords = {
	games: number;
	wins: number;
	/** Single-game multikill totals across the career. */
	multikills: {
		doubles: number;
		triples: number;
		quadras: number;
		pentas: number;
		unreal: number;
	};
	bestSpree: number;
	bestMultikill: number;
	bestDamage: { value: number | null; champion: string | null };
	bestKills: { value: number | null; champion: string | null };
	/** Best kills+assists per death, over games with at least one death. */
	bestKda: { value: number | null; champion: string | null };
	bestVision: number | null;
	perfectGames: number;
	fastestWinSeconds: number | null;
	longestGameSeconds: number | null;
	objectives: { dragons: number; barons: number; turrets: number; inhibitors: number };
};

/** The shape Postgres hands back, before it is mapped to the camelCase result. */
type RecordsRow = {
	games: number;
	wins: number;
	doubles: number;
	triples: number;
	quadras: number;
	pentas: number;
	unreal_kills: number;
	best_spree: number;
	best_multikill: number;
	best_damage: number | null;
	best_damage_champion: string | null;
	best_kills: number | null;
	best_kills_champion: string | null;
	best_kda: number | null;
	best_kda_champion: string | null;
	best_vision: number | null;
	perfect_games: number;
	fastest_win_seconds: number | null;
	longest_game_seconds: number | null;
	dragons: number;
	barons: number;
	turrets: number;
	inhibitors: number;
};

/**
 * Career records for one summoner, as a single aggregate pass over their projected rows.
 *
 * Everything here is read from the `MatchParticipant` projection (`gameDuration` from the joined
 * `MatchInfo`), so the query never expands `MatchInfo.participants`. It used to: the multikill
 * counters, the per-game objective counts and the remake flag were jsonb-only, so it crossed
 * `jsonb_array_elements(participants)` and filtered back down to the summoner — reading all ten
 * players' full payloads to keep 15 numbers for one of them.
 *
 * Measured for one account with 2,621 matches: the jsonb version took 722ms cold and still
 * 452–471ms with the pages cached, against 15ms now, and total buffers drop from ~32k to ~6.6k. The
 * gain is the narrow read, so it survives a warm cache rather than depending on one.
 *
 * `sum`/`max` skip NULL, and a column is NULL for a match that predates the field (Riot only
 * started sending some of these counters mid-2022), so the totals span mixed patches without
 * failing — the same reason the jsonb `->>` extraction was NULL-tolerant.
 *
 * The join to `MatchInfo` is still load-bearing: `gameDuration` lives there, not on the
 * projection. It no longer expands any jsonb.
 *
 * Raw `sql` is used only for the aggregate expressions the builder cannot express: `FILTER
 * (WHERE ...)`, the `array_agg(... ORDER BY ...)` champion tie-breaks, the kills+assists/deaths
 * ratio, and the objective `sum`s that need a `coalesce` to report zero rather than NULL.
 */
export const getPersonalRecords = async (puuid: string): Promise<PersonalRecords> => {
	const rows = await db
		.select({
			games: sql<number>`count(*)::int`,
			wins: sql<number>`count(*) FILTER (WHERE ${matchParticipant.win})::int`,
			doubles: sql<number>`coalesce(sum(${matchParticipant.doubleKills}), 0)::int`,
			triples: sql<number>`coalesce(sum(${matchParticipant.tripleKills}), 0)::int`,
			quadras: sql<number>`coalesce(sum(${matchParticipant.quadraKills}), 0)::int`,
			pentas: sql<number>`coalesce(sum(${matchParticipant.pentaKills}), 0)::int`,
			unreal_kills: sql<number>`coalesce(sum(${matchParticipant.unrealKills}), 0)::int`,
			best_spree: sql<number>`coalesce(max(${matchParticipant.largestKillingSpree}), 0)::int`,
			best_multikill: sql<number>`coalesce(max(${matchParticipant.largestMultiKill}), 0)::int`,
			best_damage: sql<number | null>`max(${matchParticipant.totalDamageDealtToChampions})`,
			best_damage_champion: sql<
				string | null
			>`(array_agg(${matchParticipant.championName} ORDER BY ${matchParticipant.totalDamageDealtToChampions} DESC NULLS LAST))[1]`,
			best_kills: sql<number | null>`max(${matchParticipant.kills})`,
			best_kills_champion: sql<
				string | null
			>`(array_agg(${matchParticipant.championName} ORDER BY ${matchParticipant.kills} DESC NULLS LAST))[1]`,
			// Perfect games would divide by zero, so they are excluded rather than clamped; they
			// are reported separately as "perfect games".
			best_kda: sql<
				number | null
			>`(max((${matchParticipant.kills} + ${matchParticipant.assists})::float / GREATEST(${matchParticipant.deaths}, 1)) FILTER (WHERE ${matchParticipant.deaths} > 0))`,
			best_kda_champion: sql<
				string | null
			>`(array_agg(${matchParticipant.championName} ORDER BY (${matchParticipant.kills} + ${matchParticipant.assists})::float / GREATEST(${matchParticipant.deaths}, 1) DESC NULLS LAST) FILTER (WHERE ${matchParticipant.deaths} > 0))[1]`,
			best_vision: sql<number | null>`max(${matchParticipant.visionScore})`,
			perfect_games: sql<number>`count(*) FILTER (WHERE ${matchParticipant.deaths} = 0)::int`,
			// Remakes ("early surrender") are excluded: a 71-second game is not a fastest-win
			// record, it is a lobby that never happened. The flag cannot be replaced by a duration
			// threshold — this account's real record is a 226-second win, inside the remake window.
			fastest_win_seconds: sql<
				number | null
			>`min(${matchInfo.gameDuration}) FILTER (WHERE ${matchParticipant.win} AND NOT coalesce(${matchParticipant.gameEndedInEarlySurrender}, false))`,
			longest_game_seconds: sql<number | null>`max(${matchInfo.gameDuration})`,
			dragons: sql<number>`coalesce(sum(${matchParticipant.dragonKills}), 0)::int`,
			barons: sql<number>`coalesce(sum(${matchParticipant.baronKills}), 0)::int`,
			turrets: sql<number>`coalesce(sum(${matchParticipant.turretKills}), 0)::int`,
			inhibitors: sql<number>`coalesce(sum(${matchParticipant.inhibitorKills}), 0)::int`,
		})
		.from(matchParticipant)
		.innerJoin(matchInfo, eq(matchParticipant.matchId, matchInfo.gameId))
		.where(eq(matchParticipant.puuid, puuid));

	const row = rows[0] as RecordsRow | undefined;

	// A summoner with no stored matches still gets a usable, all-zero panel.
	const fallback: RecordsRow = {
		games: 0,
		wins: 0,
		doubles: 0,
		triples: 0,
		quadras: 0,
		pentas: 0,
		unreal_kills: 0,
		best_spree: 0,
		best_multikill: 0,
		best_damage: null,
		best_damage_champion: null,
		best_kills: null,
		best_kills_champion: null,
		best_kda: null,
		best_kda_champion: null,
		best_vision: null,
		perfect_games: 0,
		fastest_win_seconds: null,
		longest_game_seconds: null,
		dragons: 0,
		barons: 0,
		turrets: 0,
		inhibitors: 0,
	};
	const records = row ?? fallback;

	return {
		games: records.games,
		wins: records.wins,
		multikills: {
			doubles: records.doubles,
			triples: records.triples,
			quadras: records.quadras,
			pentas: records.pentas,
			unreal: records.unreal_kills,
		},
		bestSpree: records.best_spree,
		bestMultikill: records.best_multikill,
		bestDamage: { value: records.best_damage, champion: records.best_damage_champion },
		bestKills: { value: records.best_kills, champion: records.best_kills_champion },
		bestKda: { value: records.best_kda, champion: records.best_kda_champion },
		bestVision: records.best_vision,
		perfectGames: records.perfect_games,
		fastestWinSeconds: records.fastest_win_seconds,
		longestGameSeconds: records.longest_game_seconds,
		objectives: {
			dragons: records.dragons,
			barons: records.barons,
			turrets: records.turrets,
			inhibitors: records.inhibitors,
		},
	};
};
