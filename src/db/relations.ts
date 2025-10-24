import { relations } from "drizzle-orm/relations";
import {
	match,
	matchInfo,
	summoner,
	challenges,
	championMastery,
	challengesConfig,
	challengeLocalization,
	challengesDetails,
	totalPoints,
	preferences,
	challenge,
	categoryPoints,
	matchSummoners,
	challengeHeroes,
	championDetails,
	challengesChampionOcean,
	challengesAdaptToAllSituations,
	challengesInvincible,
	challengesChampionOcean2024Split3,
} from "./schema";

export const matchInfoRelations = relations(matchInfo, ({ one }) => ({
	match: one(match, {
		fields: [matchInfo.gameId],
		references: [match.gameId],
	}),
}));

export const matchRelations = relations(match, ({ many }) => ({
	matchInfos: many(matchInfo),
	matchSummoners: many(matchSummoners),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
	summoner: one(summoner, {
		fields: [challenges.puuid],
		references: [summoner.puuid],
	}),
	challengeHeroes: many(challengeHeroes),
	challengesChampionOceans: many(challengesChampionOcean),
	challengesAdaptToAllSituations: many(challengesAdaptToAllSituations),
	challengesInvincibles: many(challengesInvincible),
	challengesChampionOcean2024Split3s: many(challengesChampionOcean2024Split3),
}));

export const summonerRelations = relations(summoner, ({ many }) => ({
	challenges: many(challenges),
	championMasteries: many(championMastery),
	challengesDetails: many(challengesDetails),
	matchSummoners: many(matchSummoners),
}));

export const championMasteryRelations = relations(
	championMastery,
	({ one }) => ({
		summoner: one(summoner, {
			fields: [championMastery.puuid],
			references: [summoner.puuid],
		}),
	}),
);

export const challengeLocalizationRelations = relations(
	challengeLocalization,
	({ one }) => ({
		challengesConfig: one(challengesConfig, {
			fields: [challengeLocalization.id],
			references: [challengesConfig.id],
		}),
	}),
);

export const challengesConfigRelations = relations(
	challengesConfig,
	({ many }) => ({
		challengeLocalizations: many(challengeLocalization),
	}),
);

export const challengesDetailsRelations = relations(
	challengesDetails,
	({ one, many }) => ({
		summoner: one(summoner, {
			fields: [challengesDetails.puuid],
			references: [summoner.puuid],
		}),
		totalPoints: many(totalPoints),
		preferences: many(preferences),
		challenges: many(challenge),
		categoryPoints: many(categoryPoints),
	}),
);

export const totalPointsRelations = relations(totalPoints, ({ one }) => ({
	challengesDetail: one(challengesDetails, {
		fields: [totalPoints.challengesDetailsId],
		references: [challengesDetails.puuid],
	}),
}));

export const preferencesRelations = relations(preferences, ({ one }) => ({
	challengesDetail: one(challengesDetails, {
		fields: [preferences.challengesDetailsId],
		references: [challengesDetails.puuid],
	}),
}));

export const challengeRelations = relations(challenge, ({ one }) => ({
	challengesDetail: one(challengesDetails, {
		fields: [challenge.challengesDetailsId],
		references: [challengesDetails.puuid],
	}),
}));

export const categoryPointsRelations = relations(categoryPoints, ({ one }) => ({
	challengesDetail: one(challengesDetails, {
		fields: [categoryPoints.challengesDetailsId],
		references: [challengesDetails.puuid],
	}),
}));

export const matchSummonersRelations = relations(matchSummoners, ({ one }) => ({
	match: one(match, {
		fields: [matchSummoners.a],
		references: [match.gameId],
	}),
	summoner: one(summoner, {
		fields: [matchSummoners.b],
		references: [summoner.puuid],
	}),
}));

export const challengeHeroesRelations = relations(
	challengeHeroes,
	({ one }) => ({
		challenge: one(challenges, {
			fields: [challengeHeroes.a],
			references: [challenges.puuid],
		}),
		championDetail: one(championDetails, {
			fields: [challengeHeroes.b],
			references: [championDetails.id],
		}),
	}),
);

export const championDetailsRelations = relations(
	championDetails,
	({ many }) => ({
		challengeHeroes: many(challengeHeroes),
		challengesChampionOceans: many(challengesChampionOcean),
		challengesAdaptToAllSituations: many(challengesAdaptToAllSituations),
		challengesInvincibles: many(challengesInvincible),
		challengesChampionOcean2024Split3s: many(challengesChampionOcean2024Split3),
	}),
);

export const challengesChampionOceanRelations = relations(
	challengesChampionOcean,
	({ one }) => ({
		challenge: one(challenges, {
			fields: [challengesChampionOcean.a],
			references: [challenges.puuid],
		}),
		championDetail: one(championDetails, {
			fields: [challengesChampionOcean.b],
			references: [championDetails.id],
		}),
	}),
);

export const challengesAdaptToAllSituationsRelations = relations(
	challengesAdaptToAllSituations,
	({ one }) => ({
		challenge: one(challenges, {
			fields: [challengesAdaptToAllSituations.a],
			references: [challenges.puuid],
		}),
		championDetail: one(championDetails, {
			fields: [challengesAdaptToAllSituations.b],
			references: [championDetails.id],
		}),
	}),
);

export const challengesInvincibleRelations = relations(
	challengesInvincible,
	({ one }) => ({
		challenge: one(challenges, {
			fields: [challengesInvincible.a],
			references: [challenges.puuid],
		}),
		championDetail: one(championDetails, {
			fields: [challengesInvincible.b],
			references: [championDetails.id],
		}),
	}),
);

export const challengesChampionOcean2024Split3Relations = relations(
	challengesChampionOcean2024Split3,
	({ one }) => ({
		challenge: one(challenges, {
			fields: [challengesChampionOcean2024Split3.a],
			references: [challenges.puuid],
		}),
		championDetail: one(championDetails, {
			fields: [challengesChampionOcean2024Split3.b],
			references: [championDetails.id],
		}),
	}),
);
