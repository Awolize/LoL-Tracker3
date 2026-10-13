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
import { getChallengeLadderFn } from "~/server/api/get-challenge-ladder.api";
import { getChallengeLeaderboardWithHighlight } from "~/server/api/get-challenge-leaderboard.api";
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
});

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
		/** Whether more rows exist beyond this page. The board appends the rest on the client. */
		hasMore: boolean;
		/** True when the board has never been read and a sync is running to build it. */
		preparing: boolean;
		/** True when Riot publishes no leaderboard for this challenge, so there is nothing to read. */
		unranked: boolean;
		/** `GLOBAL` when every shard is merged; otherwise the selected platform id. */
		selectedRegion: LadderRegionId | "GLOBAL";
		truncated: boolean;
		challengeId: number;
		search: {
			username?: string;
			region?: string;
			ladderRegion?: string;
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

		// Riot runs a leaderboard for a minority of challenges - 182 of the 405 tracked here, measured
		// 2026-10-13 - and says which in its own config. For the rest the ladder endpoint answers 200
		// with an empty list for every shard and tier, so reading it costs 36 Riot calls to store a
		// board that can never fill. It is not read at all, which also keeps the board out of
		// `ladder-read-at`, the set the refresh sweep works from.
		//
		// Those pages are not left empty: with no official ladder to be confused with, the ranking
		// this tracker can actually produce is worth showing - its own synced challenge values for the
		// profiles it follows. That is a smaller and slower-moving thing than a ladder (it covers the
		// ~50 profiles anyone has refreshed, and only when they refreshed), so the page labels it as
		// ours rather than presenting it as Riot's board.
		if (config.config.leaderboard !== true) {
			const tracked = await getChallengeLeaderboardWithHighlight({ data: { challengeId } });

			return {
				config: config as ChallengeConfig,
				rows: tracked.leaderboard.map((entry) => ({
					puuid: entry.challenge.challengesDetailsId,
					value: entry.challenge.value ?? 0,
					region: entry.summoner.region,
					riotId:
						entry.summoner.gameName !== null && entry.summoner.tagLine !== null
							? {
									gameName: entry.summoner.gameName,
									tagLine: entry.summoner.tagLine,
								}
							: null,
					summoner: {
						puuid: entry.challenge.challengesDetailsId,
						gameName: entry.summoner.gameName,
						tagLine: entry.summoner.tagLine,
						region: entry.summoner.region,
						profileIconId: entry.summoner.profileIconId ?? 0,
					},
				})),
				population: tracked.population,
				hasMore: false,
				preparing: false,
				unranked: true,
				selectedRegion,
				truncated: false,
				challengeId,
				search,
			};
		}

		// Page one only. The board appends the remaining pages itself, so the URL says *which*
		// board is shown (challenge, region) and never how far down the reader has scrolled.
		const ladder = await getChallengeLadderFn({
			data: {
				challengeId,
				region: selectedRegion === "GLOBAL" ? null : selectedRegion,
			},
		});

		// A never-visited board has no rows yet: Riot is being read in the background, so the page
		// says so instead of showing the tracked population as if it were the ladder.
		if (ladder.state === "preparing") {
			return {
				config: config as ChallengeConfig,
				rows: [],
				population: 0,
				hasMore: false,
				preparing: true,
				unranked: false,
				selectedRegion,
				truncated: false,
				challengeId,
				search,
			};
		}

		return {
			config: config as ChallengeConfig,
			rows: ladder.rows,
			population: ladder.population,
			hasMore: ladder.hasMore,
			preparing: false,
			unranked: false,
			selectedRegion,
			truncated: ladder.truncated,
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
		selectedRegion,
		truncated,
		hasMore,
		preparing,
		unranked,
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
	const setRegion = (ladderRegion: LadderRegionId | "GLOBAL") => {
		navigate({
			search: (prev) => ({
				...prev,
				ladderRegion: ladderRegion === "GLOBAL" ? undefined : ladderRegion,
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

					{/* Remounted whenever the board or its readiness changes: appended pages live in the
					    component's state, so a new board has to start from its own page one rather than
					    inherit the previous board's depth. Same contract as the match history section. */}
					<ChallengeLeaderboard
						key={`${challengeId}-${selectedRegion}-${preparing ? "preparing" : "ready"}`}
						config={config}
						firstPage={rows}
						population={population}
						preparing={preparing}
						unranked={unranked}
						challengeId={challengeId}
						selectedRegion={selectedRegion}
						truncated={truncated}
						hasMore={hasMore}
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
