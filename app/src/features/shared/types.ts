import type { InferSelectModel } from "drizzle-orm";

import type {
	challenge,
	challengeLocalization,
	challengesConfig,
	championDetails,
	match,
	matchInfo,
	summoner,
} from "~/db/schema";
import type { ChampionMasteryDTO } from "~/server/external/riot/twisted";

export type ChampionMasteryDTOWithoutExtras = Omit<
	ChampionMasteryDTO,
	| "summonerId"
	| "puuid"
	| "markRequiredForNextLevel"
	| "championSeasonMilestone"
	| "nextSeasonMilestone"
	| "chestGranted"
>;

// Database model types
type Match = InferSelectModel<typeof match>;
type MatchInfo = InferSelectModel<typeof matchInfo>;
export type Summoner = InferSelectModel<typeof summoner>;
export type ChampionDetails = InferSelectModel<typeof championDetails>;
type Challenge = InferSelectModel<typeof challenge>;
type ChallengeLocalization = InferSelectModel<typeof challengeLocalization>;
export type ChallengesConfig = InferSelectModel<typeof challengesConfig>;

// Composite types
export type CompleteMatch = Match & {
	MatchInfo: MatchInfo;
	participants: Summoner[];
};

interface Roles {
	role: string;
}

export type CompleteChampionInfo = Partial<
	Omit<ChampionMasteryDTO, "championPoints" | "championLevel">
> &
	Pick<ChampionMasteryDTO, "championPoints" | "championLevel"> &
	ChampionDetails &
	Roles;

// Challenge-related composite types
export type ChallengeConfig = {
	config: ChallengesConfig;
	localization: ChallengeLocalization | null;
};

export type LeaderboardEntry = {
	challenge: Challenge;
	summoner: Summoner;
};
