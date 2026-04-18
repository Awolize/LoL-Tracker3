import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import FooterLinks from "~/components/footer/FooterLinks";
import RiotGamesDisclaimer from "~/components/footer/RiotGamesDisclaimer";
import { MainTitleLink } from "~/components/header/MainTitleLink";
import Profile from "~/components/header/Profile";
import Search from "~/components/header/Search";
import { ThemeSelector } from "~/components/theme-toggle";
import ChallengeLeaderboard from "~/features/challenges/challenge-leaderboard";
import { useDataDragonPath } from "~/features/shared/hooks/useDataDragonPath";
import { getChallengeConfig } from "~/server/api/get-challenge-config.api";
import { getChallengeLeaderboardWithHighlight } from "~/server/api/get-challenge-leaderboard.api";
import { getDataDragonVersion } from "~/server/api/mutations";
import { metaDescription } from "~/utils/seo";

interface ChallengeConfig {
	config: {
		id: number;
		state: string | null;
		leaderboard: boolean;
		endTimestamp: Date | null;
		thresholds: Record<string, number>;
	};
	localization: {
		id: number;
		language: "en_US";
		description: string;
		name: string;
		shortDescription: string;
	} | null;
}

const searchSchema = z.object({
	username: z.string().optional(),
	region: z.string().optional(),
});

export const Route = createFileRoute("/challenge/$challengeId")({
	validateSearch: searchSchema,
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({
		params: { challengeId: challengeIdRaw },
		deps: { search },
	}): Promise<{
		config: ChallengeConfig;
		leaderboard: any[];
		hasSections: boolean;
		challengeId: number;
		search: { username?: string; region?: string };
	}> => {
		const challengeId = parseInt(challengeIdRaw, 10);
		if (isNaN(challengeId)) {
			throw new Error("Invalid challenge ID");
		}

		const [config, leaderboardResult] = await Promise.all([
			getChallengeConfig({ data: { challengeId } }),
			getChallengeLeaderboardWithHighlight({
				data: {
					challengeId,
					username: search.username,
					region: search.region,
				},
			}),
		]);

		if (!config) {
			throw new Error("Challenge not found");
		}

		return {
			config: config as ChallengeConfig,
			leaderboard: leaderboardResult.leaderboard,
			hasSections: leaderboardResult.hasSections,
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
			const cleanUsername = search.username.replace("-", "#");
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
			<Header username={search.username} region={search.region} />
			<main className="flex-1">
				<Client />
			</main>
			<Footer />
		</div>
	);
}

function Client() {
	const { config, leaderboard, hasSections, challengeId } = Route.useLoaderData();
	const search = Route.useSearch();
	const { data: version = "15.24.1" } = useQuery({
		queryKey: ["dd-version"],
		queryFn: getDataDragonVersion,
	});
	const { getChallengeIcon } = useDataDragonPath(version);

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
						leaderboard={leaderboard}
						hasSections={hasSections}
						challengeId={challengeId}
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

function Header({ username, region }: { username?: string; region?: string }) {
	return (
		<header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-30 grid w-full grid-cols-3 border-b px-4 py-2 backdrop-blur">
			<div className="flex items-center justify-center">
				<MainTitleLink />
			</div>
			<div className="flex items-center justify-center">
				{username && region ? (
					<Link
						to="/$region/$username"
						params={{ region, username: username.replace("#", "-") }}
						className="rounded p-1 hover:bg-gray-600"
					>
						{username.replace("-", "#")} ({region.toUpperCase()})
					</Link>
				) : (
					<Profile />
				)}
			</div>

			<div className="relative flex w-full items-center">
				<div className="flex-1">
					<Search />
				</div>

				<div className="absolute top-0 right-0">
					<ThemeSelector />
				</div>
			</div>
		</header>
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
