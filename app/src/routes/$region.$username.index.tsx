// app/routes/$region/$username.tsx

import * as Sentry from "@sentry/tanstackstart-react";
import {
	createFileRoute,
	Link,
	redirect,
	useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import FooterLinks from "@/components/footer/FooterLinks";
import RiotGamesDisclaimer from "@/components/footer/RiotGamesDisclaimer";
import { MainTitleLink } from "@/components/header/MainTitleLink";
import Profile from "@/components/header/Profile";
import Search from "@/components/header/Search";
import { ThemeSelector } from "@/components/theme-toggle";
import { regionToConstant } from "@/features/shared/champs";
import { checkNameChangeFn } from "@/server/summoner/check-name-change.api";
import {
	getUserByNameAndRegionFn,
	refreshSummonerDataFn,
} from "@/server/summoner/summoner.api";

export const Route = createFileRoute("/$region/$username/")({
	loader: async ({ params: { username: rawUsername, region: rawRegion } }) => {
		const username = rawUsername.replace("-", "#");
		const region = regionToConstant(rawRegion.toUpperCase());

		Sentry.metrics.count("profile_view", 1, {
			attributes: {
				endpoint: `/${region}/${username}`,
				region: region,
				username: username,
			},
		});

		const result = await getUserByNameAndRegionFn({
			data: { username, region },
		});

		if (result.error === "not_found") {
			// Type is now inferred correctly
			const migrationResult = await checkNameChangeFn({
				data: { username, region },
			});

			// TS now knows if found is true, newUsername exists
			if (migrationResult.found) {
				throw redirect({
					to: "/$region/$username",
					// The ! is safe here, or TS usually understands the union automatically
					params: { region: rawRegion, username: migrationResult.newUsername },
				});
			}
		}

		return {
			username,
			region,
			rawUsername,
			rawRegion,
			...result,
		};
	},
	component: RouteComponent,
	head: ({ loaderData }) => {
		if (!loaderData) return {};

		const { username, region } = loaderData;

		return {
			meta: [
				{ name: "application-name", content: "LoL Mastery Tracker" },
				{
					name: "description",
					content:
						"Made using Riot API. Repo can be found at https://github.com/Awolize. Built with Tanstack Start",
				},
				{
					name: "keywords",
					content: [region, username, "LoL", "mastery", "tracker"].join(", "),
				},
				{ name: "title", content: `LoL Mastery Tracker: ${username} Profile` },
			],
		};
	},
});

export default function RouteComponent() {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-30 grid w-screen grid-cols-3 justify-between bg-primary-foreground px-1 md:px-8">
				<MainTitleLink />
				<Profile />
				<Search />

				<div className="absolute right-4 top-4">
					<ThemeSelector />
				</div>
			</header>

			<main className="flex-1">
				<Client />
			</main>

			<footer className="flex flex-col items-center gap-4 p-2 text-sm opacity-50">
				<FooterLinks />
				<RiotGamesDisclaimer />
			</footer>
		</div>
	);
}

