import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import FooterLinks from "~/components/footer/FooterLinks";
import RiotGamesDisclaimer from "~/components/footer/RiotGamesDisclaimer";
import { SiteHeader } from "~/components/header/SiteHeader";
import type { ChallengeTags } from "~/db/schema";
import ChallengeLeaderboard, {
	type LadderBoardRow,
} from "~/features/challenges/challenge-leaderboard";
import { isLadderRegionId, type LadderRegionId } from "~/features/challenges/ladder-regions";
import { useDataDragonPath } from "~/features/shared/hooks/useDataDragonPath";
import { parseRiotId } from "~/features/shared/riot-id";
import { getChallengeConfig } from "~/server/api/get-challenge-config.api";
import {
	getChallengeLadderFn,
	getTrackedChallengeBoardFn,
} from "~/server/api/get-challenge-ladder.api";
import { getDataDragonVersion } from "~/server/api/mutations";
import { metaDescription } from "~/utils/seo";

interface ChallengeConfig {
	config: {
		id: number;
		state: string | null;
		tracking: string | null;
		leaderboard: boolean;
		startTimestamp: Date | null;
		endTimestamp: Date | null;
		thresholds: Record<string, number>;
		/** Config-DTO `tags`; not read here, but `ChallengeLeaderboard` takes the whole config. */
		tags: ChallengeTags | null;
	};
	localization: {
		id: number;
		language: "en_US";
		description: string;
		name: string;
		shortDescription: string;
	} | null;
}

/**
 * The selected region is the only board choice there is, and it lives in the URL so a board is
 * linkable. The board itself is always Riot's apex ladder; the tracked population is the loader's
 * fallback when Riot cannot be read, not a mode.
 *
 * `validateSearch` must not transform values (TanStack Router coerces single numeric params to
 * numbers and rewrites the URL with a 307 when a validator changes the type), so every field is
 * validated as identity and normalised where it is used.
 */
/**
 * Boards whose page title is not the challenge's own name.
 *
 * CRYSTAL (id 0) is the capstone that scores every other challenge - the only config tagged
 * `isCategory` with no `parent` - so its page is a total-points board rather than one challenge's.
 * A lookup rather than a derived check because the route cannot derive it: the config's `tags` are
 * not part of what `getChallengeConfig` returns here.
 */
const CAPSTONE_BOARD_TITLES: Record<number, string> = {
	0: "Total Challenge Points Leaderboard",
};

const searchSchema = z.object({
	username: z.string().optional(),
	region: z.string().optional(),
	/** A Riot platform id, e.g. `EUW1`. Every non-numeric value stays a string. */
	ladderRegion: z.string().optional(),
	/**
	 * 1-based page of the board. `z.union` rather than `z.coerce.number()` because TanStack Router
	 * hands `?page=2` over as the number `2` and `?page=abc` as a string; transforming either here
	 * makes the router rewrite the URL with a 307.
	 */
	page: z.union([z.number(), z.string()]).optional(),
	pageSize: z.union([z.number(), z.string()]).optional(),
});

/** Parse a search value the router may hand over as a number or a string. */
const toPositiveInt = (value: number | string | undefined): number | null => {
	if (value === undefined) return null;
	const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);
	return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : null;
};

