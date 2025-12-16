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
	startedAt: timestamp("started_at", { withTimezone: true, mode: "date" })
		.defaultNow()
		.notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const match = pgTable("Match", {
	gameId: text().primaryKey().notNull(),
});

export const matchInfo = pgTable(
	"MatchInfo",
	{
		gameId: text().primaryKey().notNull(),
		gameDuration: integer().notNull(),
		gameMode: text().notNull(),
		gameName: text().notNull(),
		gameType: text().notNull(),
		gameVersion: text().notNull(),
		mapId: integer().notNull(),
		participants: jsonb().notNull(),
		platformId: text().notNull(),
		queueId: integer().notNull(),
		teams: jsonb().notNull(),
		tournamentCode: text().notNull(),
		gameCreation: timestamp({ precision: 3, mode: "date" }).notNull(),
		gameStartTimestamp: timestamp({ precision: 3, mode: "date" }).notNull(),
		gameEndTimestamp: timestamp({ precision: 3, mode: "date" }).notNull(),
	},
	(table) => [
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
		summonerId: text(),
		createdAt: timestamp({ precision: 3, mode: "date" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
		region: text().notNull(),
		profileIconId: integer().notNull(),
		puuid: text().primaryKey().notNull(),
		summonerLevel: integer().notNull(),
		revisionDate: timestamp({ precision: 3, mode: "date" }).notNull(),
		accountId: text(),
		gameName: text(),
		tagLine: text(),
	},
	(table) => [
		uniqueIndex("Summoner_puuid_key").using(
			"btree",
			table.puuid.asc().nullsLast().op("text_ops"),
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
			.onDelete("restrict"),
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
		puuid: text().notNull(),
	},
	(table) => [
		uniqueIndex("ChampionMastery_championId_puuid_key").using(
			"btree",
			table.championId.asc().nullsLast().op("int4_ops"),
			table.puuid.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.puuid],
			foreignColumns: [summoner.puuid],
			name: "ChampionMastery_puuid_fkey",
		})
			.onUpdate("cascade")
			.onDelete("restrict"),
	],
);

export const challengesConfig = pgTable("ChallengesConfig", {
	id: integer().primaryKey().notNull(),
	state: text(),
	leaderboard: boolean().notNull(),
	endTimestamp: timestamp({ precision: 3, mode: "date" }),
	thresholds: jsonb().notNull(),
	parentId: integer(),
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
	},
	(table) => [
		foreignKey({
			columns: [table.puuid],
			foreignColumns: [summoner.puuid],
			name: "ChallengesDetails_puuid_fkey",
		})
			.onUpdate("cascade")
			.onDelete("restrict"),
	],
);

export const totalPoints = pgTable(
	"TotalPoints",
	{
		level: text().notNull(),
		current: integer().notNull(),
		max: integer().notNull(),
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
			.onDelete("restrict"),
	],
);

export const preferences = pgTable(
	"Preferences",
	{
		bannerAccent: text().notNull(),
		title: text().notNull(),
		challengeIds: integer().array(),
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
			.onDelete("restrict"),
	],
);

export const challenge = pgTable(
	"Challenge",
	{
		challengeId: integer().notNull(),
		percentile: doublePrecision(),
		level: text(),
		value: integer(),
		achievedTime: timestamp({ precision: 3, mode: "date" }),
		challengesDetailsId: text().notNull(),
	},
	(table) => [
		uniqueIndex("Challenge_challengeId_challengesDetailsId_key").using(
			"btree",
			table.challengeId.asc().nullsLast().op("int4_ops"),
			table.challengesDetailsId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.challengesDetailsId],
			foreignColumns: [challengesDetails.puuid],
			name: "Challenge_challengesDetailsId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("restrict"),
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
			.onDelete("restrict"),
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
