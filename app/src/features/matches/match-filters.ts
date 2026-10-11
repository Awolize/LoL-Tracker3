import { z } from "zod";

/**
 * Match-history filters, as they live in the URL.
 *
 * Parsing is hand-written rather than a zod object, because TanStack Router's search parser coerces
 * numeric-looking params to **numbers**: `?queue=420` arrives as `queue: 420`, while `?queue=420,440`
 * arrives as the string `"420,440"`. A zod object would need per-field recovery for that, and the
 * coercion is exactly what catches the next reader out, so it is handled explicitly here (and
 * `parseQueueParam` normalises either shape).
 *
 * The type is still derived from a zod schema so the two cannot drift.
 */
export const matchSearchSchema = z.object({
	queue: z.string().optional(),
	champion: z.coerce.number().int().positive().optional(),
	result: z.enum(["win", "loss"]).optional(),
	since: z.enum(["7d", "30d", "90d", "1y"]).optional(),
});

export type MatchSearch = z.infer<typeof matchSearchSchema>;

type RawSearch = Record<string, unknown>;

/**
 * Lenient by design: an unparseable value is dropped rather than erroring the route, so a
 * hand-edited or stale URL degrades to a broader list instead of a 500.
 */
export const parseMatchSearch = (search: RawSearch): MatchSearch => {
	const parsed: MatchSearch = {};

	// Accepts both shapes TanStack can hand us: `420` (coerced number) and `"420,440"` (string).
	if (typeof search.queue === "string" && search.queue !== "") {
		parsed.queue = search.queue;
	} else if (
		typeof search.queue === "number" &&
		Number.isInteger(search.queue) &&
		search.queue > 0
	) {
		parsed.queue = String(search.queue);
	}

	const champion = Number(search.champion);
	if (Number.isInteger(champion) && champion > 0) parsed.champion = champion;

	if (search.result === "win" || search.result === "loss") parsed.result = search.result;
	if (
		search.since === "7d" ||
		search.since === "30d" ||
		search.since === "90d" ||
		search.since === "1y"
	) {
		parsed.since = search.since;
	}

	return parsed;
};

export const DATE_RANGES = {
	"7d": "Last 7 days",
	"30d": "Last 30 days",
	"90d": "Last 90 days",
	"1y": "Last year",
} as const;

export type DateRangeKey = keyof typeof DATE_RANGES;

const RANGE_DAYS: Record<DateRangeKey, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };

/** The lower bound for a range preset, as an ISO string for the server function, or undefined. */
export const sinceToIso = (since?: DateRangeKey, now = new Date()): string | undefined => {
	if (!since) return undefined;
	const from = new Date(now);
	from.setDate(from.getDate() - RANGE_DAYS[since]);
	return from.toISOString();
};

/** Dropdown values are numbers, so presets travel as a day count with 0 meaning "all time". */
export const sinceToDays = (since?: DateRangeKey): number => (since ? RANGE_DAYS[since] : 0);

export const daysToSince = (days: number): DateRangeKey | undefined =>
	(Object.keys(RANGE_DAYS) as DateRangeKey[]).find((key) => RANGE_DAYS[key] === days);

/**
 * Always accepts `unknown`: TanStack may hand us a number, a string, or an array (`?queue=1&queue=2`),
 * and normalising through `String()` keeps a type surprise from becoming a runtime throw.
 */
export const parseQueueParam = (queue?: unknown): number[] | undefined => {
	if (queue === undefined || queue === null) return undefined;

	const ids = String(queue)
		.split(",")
		.map((part) => Number.parseInt(part, 10))
		.filter((id) => Number.isInteger(id) && id > 0);

	return ids.length ? ids : undefined;
};

export const serialiseQueueParam = (ids: number[]): string | undefined =>
	ids.length ? [...ids].sort((a, b) => a - b).join(",") : undefined;

export const hasActiveFilters = (search: MatchSearch): boolean =>
	Boolean(search.queue || search.champion || search.result || search.since);

/** `win` as the server function wants it, from the URL's `result` param. */
export const resultToWin = (result?: MatchSearch["result"]): boolean | undefined =>
	result === "win" ? true : result === "loss" ? false : undefined;

/**
 * The filter half of a `getMatchesFn` payload. Shared by the route loader (page one) and the
 * "load more" call, so the two cannot drift into filtering differently.
 */
export const toServerFilters = (search: MatchSearch) => ({
	queueIds: parseQueueParam(search.queue),
	championId: search.champion,
	win: resultToWin(search.result),
	gameStartTimestampGte: sinceToIso(search.since),
});
