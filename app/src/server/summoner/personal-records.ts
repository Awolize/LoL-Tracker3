import { sql } from "drizzle-orm";

import { db } from "~/db";

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
 * Career records for one summoner, as a single aggregate pass over their participant entries.
 *
 * Almost every field here is jsonb-only — `doubleKills`…`pentaKills`, `largestKillingSpree`,
 * `largestMultiKill` and the per-game objective counts are not in the `MatchParticipant`
 * projection at all — so this expands `MatchInfo.participants` and filters to the summoner, the
 * same approach `match-participants.ts` uses for its projection. `jsonb_array_elements` in `FROM`
 * is not something the Drizzle query builder can express, which is the documented reason to reach
 * for raw `sql`.
 *
 * `->>` returns NULL for a field a match predates, and NULL casts to NULL, so every `sum`/`max`
 * skips it rather than failing — which matters because the stored history spans many patches.
 *
 * The join to `MatchParticipant` is load-bearing, not decoration. Filtering on `p->>'puuid'` alone
 * gives the planner no indexable predicate, so it sequentially scans *every* match in the database
 * and expands each one's jsonb, then discards ~90% of it: measured at 5,725ms for one account with
 * 2,621 matches, against 722ms once the projection's `(puuid, championId)` index drives the scan and
 * the jsonb is expanded only for that summoner's matches.
 */
export const getPersonalRecords = async (puuid: string): Promise<PersonalRecords> => {
	const result = await db.execute(sql`
		SELECT
			count(*)::int AS games,
			count(*) FILTER (WHERE (p->>'win')::boolean)::int AS wins,
			coalesce(sum((p->>'doubleKills')::int), 0)::int AS doubles,
			coalesce(sum((p->>'tripleKills')::int), 0)::int AS triples,
			coalesce(sum((p->>'quadraKills')::int), 0)::int AS quadras,
			coalesce(sum((p->>'pentaKills')::int), 0)::int AS pentas,
			coalesce(sum((p->>'unrealKills')::int), 0)::int AS unreal_kills,
			coalesce(max((p->>'largestKillingSpree')::int), 0)::int AS best_spree,
			coalesce(max((p->>'largestMultiKill')::int), 0)::int AS best_multikill,
			max((p->>'totalDamageDealtToChampions')::int) AS best_damage,
			(array_agg(
				p->>'championName'
				ORDER BY (p->>'totalDamageDealtToChampions')::int DESC NULLS LAST
			))[1] AS best_damage_champion,
			max((p->>'kills')::int) AS best_kills,
			(array_agg(
				p->>'championName'
				ORDER BY (p->>'kills')::int DESC NULLS LAST
			))[1] AS best_kills_champion,
			-- Perfect games would divide by zero, so they are excluded rather than clamped; they
			-- are reported separately as "perfect games".
			(max(
				((p->>'kills')::int + (p->>'assists')::int)::float
				/ GREATEST((p->>'deaths')::int, 1)
			) FILTER (WHERE (p->>'deaths')::int > 0)) AS best_kda,
			(array_agg(
				p->>'championName'
				ORDER BY ((p->>'kills')::int + (p->>'assists')::int)::float
					/ GREATEST((p->>'deaths')::int, 1) DESC NULLS LAST
			) FILTER (WHERE (p->>'deaths')::int > 0))[1] AS best_kda_champion,
			max((p->>'visionScore')::int) AS best_vision,
			count(*) FILTER (WHERE (p->>'deaths')::int = 0)::int AS perfect_games,
			-- Remakes ("early surrender") are excluded: a 71-second game is not a fastest-win record,
			-- it is a lobby that never happened.
			min(mi."gameDuration") FILTER (
				WHERE (p->>'win')::boolean
					AND NOT coalesce((p->>'gameEndedInEarlySurrender')::boolean, false)
			) AS fastest_win_seconds,
			max(mi."gameDuration") AS longest_game_seconds,
			coalesce(sum((p->>'dragonKills')::int), 0)::int AS dragons,
			coalesce(sum((p->>'baronKills')::int), 0)::int AS barons,
			coalesce(sum((p->>'turretKills')::int), 0)::int AS turrets,
			coalesce(sum((p->>'inhibitorKills')::int), 0)::int AS inhibitors
		FROM "MatchInfo" mi
		JOIN "MatchParticipant" mp ON mp."matchId" = mi."gameId"
		CROSS JOIN LATERAL jsonb_array_elements(mi.participants) p
		WHERE mp.puuid = ${puuid}
			AND p->>'puuid' = ${puuid}
	`);

	const row = result.rows[0] as RecordsRow | undefined;

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
