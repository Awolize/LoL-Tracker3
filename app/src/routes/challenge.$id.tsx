import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import FooterLinks from "@/components/footer/FooterLinks";
import RiotGamesDisclaimer from "@/components/footer/RiotGamesDisclaimer";
import { MainTitleLink } from "@/components/header/MainTitleLink";
import Profile from "@/components/header/Profile";
import Search from "@/components/header/Search";
import { ThemeSelector } from "@/components/theme-toggle";
import ChallengeLeaderboard from "@/features/challenges/challenge-leaderboard";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import { getChallengeConfig } from "@/server/api/get-challenge-config.api";
import { getChallengeLeaderboardWithHighlight } from "@/server/api/get-challenge-leaderboard.api";
import { getDataDragonVersion } from "@/server/api/mutations";

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
		language: string;
		description: string;
		name: string;
		shortDescription: string;
	} | null;
}

const searchSchema = z.object({
	username: z.string().optional(),
	region: z.string().optional(),
});

export const Route = createFileRoute("/challenge/$id")({
	validateSearch: searchSchema,
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({
		params: { id },
		deps: { search },
	}): Promise<{
		config: ChallengeConfig;
		leaderboard: any[];
		hasSections: boolean;
		challengeId: number;
		search: { username?: string; region?: string };
	}> => {
		const challengeId = parseInt(id, 10);
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
		const { config, challengeId, search } = loaderData!;
		const challengeName =
			config?.localization?.name || `Challenge ${challengeId}`;
		const challengeDescription =
			config?.localization?.description ||
			"Complete this challenge to earn rewards";

		let title = `LoL Mastery Tracker: ${challengeName}`;
		let description = `League of Legends challenge leaderboard. ${challengeDescription}`;

		// Include highlighted user in SEO if present
		if (search.username) {
			const cleanUsername = search.username.replace("-", "#");
			title = `${cleanUsername} - ${challengeName} | LoL Mastery Tracker`;
			description = `View ${cleanUsername}'s ranking in the ${challengeName} challenge. ${challengeDescription}`;
		}

		return {
			meta: [
				{ name: "application-name", content: "LoL Mastery Tracker" },
				{ name: "description", content: description },
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
				{ property: "og:description", content: description },
				{ property: "og:type", content: "website" },
				{ property: "og:site_name", content: "LoL Mastery Tracker" },
				// Twitter Card tags
				{ name: "twitter:card", content: "summary" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
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
	const { config, leaderboard, hasSections, challengeId } =
		Route.useLoaderData();
	const search = Route.useSearch();
	const { data: version = "15.24.1" } = useQuery({
		queryKey: ["dd-version"],
		queryFn: getDataDragonVersion,
	});
	const { getChallengeIcon } = useDataDragonPath(version);

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto space-y-6">
					{/* Page Title */}
					<div className="text-center flex flex-row items-center justify-center gap-4">
						<img
							src={getChallengeIcon(challengeId)}
							alt={config.localization?.name || `Challenge ${challengeId}`}
							className="w-24 h-24 rounded-lg object-cover"
						/>
						<div>
							<h1 className="text-4xl font-bold mb-2">
								{config.localization?.name || `Challenge ${challengeId}`}
							</h1>
							{config.localization?.description && (
								<p className="text-lg text-muted-foreground">
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
		<header className="sticky top-0 z-30 grid w-full grid-cols-3 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 py-2 border-b">
			<div className="flex justify-center items-center">
				<MainTitleLink />
			</div>
			<div className="flex justify-center items-center">
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

			<div className="flex items-center w-full relative">
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
