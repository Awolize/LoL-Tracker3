import { isClassicChampion } from "~/features/shared/champs";

/**
 * CommunityDragon's client-data mirror is the only live source of the classic ("Jade") set.
 *
 * Data Dragon shipped those entries in 16.15.1 only: from 16.16.1 on, its champion files list the
 * 173 current champions and nothing else. The mode's roster is still in the client data and keeps
 * growing (81 entries at the time of writing, against the 60 first synced), so `ChampionDetails`
 * cannot be kept up to date from the Data Dragon endpoint it already reads.
 */
const CDRAGON_BASE =
	"https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default";
const CDRAGON_CHAMPION_SUMMARY = `${CDRAGON_BASE}/v1/champion-summary.json`;
const cdragonChampion = (id: number) => `${CDRAGON_BASE}/v1/champions/${id}.json`;

/**
 * The patch Data Dragon last exported the classic set in.
 *
 * Only feeds cache keys and the stored-version fallback now that classic art comes from
 * CommunityDragon; it is what the 60 rows already in the table carry.
 */
export const CLASSIC_CHAMPION_VERSION = "16.15.1";

/** The icon CommunityDragon serves for a champion id, square-cropped like Data Dragon's. */
export const classicChampionIconUrl = (id: number): string =>
	`https://cdn.communitydragon.org/latest/champion/${id}/square`;

export type ClassicChampionSummary = {
	id: number;
	alias: string;
	name: string;
	/** The champion's title ("The Fist of Shadow"), called `title` in the per-champion file. */
	description?: string;
	roles: string[];
};

export type ClassicChampionDetail = {
	title?: string;
	shortBio?: string;
	roles?: string[];
	/** The id of the current version this classic entry mirrors. */
	relatedPrimeItemId?: number;
};

const fetchJson = async (url: string): Promise<unknown> => {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`CommunityDragon ${res.status} for ${url}`);
	return res.json();
};

const parseSummaryEntry = (value: unknown): ClassicChampionSummary | null => {
	if (typeof value !== "object" || value === null) return null;

	const entry = value as Record<string, unknown>;
	if (typeof entry.id !== "number") return null;
	if (typeof entry.alias !== "string") return null;
	if (typeof entry.name !== "string") return null;

	return {
		id: entry.id,
		alias: entry.alias,
		name: entry.name,
		description: typeof entry.description === "string" ? entry.description : undefined,
		roles: Array.isArray(entry.roles)
			? entry.roles.filter((role): role is string => typeof role === "string")
			: [],
	};
};

/** The classic entries of the mode's current roster, as the client knows them. */
export const fetchClassicChampions = async (): Promise<ClassicChampionSummary[]> => {
	const data = await fetchJson(CDRAGON_CHAMPION_SUMMARY);
	if (!Array.isArray(data)) throw new Error("CommunityDragon champion summary was not an array");

	return data
		.map(parseSummaryEntry)
		.filter((entry): entry is ClassicChampionSummary => entry !== null)
		.filter((entry) => isClassicChampion(entry.alias));
};

/**
 * One classic champion's own file. The summary carries no lore or mirror id, and this is only
 * fetched for champions the table does not have yet, so it costs nothing on a steady-state sync.
 */
export const fetchClassicChampionDetail = async (id: number): Promise<ClassicChampionDetail> => {
	const data = await fetchJson(cdragonChampion(id));
	if (typeof data !== "object" || data === null) return {};

	const detail = data as Record<string, unknown>;
	return {
		title: typeof detail.title === "string" ? detail.title : undefined,
		shortBio: typeof detail.shortBio === "string" ? detail.shortBio : undefined,
		roles: Array.isArray(detail.roles)
			? detail.roles.filter((role): role is string => typeof role === "string")
			: undefined,
		relatedPrimeItemId:
			typeof detail.relatedPrimeItemId === "number" ? detail.relatedPrimeItemId : undefined,
	};
};

/**
 * Riot's tag spelling for the role names CommunityDragon uses. The tags are not rendered today
 * (lanes come from match data), but storing lowercase client roles in a column Data Dragon fills
 * with `["Mage", "Support"]` would be a quiet inconsistency for whoever reads it next.
 */
const ROLE_TO_TAG: Readonly<Record<string, string>> = {
	assassin: "Assassin",
	fighter: "Fighter",
	mage: "Mage",
	marksman: "Marksman",
	support: "Support",
	tank: "Tank",
};

export const toRiotTags = (roles: readonly string[] | undefined): string[] =>
	(roles ?? []).flatMap((role) => {
		const tag = ROLE_TO_TAG[role.toLowerCase()];
		return tag === undefined ? [] : [tag];
	});
