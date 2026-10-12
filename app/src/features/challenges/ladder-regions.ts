/**
 * The platform shards whose apex ladders the tracker reads.
 *
 * Kept in its own module with no `ioredis`/`twisted` import so routes can name a region in the
 * URL and the UI can list them, without a client module reaching the Riot SDK or Redis.
 */

/** A Riot platform routing id, e.g. `"EUW1"`. Values match the SDK's own enum. */
export const LADDER_REGIONS = [
	{ id: "EUW1", label: "EU West" },
	{ id: "EUN1", label: "EU Nordic & East" },
	{ id: "NA1", label: "North America" },
	{ id: "KR", label: "Korea" },
	{ id: "BR1", label: "Brazil" },
	{ id: "LA1", label: "LAN" },
	{ id: "LA2", label: "LAS" },
	{ id: "OC1", label: "Oceania" },
	{ id: "TR1", label: "Turkey" },
	{ id: "JP1", label: "Japan" },
	{ id: "RU", label: "Russia" },
	{ id: "VN2", label: "Vietnam" },
] as const;

export type LadderRegionId = (typeof LADDER_REGIONS)[number]["id"];

/** Region ids present in {@link LADDER_REGIONS}; route search params validate against this. */
export const isLadderRegionId = (value: string): value is LadderRegionId =>
	LADDER_REGIONS.some((region) => region.id === value);

export const ladderRegionLabel = (id: string): string =>
	LADDER_REGIONS.find((region) => region.id === id)?.label ?? id;
