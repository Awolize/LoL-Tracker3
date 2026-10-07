import type { CompleteChampionInfo } from "~/features/shared/types";
import type { Regions as RiotRegion } from "~/server/external/riot/twisted";

/**
 * Riot API platform routing ids, declared as *values only* so client code never has to
 * import the Riot SDK.
 *
 * The SDK types regions as a nominal `enum`, so a string id is not assignable to it even
 * when the value is identical. Server-side signatures therefore use the SDK's own
 * `Regions`, and `regionToConstant` below is the single place that crosses that gap.
 * `RegionsAreValidIds` fails the build if these ids ever drift from the enum.
 */
export const Regions = {
	BRAZIL: "BR1",
	EU_EAST: "EUN1",
	EU_WEST: "EUW1",
	KOREA: "KR",
	LAT_NORTH: "LA1",
	LAT_SOUTH: "LA2",
	AMERICA_NORTH: "NA1",
	OCEANIA: "OC1",
	TURKEY: "TR1",
	RUSSIA: "RU",
	JAPAN: "JP1",
	VIETNAM: "VN2",
	TAIWAN: "TW2",
	SINGAPORE: "SG2",
	MIDDLE_EAST: "ME1",
	PBE: "PBE1",
} as const;

export type Regions = RiotRegion;

type AssertTrue<T extends true> = T;
/** Every id declared above must exist on the SDK enum (see the note on `Regions`). */
export type RegionsAreValidIds = AssertTrue<
	(typeof Regions)[keyof typeof Regions] extends `${RiotRegion}` ? true : false
>;

/**
 * The classic versions of the champions carry this key prefix; the plain keys are the
 * current versions (`Jade_Annie` is the classic Annie, `Annie` the current one).
 */
export const JADE_CHAMPION_PREFIX = "Jade_";

/** True for the classic entries — the ones namespaced with the `Jade_` prefix. */
export const isClassicChampion = (key: string): boolean => key.startsWith(JADE_CHAMPION_PREFIX);

/** The key without the classic prefix (`Jade_Annie` -> `Annie`). */
export const baseChampionKey = (key: string): string =>
	isClassicChampion(key) ? key.slice(JADE_CHAMPION_PREFIX.length) : key;

/**
 * The classic and current versions are two separate sets that are never listed together.
 * `showClassic` selects which one — false, the default, is the current version.
 */
export const championSetFilter = <T extends { key: string }>(
	champions: T[],
	showClassic: boolean,
): T[] => champions.filter((champ) => isClassicChampion(champ.key) === showClassic);

export const filteredOut = (
	champ: CompleteChampionInfo,
	filterPoints: number,
	filterLevel: number,
	filterPointsDirection: "above" | "below",
	filterLevelDirection: "above" | "below",
) => {
	let levelFiltered = false;
	if (filterLevel > 0) {
		if (filterLevelDirection === "above") {
			levelFiltered = champ.championLevel <= filterLevel;
		} else {
			levelFiltered = champ.championLevel >= filterLevel;
		}
	}
	let pointsFiltered = false;
	if (filterPoints !== Number.MAX_SAFE_INTEGER) {
		if (filterPointsDirection === "above") {
			pointsFiltered = champ.championPoints <= filterPoints;
		} else {
			pointsFiltered = champ.championPoints >= filterPoints;
		}
	}
	const disabled: boolean = pointsFiltered || levelFiltered;
	return disabled;
};

enum SortOrder {
	Points = 0,
	AZ = 1,
	Level = 2,
}

export const sortAlgorithm = (
	sortOrder: SortOrder,
	a: CompleteChampionInfo,
	b: CompleteChampionInfo,
): number => {
	switch (sortOrder) {
		case SortOrder.Points:
			if (a.championPoints === b.championPoints) {
				return sortAlgorithm(SortOrder.AZ, a, b);
			}
			return a.championPoints > b.championPoints ? -1 : 1;
		case SortOrder.AZ:
			return a.name.localeCompare(b.name);
		case SortOrder.Level:
			if (a.championLevel === b.championLevel) {
				return sortAlgorithm(SortOrder.Points, a, b);
			}
			return a.championLevel > b.championLevel ? -1 : 1;
		default:
			return a.name.localeCompare(b.name);
	}
};

/** URL/search param spellings (uppercase) that map to a Riot platform id. */
const REGION_PARAM_TO_CONSTANT = {
	BR: Regions.BRAZIL,
	EUNE: Regions.EU_EAST,
	EUW: Regions.EU_WEST,
	EUW1: Regions.EU_WEST,
	KR: Regions.KOREA,
	LA1: Regions.LAT_NORTH,
	LA2: Regions.LAT_SOUTH,
	NA1: Regions.AMERICA_NORTH,
	OC1: Regions.OCEANIA,
	TR1: Regions.TURKEY,
	RU: Regions.RUSSIA,
	JP1: Regions.JAPAN,
	PBE1: Regions.PBE,
} as Record<string, string>;

export const isShardRegionParam = (region: string): boolean =>
	Boolean(REGION_PARAM_TO_CONSTANT[region.toUpperCase()]);

export const regionToConstant = (region: string): Regions => {
	const key = region.toUpperCase();
	const mapped = REGION_PARAM_TO_CONSTANT[key];
	if (!mapped) {
		throw new Error(`Invalid region: ${region}`);
	}

	// These ids are the same strings the SDK enum declares (see `RegionsAreValidIds`); the
	// SDK types them nominally, so this is the one place we assert across that gap.
	return mapped as unknown as Regions;
};

export const regionToDisplay = (region: string): string => {
	const keys = Object.keys({
		BR: Regions.BRAZIL,
		EUNE: Regions.EU_EAST,
		EUW: Regions.EU_WEST,
		EUW1: Regions.EU_WEST,
		KR: Regions.KOREA,
		LA1: Regions.LAT_NORTH,
		LA2: Regions.LAT_SOUTH,
		NA1: Regions.AMERICA_NORTH,
		OC1: Regions.OCEANIA,
		TR1: Regions.TURKEY,
		RU: Regions.RUSSIA,
		JP1: Regions.JAPAN,
		PBE1: Regions.PBE,
	});

	const upper = region.toUpperCase();
	if (!keys.includes(upper)) {
		return upper;
	}

	const rootToRegions = new Map<string, Set<Regions>>();
	for (const key of keys) {
		const root = key.replace(/\d+$/, "");
		if (!rootToRegions.has(root)) rootToRegions.set(root, new Set());
		rootToRegions.get(root)?.add(regionToConstant(key));
	}

	const root = upper.replace(/\d+$/, "");
	const size = rootToRegions.get(root)?.size || 0;
	if (size === 1) {
		return root;
	} else {
		return upper;
	}
};
