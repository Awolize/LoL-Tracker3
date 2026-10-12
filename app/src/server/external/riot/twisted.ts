/**
 * The single module the app imports `twisted` from.
 *
 * As of twisted v1.81 the package ships as a single bundle: the `twisted/dist/*`
 * deep paths are gone, and the only type exports are the `Constants` / `Dto`
 * *values* plus a few classes. The DTO types this app annotates with are
 * therefore derived from the client's own method signatures below.
 */
import { Constants, Dto, LolApi, RateLimitError, RiotApi } from "twisted";

export { Constants, LolApi, RateLimitError, RiotApi };

/** Lol/Account routing helpers (unchanged behaviour, new location). */
export const regionToRegionGroup = Constants.regionToRegionGroup;
export const regionToRegionGroupForAccountAPI = Constants.regionToRegionGroupForAccountAPI;

/** Platform routing id, e.g. `"EUW1"`. */
export type Regions = Parameters<LolApi["Summoner"]["getByPUUID"]>[1];

/**
 * A challenge leaderboard level, e.g. `"CHALLENGER"`.
 *
 * Derived from the SDK's own `Leaderboards` signature for the same reason as the DTOs below:
 * v1.81+ exports `Levels` as a value only, so the type has to come off the method.
 */
export type Levels = Parameters<LolApi["Challenges"]["Leaderboards"]>[1];

// ---------------------------------------------------------------------------
// DTO types - derived from the API surface because v1.81+ no longer exports
// these names as types (only the `Dto` value is exported).
// ---------------------------------------------------------------------------

export type ChampionMasteryDTO = InstanceType<typeof Dto.ChampionMasteryDTO>;
export type SummonerV4DTO = InstanceType<typeof Dto.SummonerV4DTO>;
export type ChampionsDataDragonDetails = InstanceType<typeof Dto.ChampionsDataDragonDetails>;
export type AccountDto = Awaited<ReturnType<RiotApi["Account"]["getByRiotId"]>>["response"];
/**
 * A challenge config as Riot ships it.
 *
 * twisted v1.83's `ConfigDTO.Config` predates Riot's `tags` object - the game's own markers for
 * what a challenge is (`isCapstone`, `isCategory`, `parent`, ...) - so it is added here, left as an
 * unknown for the caller to parse, rather than by rewriting the derived DTO shape.
 */
export type ChallengeConfigDTO = Awaited<
	ReturnType<LolApi["Challenges"]["Configs"]>
>["response"][number] & { tags?: unknown };
type PlayerChallengesDTO = Awaited<
	ReturnType<LolApi["Challenges"]["PlayerChallenges"]>
>["response"];
export type PlayerChallengeDTO = PlayerChallengesDTO["challenges"][number];
export type PlayerPreferencesDTO = PlayerChallengesDTO["preferences"];

/** Full Match-V5 match (metadata + info). */
type MatchV5MatchDTO = Awaited<ReturnType<LolApi["MatchV5"]["get"]>>["response"];
/** Match-V5 `info.participants[n]`. */
export type MatchParticipantDTO = MatchV5MatchDTO["info"]["participants"][number];
/** Match-V5 `info.teams[n]`. */
export type MatchTeamDTO = MatchV5MatchDTO["info"]["teams"][number];
