import { useState } from "react";

import { Button } from "~/components/ui/button";
import { MatchFilterBar } from "~/features/matches/match-filter-bar";
import { type MatchSearch, toServerFilters } from "~/features/matches/match-filters";
import { MatchHistory } from "~/features/matches/match-history";
import type { CompleteMatch } from "~/features/shared/types";
import type { UserChampionOption } from "~/server/matches/match-participants";
import { getMatchesFn } from "~/server/matches/mutations";

export const MATCH_PAGE_SIZE = 50;

interface Props {
	/** Page one, rendered on the server so the page still has content without JS. */
	firstPage: CompleteMatch[];
	availableQueueIds: number[];
	availableChampions: UserChampionOption[];
	search: MatchSearch;
	onSearchChange: (patch: Partial<MatchSearch>) => void;
	onClear: () => void;
	region: string;
	username: string;
}

/**
 * The match list plus its filter bar and paging.
 *
 * The caller must pass `key={JSON.stringify(search)}`: appended pages are held in state, and
 * remounting is what clears them when the filters change. Everything filter-derived otherwise
 * comes from the loader, so the URL stays the single source of truth for *what* is listed.
 */
export function MatchHistorySection({
	firstPage,
	availableQueueIds,
	availableChampions,
	search,
	onSearchChange,
	onClear,
	region,
	username,
}: Props) {
	const [extraPages, setExtraPages] = useState<CompleteMatch[]>([]);
	const [loading, setLoading] = useState(false);
	const [exhausted, setExhausted] = useState(firstPage.length < MATCH_PAGE_SIZE);
	const [error, setError] = useState<string | null>(null);

	const matches = [...firstPage, ...extraPages];
	const lastMatch = matches.at(-1);

	const loadMore = async () => {
		// The cursor is the last row already on screen; without its timestamp there is nothing to
		// page from, and the server would silently restart from the top.
		const cursorTimestamp = lastMatch?.MatchInfo?.gameStartTimestamp;
		if (!lastMatch || !cursorTimestamp || loading) return;

		setLoading(true);
		setError(null);
		try {
			const result = await getMatchesFn({
				data: {
					username,
					region,
					take: MATCH_PAGE_SIZE,
					...toServerFilters(search),
					gameStartTimestampLt: new Date(cursorTimestamp).toISOString(),
					gameIdLt: lastMatch.gameId,
				},
			});

			if (!result.ok) {
				throw new Error(
					result.error === "rate_limit"
						? "Riot is rate limiting right now - try again in a moment."
						: "Could not load more matches",
				);
			}

			const next = (result.matches ?? []) as CompleteMatch[];
			if (next.length < MATCH_PAGE_SIZE) setExhausted(true);
			setExtraPages((current) => [...current, ...next]);
		} catch (caught) {
			setError(caught instanceof Error ? caught.message : "Could not load more matches");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
				<MatchFilterBar
					availableQueueIds={availableQueueIds}
					availableChampions={availableChampions}
					search={search}
					onChange={onSearchChange}
					onClear={onClear}
				/>
				<div className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-sm">
					{matches.length} matches loaded
				</div>
			</div>

			<MatchHistory matches={matches} />

			{matches.length > 0 && (
				<div className="mt-6 flex flex-col items-center gap-2">
					{error && <p className="text-sm text-red-500">{error}</p>}
					{!exhausted && (
						<Button variant="secondary" onClick={loadMore} disabled={loading}>
							{loading ? "Loading…" : "Load more"}
						</Button>
					)}
					{exhausted && <p className="text-muted-foreground text-sm">No more matches</p>}
				</div>
			)}
		</>
	);
}