export const Route = createFileRoute("/challenge/$challengeId")({
	validateSearch: searchSchema,
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({
		params: { challengeId: challengeIdRaw },
		deps: { search },
	}): Promise<{
		config: ChallengeConfig;
		rows: LadderBoardRow[];
		population: number;
		/** Whether more rows exist beyond this page. Only the ladder boards are paged. */
		hasMore: boolean;
		page: number;
		pageSize: number;
		ladder: "riot" | "fallback";
		/** `GLOBAL` when every shard is merged; otherwise the selected platform id. */
		selectedRegion: LadderRegionId | "GLOBAL";
		truncated: boolean;
		challengeId: number;
		search: {
			username?: string;
			region?: string;
			ladderRegion?: string;
			page?: number | string;
			pageSize?: number | string;
		};
	}> => {
		const challengeId = parseInt(challengeIdRaw, 10);
		if (isNaN(challengeId)) {
			throw new Error("Invalid challenge ID");
		}

		const selectedRegion: LadderRegionId | "GLOBAL" =
			search.ladderRegion && isLadderRegionId(search.ladderRegion)
				? search.ladderRegion
				: "GLOBAL";

		const config = await getChallengeConfig({ data: { challengeId } });
		if (!config) {
			throw new Error("Challenge not found");
		}

		// Riot cannot be read at all (a hard failure, not a shard with no ladder for this
		// challenge) falls back to the tracked board and says so, rather than rendering an empty
		// ladder as if the challenge had no players.
		const page = toPositiveInt(search.page) ?? 1;
		const pageSize = toPositiveInt(search.pageSize);

		const ladder = await getChallengeLadderFn({
			data: {
				challengeId,
				region: selectedRegion === "GLOBAL" ? null : selectedRegion,
				page,
				pageSize,
			},
		});
		if (ladder) {
			return {
				config: config as ChallengeConfig,
				rows: ladder.rows,
				population: ladder.population,
				hasMore: ladder.hasMore,
				page: ladder.page,
				pageSize: ladder.pageSize,
				ladder: "riot",
				selectedRegion,
				truncated: ladder.truncated,
				challengeId,
				search,
			};
		}

		const tracked = await getTrackedChallengeBoardFn({
			data: { challengeId, region: selectedRegion === "GLOBAL" ? null : selectedRegion },
		});

		return {
			config: config as ChallengeConfig,
			rows: tracked.rows,
			population: tracked.population,
			// The fallback is capped, not paged: nothing to load more of.
			hasMore: false,
			page: 1,
			pageSize: tracked.rows.length,
			ladder: "fallback",
			selectedRegion,
			truncated: false,
			challengeId,
			search,
		};
	},
	component: RouteComponent,
	head: ({ loaderData }) => {
		if (!loaderData) return {};

		const { config, challengeId, search } = loaderData;
		const challengeName = config?.localization?.name || `Challenge ${challengeId}`;
		const challengeDescription =
			config?.localization?.description || "Complete this challenge to earn rewards";

		let title = `LoL Mastery Tracker: ${challengeName}`;
		let description = `League of Legends challenge leaderboard for ${challengeName}. ${challengeDescription}`;

		// Include highlighted user in SEO if present
		if (search.username) {
			const cleanUsername = parseRiotId(search.username);
			title = `${cleanUsername} - ${challengeName} | LoL Mastery Tracker`;
			description = `View ${cleanUsername}'s ranking in the ${challengeName} challenge on Awot's Challenge Tracker. ${challengeDescription}`;
		}

		const resolvedDescription = metaDescription(description);

		return {
			meta: [
				{ name: "application-name", content: "LoL Mastery Tracker" },
				{ name: "description", content: resolvedDescription },
				{
					name: "keywords",
					content: [
						"League of Legends",
						"LoL",
						"challenges",
						"leaderboard",
						"mastery",
						challengeName,
					].join(", "),
				},
				{ name: "title", content: title },
				// Open Graph tags for social sharing
				{ property: "og:title", content: title },
				{ property: "og:description", content: resolvedDescription },
				{ property: "og:type", content: "website" },
				{ property: "og:site_name", content: "LoL Mastery Tracker" },
				// Twitter Card tags
				{ name: "twitter:card", content: "summary" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: resolvedDescription },
			],
		};
	},
});

export default function RouteComponent() {
	const search = Route.useSearch();

	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader
				variant="hub"
				center={
					search.username && search.region ? (
						<Link
							to="/$region/$username"
							params={{
								region: search.region,
								username: search.username.replace("#", "-"),
							}}
							className="rounded p-1 hover:bg-gray-600"
						>
							{parseRiotId(search.username)} ({search.region.toUpperCase()})
						</Link>
					) : undefined
				}
			/>
			<main className="flex-1">
				<Client />
			</main>
			<Footer />
		</div>
	);
}

