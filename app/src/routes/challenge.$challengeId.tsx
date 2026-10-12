import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import FooterLinks from "~/components/footer/FooterLinks";
import RiotGamesDisclaimer from "~/components/footer/RiotGamesDisclaimer";
import { SiteHeader } from "~/components/header/SiteHeader";
import type { ChallengeTags } from "~/db/schema";
import ChallengeLeaderboard, {
	type LadderBoardRow,
	type LadderSource,
} from "~/features/challenges/challenge-leaderboard";
import { isLadderRegionId, type LadderRegionId } from "~/features/challenges/ladder-regions";
import { useDataDragonPath } from "~/features/shared/hooks/useDataDragonPath";
import { parseRiotId } from "~/features/shared/riot-id";
import { getChallengeConfig } from "~/server/api/get-challenge-config.api";
import {
	LADDER_BOARD_LIMIT,
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
 * The two boards this page can show, spelled in the URL so a board is linkable.
 *
 * `riot` is Riot's own regional apex ladder (Challenger/Grandmaster/Master only); `tracked` is
 * this tracker's own synced population, which covers every tier but only the profiles we hold.
 * `validateSearch` must not transform values (TanStack Router coerces single numeric params to
 * numbers and rewrites the URL with a 307 when a validator changes the type), so every field is
 * validated as identity and normalised where it is used.
 */
const searchSchema = z.object({
	username: z.string().optional(),
	region: z.string().optional(),
	source: z.string().optional(),
	/** A Riot platform id, e.g. `EUW1`. Every non-numeric value stays a string. */
	ladderRegion: z.string().optional(),
});

const isLadderSource = (value: string | undefined): value is LadderSource =>
	value === "riot" || value === "tracked";

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
		source: LadderSource;
		/** `GLOBAL` when every shard is merged; otherwise the selected platform id. */
		selectedRegion: LadderRegionId | "GLOBAL";
		truncated: boolean;
		emptyRegions: string[];
		challengeId: number;
		search: { username?: string; region?: string; source?: string; ladderRegion?: string };
	}> => {
		const challengeId = parseInt(challengeIdRaw, 10);
		if (isNaN(challengeId)) {
			throw new Error("Invalid challenge ID");
		}

		const requested: LadderSource = isLadderSource(search.source) ? search.source : "riot";
		const selectedRegion: LadderRegionId | "GLOBAL" =
			search.ladderRegion && isLadderRegionId(search.ladderRegion)
				? search.ladderRegion
				: "GLOBAL";

		const config = await getChallengeConfig({ data: { challengeId } });
		if (!config) {
			throw new Error("Challenge not found");
		}

		// Asking for the Riot ladder when Riot cannot be read (a hard failure, not a missing
		// regional ladder) falls back to the tracked board and says so, rather than rendering an
		// empty ladder as if the challenge had no players.
		if (requested === "riot") {
			const ladder = await getChallengeLadderFn({
				data: { challengeId, region: selectedRegion === "GLOBAL" ? null : selectedRegion },
			});
			if (ladder && ladder.source === "riot") {
				return {
					config: config as ChallengeConfig,
					rows: ladder.rows,
					population: ladder.population,
					source: "riot",
					selectedRegion,
					truncated: ladder.truncated,
					emptyRegions: ladder.emptyRegions,
					challengeId,
					search,
				};
			}
		}

		const tracked = await getTrackedChallengeBoardFn({
			data: { challengeId, region: selectedRegion === "GLOBAL" ? null : selectedRegion },
		});

		return {
			config: config as ChallengeConfig,
			rows: tracked.rows,
			population: tracked.population,
			source: "tracked",
			selectedRegion,
			truncated: false,
			emptyRegions: [],
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
		source,
		selectedRegion,
		truncated,
		emptyRegions,
		challengeId,
	} = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data: version = "15.24.1" } = useQuery({
		queryKey: ["dd-version"],
		queryFn: getDataDragonVersion,
	});
	const { getChallengeIcon } = useDataDragonPath(version);

	/**
	 * The board choice lives in the URL, so a region or a source is shareable and the back button
	 * works. Both setters replace rather than push: flipping between boards is not navigation.
	 */
	const setBoard = (next: {
		source?: LadderSource;
		ladderRegion?: LadderRegionId | "GLOBAL";
	}) => {
		navigate({
			search: (prev) => ({
				...prev,
				source: next.source ?? source,
				ladderRegion:
					next.ladderRegion === undefined
						? selectedRegion
						: next.ladderRegion === "GLOBAL"
							? undefined
							: next.ladderRegion,
			}),
			replace: true,
		});
	};

	return (
		<div className="bg-background min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="mx-auto max-w-4xl space-y-6">
					{/* Page Title */}
					<div className="flex flex-row justify-center gap-4 text-center">
						<img
							src={getChallengeIcon(challengeId, config.config.thresholds)}
							alt={config.localization?.name || `Challenge ${challengeId}`}
							className="h-24 w-24 rounded-lg object-cover"
						/>
						<div>
							<h2 className="mb-2 text-4xl font-bold">
								{config.localization?.name || `Challenge ${challengeId}`}
							</h2>
							{config.localization?.description && (
								<p className="text-muted-foreground text-lg">
									{config.localization.description}
								</p>
							)}
						</div>
					</div>

					<ChallengeLeaderboard
						config={config}
						rows={rows}
						population={population}
						source={source}
						selectedRegion={selectedRegion}
						truncated={truncated}
						emptyRegions={emptyRegions}
						onSourceChange={(next) => setBoard({ source: next })}
						onRegionChange={(next) => setBoard({ ladderRegion: next })}
						highlightedUser={
							search.username && search.region
								? {
										username: search.username,
										region: search.region,
									}
								: undefined
						}
					/>

					{/* The board cap, stated rather than implied by a truncated list. */}
					{population > rows.length && (
						<p className="text-muted-foreground/70 px-1 text-center text-xs">
							Showing the top {Math.min(rows.length, LADDER_BOARD_LIMIT)} of{" "}
							{population.toLocaleString()} ranked players.
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
