import { sql } from "drizzle-orm";
import {
	boolean,
	doublePrecision,
	foreignKey,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

import type { MatchParticipantDTO, MatchTeamDTO } from "~/server/external/riot/twisted";

export const language = pgEnum("Language", ["en_US"]);

export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: "date" }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", {
		withTimezone: true,
		mode: "date",
	}),
	startedAt: timestamp("started_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const match = pgTable("Match", {
	gameId: text().primaryKey().notNull(),
});

export const matchInfo = pgTable(
	"MatchInfo",
	{
		gameId: text().primaryKey().notNull(),
		/** Match-V5 `metadata.dataVersion` — the Data Dragon version the game was played on. */
		dataVersion: text(),
		/** Match-V5 `info.endOfGameResult` — e.g. "GameComplete", "Aborted", "Terminated". */
		endOfGameResult: text(),
		/** Game length in SECONDS (Match-V5 `info.gameDuration`), not milliseconds. */
		gameDuration: integer().notNull(),
		gameMode: text().notNull(),
		gameName: text().notNull(),
		gameType: text().notNull(),
		gameVersion: text().notNull(),
		mapId: integer().notNull(),
		/**
		 * Raw Match-V5 `info.participants` — the source of truth. Kept as-is so new
		 * Riot fields are captured without a schema change; `MatchParticipant` holds a
		 * typed projection of the fields we actually query.
		 */
		participants: jsonb().$type<MatchParticipantDTO[]>().notNull(),
		platformId: text().notNull(),
		queueId: integer().notNull(),
		/** Raw Match-V5 `info.teams` (2 entries; not worth normalizing). */
		teams: jsonb().$type<MatchTeamDTO[]>().notNull(),
		tournamentCode: text().notNull(),
		gameCreation: timestamp({ precision: 3, mode: "date" }).notNull(),
		gameStartTimestamp: timestamp({ precision: 3, mode: "date" }).notNull(),
		gameEndTimestamp: timestamp({ precision: 3, mode: "date" }).notNull(),
	},
	(table) => [
		index("MatchInfo_gameStartTimestamp_idx").using("btree", table.gameStartTimestamp.desc()),
		foreignKey({
			columns: [table.gameId],
			foreignColumns: [match.gameId],
			name: "MatchInfo_gameId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const summoner = pgTable(
	"Summoner",
	{
		createdAt: timestamp({ precision: 3, mode: "date" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
		region: text().notNull(),
		profileIconId: integer().notNull(),
		puuid: text().primaryKey().notNull(),
		summonerLevel: integer().notNull(),
		revisionDate: timestamp({ precision: 3, mode: "date" }).notNull(),
		gameName: text(),
		tagLine: text(),
	},
	(table) => [
		uniqueIndex("Summoner_puuid_key").using(
			"btree",
			table.puuid.asc().nullsLast().op("text_ops"),
		),
		index("Summoner_region_gameName_tagLine_idx").using(
			"btree",
			table.region.asc().nullsLast().op("text_ops"),
			table.gameName.asc().nullsLast().op("text_ops"),
			table.tagLine.asc().nullsLast().op("text_ops"),
		),
	],
);

export const challenges = pgTable(
	"Challenges",
	{
		puuid: text().primaryKey().notNull(),
	},
	(table) => [
		uniqueIndex("Challenges_puuid_key").using(
			"btree",
			table.puuid.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.puuid],
			foreignColumns: [summoner.puuid],
			name: "Challenges_puuid_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const championMastery = pgTable(
	"ChampionMastery",
	{
		championId: integer().notNull(),
		updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
		championLevel: integer().notNull(),
		championPoints: integer().notNull(),
		tokensEarned: integer().notNull(),
		lastPlayTime: timestamp({ precision: 3, mode: "date" }).notNull(),
		championPointsUntilNextLevel: integer().notNull(),
		championPointsSinceLastLevel: integer().notNull(),
		/** Champion-Mastery-V4 `markRequiredForNextLevel` (season marks). */
		markRequiredForNextLevel: integer(),
		/** Champion-Mastery-V4 `championSeasonMilestone`. */
		championSeasonMilestone: integer(),
		/** Champion-Mastery-V4 `nextSeasonMilestone` (milestone requirements/rewards object). */
		nextSeasonMilestone: jsonb(),
		/** Champion-Mastery-V4 `milestoneGrades` (e.g. ["C","B","A"]). */
		milestoneGrades: text().array(),
		puuid: text().notNull(),
	},
	(table) => [
		uniqueIndex("ChampionMastery_championId_puuid_key").using(
			"btree",
			table.championId.asc().nullsLast().op("int4_ops"),
			table.puuid.asc().nullsLast().op("text_ops"),
		),
		index("ChampionMastery_puuid_idx").using(
			"btree",
			table.puuid.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.puuid],
			foreignColumns: [summoner.puuid],
			name: "ChampionMastery_puuid_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const challengesConfig = pgTable("ChallengesConfig", {
	id: integer().primaryKey().notNull(),
	state: text(),
	/** Config-DTO `tracking` (e.g. "LIFETIME", "SEASON"). */
	tracking: text(),
	leaderboard: boolean().notNull(),
	startTimestamp: timestamp({ precision: 3, mode: "date" }),
	endTimestamp: timestamp({ precision: 3, mode: "date" }),
	/** Config-DTO `thresholds` — `Map[String, double]`. */
	thresholds: jsonb().$type<Record<string, number>>().notNull(),
});

export const challengeLocalization = pgTable(
	"ChallengeLocalization",
	{
		id: integer().notNull(),
		language: language().notNull(),
		description: text().notNull(),
		name: text().notNull(),
		shortDescription: text().notNull(),
	},
	(table) => [
		uniqueIndex("ChallengeLocalization_id_language_key").using(
			"btree",
			table.id.asc().nullsLast().op("int4_ops"),
			table.language.asc().nullsLast(),
		),
		foreignKey({
			columns: [table.id],
			foreignColumns: [challengesConfig.id],
			name: "ChallengeLocalization_id_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const challengesDetails = pgTable(
	"ChallengesDetails",
	{
		puuid: text().primaryKey().notNull(),
		createdAt: timestamp({ precision: 3, mode: "date" }).defaultNow().notNull(),
		updatedAt: timestamp({ precision: 3, mode: "date" }).defaultNow().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.puuid],
			foreignColumns: [summoner.puuid],
			name: "ChallengesDetails_puuid_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const totalPoints = pgTable(
	"TotalPoints",
	{
		level: text().notNull(),
		current: integer().notNull(),
		max: integer().notNull(),
		/** Player-DTO `totalPoints.percentile` (optional in the API). */
		percentile: doublePrecision(),
		challengesDetailsId: text().notNull(),
	},
	(table) => [
		uniqueIndex("TotalPoints_challengesDetailsId_key").using(
			"btree",
			table.challengesDetailsId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.challengesDetailsId],
			foreignColumns: [challengesDetails.puuid],
			name: "TotalPoints_challengesDetailsId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const preferences = pgTable(
	"Preferences",
	{
		bannerAccent: text().notNull(),
		title: text().notNull(),
		challengeIds: integer().array(),
		/** PlayerClientPreferencesDto `crestBorder`. */
		crestBorder: text(),
		/** PlayerClientPreferencesDto `prestigeCrestBorderLevel`. */
		prestigeCrestBorderLevel: integer(),
		challengesDetailsId: text().notNull(),
	},
	(table) => [
		uniqueIndex("Preferences_challengesDetailsId_key").using(
			"btree",
			table.challengesDetailsId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.challengesDetailsId],
			foreignColumns: [challengesDetails.puuid],
			name: "Preferences_challengesDetailsId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const challenge = pgTable(
	"Challenge",
	{
		challengeId: integer().notNull(),
		percentile: doublePrecision(),
		level: text(),
		/** ChallengeInfoDto `value` is a `double` in the API (not an integer). */
		value: doublePrecision(),
		achievedTime: timestamp({ precision: 3, mode: "date" }),
		/** ChallengeInfoDto `playersInLevel`. */
		playersInLevel: integer(),
		/** ChallengeInfoDto `position`. */
		position: integer(),
		challengesDetailsId: text().notNull(),
	},
	(table) => [
		uniqueIndex("Challenge_challengeId_challengesDetailsId_key").using(
			"btree",
			table.challengeId.asc().nullsLast().op("int4_ops"),
			table.challengesDetailsId.asc().nullsLast().op("text_ops"),
		),
		index("Challenge_challengeId_value_idx").using(
			"btree",
			table.challengeId.asc().nullsLast().op("int4_ops"),
			table.value.desc(),
		),
		foreignKey({
			columns: [table.challengesDetailsId],
			foreignColumns: [challengesDetails.puuid],
			name: "Challenge_challengesDetailsId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const categoryPoints = pgTable(
	"CategoryPoints",
	{
		category: text().notNull(),
		level: text().notNull(),
		current: integer().notNull(),
		max: integer().notNull(),
		percentile: doublePrecision().notNull(),
		challengesDetailsId: text().notNull(),
	},
	(table) => [
		uniqueIndex("CategoryPoints_category_challengesDetailsId_key").using(
			"btree",
			table.category.asc().nullsLast().op("text_ops"),
			table.challengesDetailsId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.challengesDetailsId],
			foreignColumns: [challengesDetails.puuid],
			name: "CategoryPoints_challengesDetailsId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const championDetails = pgTable(
	"ChampionDetails",
	{
		id: integer().primaryKey().notNull(),
		version: text(),
		key: text().notNull(),
		name: text().notNull(),
		title: text().notNull(),
		blurb: text().notNull(),
		attack: integer().notNull(),
		defense: integer().notNull(),
		magic: integer().notNull(),
		difficulty: integer().notNull(),
		full: text().notNull(),
		sprite: text().notNull(),
		group: text().notNull(),
		x: integer().notNull(),
		y: integer().notNull(),
		w: integer().notNull(),
		h: integer().notNull(),
		tags: text().array(),
		partype: text().notNull(),
		hp: doublePrecision().notNull(),
		hpperlevel: doublePrecision().notNull(),
		mp: doublePrecision().notNull(),
		mpperlevel: doublePrecision().notNull(),
		movespeed: doublePrecision().notNull(),
		armor: doublePrecision().notNull(),
		armorperlevel: doublePrecision().notNull(),
		spellblock: doublePrecision().notNull(),
		spellblockperlevel: doublePrecision().notNull(),
		attackrange: doublePrecision().notNull(),
		hpregen: doublePrecision().notNull(),
		hpregenperlevel: doublePrecision().notNull(),
		mpregen: doublePrecision().notNull(),
		mpregenperlevel: doublePrecision().notNull(),
		crit: doublePrecision().notNull(),
		critperlevel: doublePrecision().notNull(),
		attackdamage: doublePrecision().notNull(),
		attackdamageperlevel: doublePrecision().notNull(),
		attackspeedperlevel: doublePrecision().notNull(),
		attackspeed: doublePrecision().notNull(),
	},
	(table) => [
		uniqueIndex("ChampionDetails_id_key").using(
			"btree",
			table.id.asc().nullsLast().op("int4_ops"),
		),
	],
);

export const matchSummoners = pgTable(
	"_MatchSummoners",
	{
		a: text("A").notNull(),
		b: text("B").notNull(),
	},
	(table) => [
		index().using("btree", table.b.asc().nullsLast().op("text_ops")),
		foreignKey({
			columns: [table.a],
			foreignColumns: [match.gameId],
			name: "_MatchSummoners_A_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.b],
			foreignColumns: [summoner.puuid],
			name: "_MatchSummoners_B_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		primaryKey({
			columns: [table.a, table.b],
			name: "_MatchSummoners_AB_pkey",
		}),
	],
);

/**
 * Typed projection of `MatchInfo.participants` for the fields we actually query.
 *
 * `MatchInfo.participants` stays the source of truth: Riot can add participant
 * fields without breaking the write path, and anything promoted later is a
 * plain `ALTER TABLE` + backfill from the jsonb (no Riot re-fetch).
 */
export const matchParticipant = pgTable(
	"MatchParticipant",
	{
		matchId: text().notNull(),
		puuid: text().notNull(),
		participantId: integer().notNull(),
		teamId: integer().notNull(),
		championId: integer().notNull(),
		championName: text().notNull(),
		win: boolean().notNull(),
		teamPosition: text(),
		individualPosition: text(),
		/** Arena placement (1–8); 0 for non-Arena games. */
		placement: integer(),
		kills: integer().notNull(),
		deaths: integer().notNull(),
		assists: integer().notNull(),
		goldEarned: integer().notNull(),
		totalMinionsKilled: integer().notNull(),
		neutralMinionsKilled: integer().notNull(),
		visionScore: integer().notNull(),
		champLevel: integer().notNull(),
		timePlayed: integer().notNull(),
		totalDamageDealtToChampions: integer().notNull(),
		item0: integer(),
		item1: integer(),
		item2: integer(),
		item3: integer(),
		item4: integer(),
		item5: integer(),
		item6: integer(),
		summoner1Id: integer(),
		summoner2Id: integer(),
	},
	(table) => [
		primaryKey({
			columns: [table.matchId, table.participantId],
			name: "MatchParticipant_pkey",
		}),
		uniqueIndex("MatchParticipant_matchId_puuid_key").using(
			"btree",
			table.matchId.asc().nullsLast().op("text_ops"),
			table.puuid.asc().nullsLast().op("text_ops"),
		),
		index("MatchParticipant_puuid_championId_idx").using(
			"btree",
			table.puuid.asc().nullsLast().op("text_ops"),
			table.championId.asc().nullsLast().op("int4_ops"),
		),
		index("MatchParticipant_puuid_win_idx")
			.using("btree", table.puuid.asc().nullsLast().op("text_ops"))
			.where(sql`${table.win}`),
		foreignKey({
			columns: [table.matchId],
			foreignColumns: [match.gameId],
			name: "MatchParticipant_matchId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.puuid],
			foreignColumns: [summoner.puuid],
			name: "MatchParticipant_puuid_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const challengeHeroes = pgTable(
	"_ChallengeHeroes",
	{
		a: text("A").notNull(),
		b: integer("B").notNull(),
	},
	(table) => [
		index().using("btree", table.b.asc().nullsLast().op("int4_ops")),
		foreignKey({
			columns: [table.a],
			foreignColumns: [challenges.puuid],
			name: "_ChallengeHeroes_A_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.b],
			foreignColumns: [championDetails.id],
			name: "_ChallengeHeroes_B_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		primaryKey({
			columns: [table.a, table.b],
			name: "_ChallengeHeroes_AB_pkey",
		}),
	],
);

export const challengesChampionOcean = pgTable(
	"_ChallengesChampionOcean",
	{
		a: text("A").notNull(),
		b: integer("B").notNull(),
	},
	(table) => [
		index().using("btree", table.b.asc().nullsLast().op("int4_ops")),
		foreignKey({
			columns: [table.a],
			foreignColumns: [challenges.puuid],
			name: "_ChallengesChampionOcean_A_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.b],
			foreignColumns: [championDetails.id],
			name: "_ChallengesChampionOcean_B_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		primaryKey({
			columns: [table.a, table.b],
			name: "_ChallengesChampionOcean_AB_pkey",
		}),
	],
);

export const challengesAdaptToAllSituations = pgTable(
	"_ChallengesAdaptToAllSituations",
	{
		a: text("A").notNull(),
		b: integer("B").notNull(),
	},
	(table) => [
		index().using("btree", table.b.asc().nullsLast().op("int4_ops")),
		foreignKey({
			columns: [table.a],
			foreignColumns: [challenges.puuid],
			name: "_ChallengesAdaptToAllSituations_A_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.b],
			foreignColumns: [championDetails.id],
			name: "_ChallengesAdaptToAllSituations_B_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		primaryKey({
			columns: [table.a, table.b],
			name: "_ChallengesAdaptToAllSituations_AB_pkey",
		}),
	],
);

export const challengesInvincible = pgTable(
	"_ChallengesInvincible",
	{
		a: text("A").notNull(),
		b: integer("B").notNull(),
	},
	(table) => [
		index().using("btree", table.b.asc().nullsLast().op("int4_ops")),
		foreignKey({
			columns: [table.a],
			foreignColumns: [challenges.puuid],
			name: "_ChallengesInvincible_A_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.b],
			foreignColumns: [championDetails.id],
			name: "_ChallengesInvincible_B_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		primaryKey({
			columns: [table.a, table.b],
			name: "_ChallengesInvincible_AB_pkey",
		}),
	],
);

export const challengesChampionOcean2024Split3 = pgTable(
	"_ChallengesChampionOcean2024Split3",
	{
		a: text("A").notNull(),
		b: integer("B").notNull(),
	},
	(table) => [
		index().using("btree", table.b.asc().nullsLast().op("int4_ops")),
		foreignKey({
			columns: [table.a],
			foreignColumns: [challenges.puuid],
			name: "_ChallengesChampionOcean2024Split3_A_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.b],
			foreignColumns: [championDetails.id],
			name: "_ChallengesChampionOcean2024Split3_B_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		primaryKey({
			columns: [table.a, table.b],
			name: "_ChallengesChampionOcean2024Split3_AB_pkey",
		}),
	],
);
