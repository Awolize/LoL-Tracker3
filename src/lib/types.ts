import type { InferSelectModel } from "drizzle-orm";
import type { ChampionMasteryDTO } from "twisted/dist/models-dto";
import type {
	challengesConfig,
	championDetails,
	championMastery,
	match,
	matchInfo,
	summoner,
} from "@/db/schema";

export type ChampionMasteryDTOWithoutExtras = Omit<
	ChampionMasteryDTO,
	| "summonerId"
	| "puuid"
	| "markRequiredForNextLevel"
	| "championSeasonMilestone"
	| "nextSeasonMilestone"
>;

// Database model types
export type Match = InferSelectModel<typeof match>;
export type MatchInfo = InferSelectModel<typeof matchInfo>;
export type Summoner = InferSelectModel<typeof summoner>;
export type ChampionDetails = InferSelectModel<typeof championDetails>;
export type ChampionMastery = InferSelectModel<typeof championMastery>;
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