function Client() {
	const router = useRouter();
	const {
		username,
		region,
		rawUsername,
		rawRegion,
		summonerData,
		profileIconUrl,
		error,
		isCached,
		lastUpdated,
	} = Route.useLoaderData();

	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			await refreshSummonerDataFn({
				data: { username, region },
			});

			// Invalidate the route to trigger a re-fetch
			await router.invalidate();
		} catch (err) {
			console.error("Failed to refresh:", err);
		} finally {
			setIsRefreshing(false);
		}
	};

	if (error === "rate_limit") {
		return (
			<div className="flex h-[80vh] items-center justify-center">
				<div className="text-center">
					<p className="text-xl text-red-500">Riot API rate limit reached.</p>
					<p className="mt-2 text-sm text-muted-foreground">
						Please try again in a few seconds.
					</p>
				</div>
			</div>
		);
	}

	if (!summonerData) {
		return (
			<div className="flex h-[80vh] items-center justify-center">
				<div className="text-center">
					<p className="text-xl text-red-500">Summoner not found.</p>
					<p className="mt-2 text-sm text-muted-foreground">
						Please check the username and region.
					</p>
				</div>
			</div>
		);
	}

	const { summonerLevel } = summonerData;

	const lastUpdateDate = lastUpdated ? new Date(lastUpdated) : null;
	const timeSinceUpdate = lastUpdateDate
		? Math.floor((Date.now() - lastUpdateDate.getTime()) / 1000 / 60) // minutes
		: null;

	return (
		<div className="flex w-full justify-center px-4 py-8">
			<div className="w-full max-w-2xl">
				{/* Profile Header */}
				<div className="flex flex-col items-center gap-6">
					<div className="flex flex-col items-center gap-4 sm:flex-row">
						<img
							src={profileIconUrl!}
							alt={String(username)}
							className="h-24 w-24 rounded-full border-4 border-primary shadow-lg"
						/>
						<div className="flex flex-col items-center sm:items-start">
							<h1 className="bg-gradient-to-r from-green-600 via-sky-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
								{username}
							</h1>
							<div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
								<span className="uppercase">{region}</span>
								<span>•</span>
								<span>Level {summonerLevel}</span>
							</div>
						</div>
					</div>

					{/* Cache Status & Refresh Button */}
					<div className="flex flex-col items-center gap-2 text-xs text-muted-foreground sm:flex-row">
						{isCached && timeSinceUpdate !== null && (
							<span>
								Last updated{" "}
								{timeSinceUpdate < 1
									? "just now"
									: timeSinceUpdate < 60
										? `${timeSinceUpdate}m ago`
										: timeSinceUpdate < 1440
											? `${Math.floor(timeSinceUpdate / 60)}h ago`
											: `${Math.floor(timeSinceUpdate / 1440)}d ago`}
							</span>
						)}
						<button
							onClick={handleRefresh}
							disabled={isRefreshing}
							className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
							title="Fetch latest data from Riot API"
						>
							{isRefreshing ? (
								<span className="flex items-center gap-2">
									<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
											fill="none"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Refreshing...
								</span>
							) : (
								<span className="flex items-center gap-2">
									<svg
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/>
									</svg>
									Refresh
								</span>
							)}
						</button>
					</div>
				</div>

				{/* Navigation Cards */}
				<nav className="mt-12 flex flex-col gap-6">
					<Link
						to="/$region/$username/mastery"
						params={{
							region: rawRegion,
							username: rawUsername,
						}}
						preload="intent"
						className="group rounded-lg border border-border p-6 transition-all hover:border-primary hover:bg-accent/50 hover:shadow-lg"
					>
						<h2 className="text-xl font-semibold transition-colors group-hover:text-primary">
							Mastery Points Tracker
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							Tailored for{" "}
							<span className="font-bold italic">Catch 'em all</span>, but works
							with <span className="font-bold italic">Master yourself</span> and{" "}
							<span className="font-bold italic">Master your enemy</span>
						</p>
					</Link>

					<Link
						to="/$region/$username/matches"
						params={{
							region: rawRegion,
							username: rawUsername,
						}}
						preload="intent"
						className="group rounded-lg border border-border p-6 transition-all hover:border-primary hover:bg-accent/50 hover:shadow-lg"
					>
						<h2 className="text-xl font-semibold transition-colors group-hover:text-primary">
							Match History
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							View your recent games and performance statistics.
						</p>
					</Link>

					<Link
						to="/$region/$username/different"
						params={{
							region: rawRegion,
							username: rawUsername,
						}}
						preload="intent"
						className="group rounded-lg border border-border p-6 transition-all hover:border-primary hover:bg-accent/50 hover:shadow-lg"
					>
						<h2 className="text-xl font-semibold transition-colors group-hover:text-primary">
							Champion Tracker
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							Manually track heroes. For challenges such as{" "}
							<span className="font-bold italic">All Random All Champions</span>
							, <span className="font-bold italic">Jack of All Champs</span>,
							and <span className="font-bold italic">Protean Override</span>.
						</p>
					</Link>
				</nav>
			</div>
		</div>
	);
}