function Client() {
	const {
		config,
		rows,
		population,
		ladder,
		selectedRegion,
		truncated,
		hasMore,
		page,
		pageSize,
		challengeId,
	} = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data: version = "15.24.1" } = useQuery({
		queryKey: ["dd-version"],
		queryFn: getDataDragonVersion,
	});
	const { getChallengeIcon } = useDataDragonPath(version);

	/** Riot's name for the challenge, which the subtitle uses to say which board this is. */
	const challengeName = config.localization?.name || `Challenge ${challengeId}`;

	// CRYSTAL is the one board that is not "a challenge's points": it scores all of them, so it
	// titles itself rather than the challenge it is stored under. Every other board is that
	// challenge, and says so.
	const headerTitle = CAPSTONE_BOARD_TITLES[challengeId] ?? challengeName;
	const headerSubtitle = CAPSTONE_BOARD_TITLES[challengeId] ? challengeName : null;

	/**
	 * The selected region lives in the URL, so a board is shareable and the back button works.
	 * Choosing the merged board removes the param rather than spelling out a default.
	 */
	/** Paging always drops the region: page 3 of the merged board means nothing for one shard. */
	const setPage = (nextPage: number) => {
		navigate({ search: (prev) => ({ ...prev, page: nextPage }), replace: false });
	};

	const setRegion = (ladderRegion: LadderRegionId | "GLOBAL") => {
		navigate({
			search: (prev) => ({
				...prev,
				ladderRegion: ladderRegion === "GLOBAL" ? undefined : ladderRegion,
				// Page 4 of EUW1 is a different slice than page 4 of the merged board, so a region
				// change starts the new board from the top rather than mid-way through it.
				page: undefined,
			}),
			replace: true,
		});
	};

	return (
		<div className="bg-background min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="mx-auto max-w-4xl space-y-6">
					{/* The art and the title name the board. For most challenges that is the
					    challenge itself; CRYSTAL is the exception and subtitles its own name. */}
					<div className="flex flex-row items-center justify-center gap-4">
						<img
							src={getChallengeIcon(challengeId, config.config.thresholds)}
							alt={challengeName}
							className="h-16 w-16 shrink-0 rounded-lg object-cover"
						/>
						<div className="flex flex-col gap-0.5">
							<h1 className="text-2xl font-bold sm:text-3xl">{headerTitle}</h1>
							{headerSubtitle && (
								<p className="text-muted-foreground text-sm sm:text-base">
									{headerSubtitle}
								</p>
							)}
						</div>
					</div>

					<ChallengeLeaderboard
						config={config}
						rows={rows}
						population={population}
						ladder={ladder}
						selectedRegion={selectedRegion}
						truncated={truncated}
						hasMore={hasMore}
						onLoadMore={hasMore ? () => setPage(page + 1) : undefined}
						rankOffset={(page - 1) * pageSize}
						onRegionChange={setRegion}
						highlightedUser={
							search.username && search.region
								? {
										username: search.username,
										region: search.region,
									}
								: undefined
						}
					/>

					{/* The end of the list, stated rather than left to the reader to infer. When Riot
					    caps a tier this is as far as the ladder goes, and saying so stops a paging
					    control from implying rows exist that Riot will never return. */}
					{!hasMore && rows.length > 0 && (
						<p className="text-muted-foreground/70 px-1 text-center text-xs">
							{truncated
								? `End of the board - all ${rows.length.toLocaleString()} ranked players shown. Riot caps the Master tier, so this ladder ends here.`
								: `End of the board - all ${population.toLocaleString()} ranked players shown.`}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

function Footer() {
	return (
		<footer className="flex flex-col items-center gap-4 p-6 text-sm opacity-50">
			<FooterLinks />
			<RiotGamesDisclaimer />
		</footer>
	);
}
