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
 * The selected region is the only board choice there is, and it lives in the URL so a board is
 * linkable. The board itself is always Riot's apex ladder; the tracked population is the loader's
 * fallback when Riot cannot be read, not a mode.
 *
 * `validateSearch` must not transform values (TanStack Router coerces single numeric params to
 * numbers and rewrites the URL with a 307 when a validator changes the type), so every field is
 * validated as identity and normalised where it is used.
 */
/**
 * Riot's localization strings are not plain text: some carry inline markup (`Obtain
 * <em>champions</em>`). React escapes it, so rendering it raw puts the tags on screen - strip
 * them and keep the words rather than trusting the string or injecting HTML.
 */
const plainText = (value: string | null | undefined): string =>
	(value ?? "")
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();

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
		ladder: "riot" | "fallback";
		/** `GLOBAL` when every shard is merged; otherwise the selected platform id. */
		selectedRegion: LadderRegionId | "GLOBAL";
		truncated: boolean;
		challengeId: number;
		search: { username?: string; region?: string; ladderRegion?: string };
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
		const ladder = await getChallengeLadderFn({
			data: { challengeId, region: selectedRegion === "GLOBAL" ? null : selectedRegion },
		});
		if (ladder) {
			return {
				config: config as ChallengeConfig,
				rows: ladder.rows,
				population: ladder.population,
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
	const { config, rows, population, ladder, selectedRegion, truncated, challengeId } =
		Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data: version = "15.24.1" } = useQuery({
		queryKey: ["dd-version"],
		queryFn: getDataDragonVersion,
	});
	const { getChallengeIcon } = useDataDragonPath(version);

	/**
	 * Riot's own summary of the challenge, or nothing rather than an empty line.
	 *
	 * `description` is the fuller sentence and is the cleaner one upstream - `shortDescription`
	 * carries inline markup on 72 of 405 rows ("Obtain <em>champions</em>", "Collect <em>mythic
	 * champion skins</em>") while `description` does on 1 - so it is preferred, with the short one
	 * as the fallback because `description` is empty on a handful of challenges (CRYSTAL's is).
	 */
	const challengeSubtitle = plainText(
		config.localization?.description || config.localization?.shortDescription,
	);

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
					{/* Page title: the challenge's own art, name, and Riot's one-line summar
					    of what it is. `description` is empty for most challenges while
					    `shortDescription` is populated, so prefer the short one and fall back. */}
					<div className="flex flex-row items-center justify-center gap-5">
						<img
							src={getChallengeIcon(challengeId, config.config.thresholds)}
							alt={config.localization?.name || `Challenge ${challengeId}`}
							className="h-20 w-20 shrink-0 rounded-lg object-cover"
						/>
						<div className="flex flex-col gap-1">
							<h2 className="text-3xl font-bold">
								{config.localization?.name || `Challenge ${challengeId}`}
							</h2>
							{challengeSubtitle && (
								<p className="text-muted-foreground text-base">
									{challengeSubtitle}
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
