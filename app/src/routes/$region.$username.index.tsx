import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { motion } from "motion/react";
import FooterLinks from "@/components/footer/FooterLinks";
import RiotGamesDisclaimer from "@/components/footer/RiotGamesDisclaimer";
import { MainTitleLink } from "@/components/header/MainTitleLink";
import Profile from "@/components/header/Profile";
import Search from "@/components/header/Search";
import { ThemeSelector } from "@/components/theme-toggle";
import { regionToConstant } from "@/features/shared/champs";
import { FullSummonerUpdate } from "@/features/summoner/components/summoner-update";
import {
	checkNameChangeFn,
	getUserByNameAndRegionFn,
} from "@/server/summoner/mutations";

const NAV_ITEMS = [
	{
		path: "mastery",
		title: "Mastery Points Tracker",
		description:
			"Tailored for Catch 'em all, works with Master yourself and Master your enemy",
	},
	{
		path: "different",
		title: "Champion Tracker",
		description:
			"Manually track heroes for challenges like All Random All Champions, Jack of All Champs, Protean Override",
	},
	{
		path: "matches",
		title: "Match History",
		description: "View your recent games and performance statistics",
	},
] as const;

const containerVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export const Route = createFileRoute("/$region/$username/")({
	loader: async ({ params: { username: rawUsername, region: rawRegion } }) => {
		const username = rawUsername.replace("-", "#");
		const region = regionToConstant(rawRegion.toUpperCase());

		Sentry.metrics.count("profile_view", 1, {
			attributes: { endpoint: `/${region}/${rawUsername}`, region, username },
		});

		const result = await getUserByNameAndRegionFn({
			data: { username, region },
		});

		if (result.error === "not_found") {
			const migration = await checkNameChangeFn({ data: { username, region } });
			if (migration.found) {
				throw redirect({
					to: "/$region/$username",
					params: { region: rawRegion, username: migration.newUsername },
				});
			}
		}

		return { username, region, rawUsername, rawRegion, ...result };
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
			<Header />
			<main className="flex-1">
				<Client />
			</main>
			<Footer />
		</div>
	);
}

function Client() {
	const {
		username,
		region,
		rawUsername,
		rawRegion,
		summonerData,
		profileIconUrl,
		error,
	} = Route.useLoaderData();

	if (error === "rate_limit")
		return (
			<ErrorState
				title="Riot API rate limit reached"
				message="Please try again in a few seconds."
			/>
		);
	if (!summonerData)
		return (
			<ErrorState
				title="Summoner not found"
				message="Please check the username and region."
			/>
		);

	const { summonerLevel } = summonerData;

	return (
		<div className="flex w-full justify-center px-4 py-8">
			<motion.div
				className="w-full max-w-2xl flex flex-col gap-12"
				variants={containerVariants}
				initial="hidden"
				animate="show"
			>
				<motion.div
					variants={itemVariants}
					className="flex flex-col items-center gap-6"
				>
					<div className="flex flex-col items-center gap-4 sm:flex-row">
						<div className="relative">
							<img
								src={
									profileIconUrl ??
									"/api/images/cdn/latest/img/profileicon/29.webp"
								}
								alt={username}
								className="h-24 w-24 rounded-full border-4 border-primary shadow-lg object-cover bg-accent"
							/>
						</div>
						<div className="flex flex-col items-center sm:items-start">
							<h1 className="bg-linear-to-r from-green-600 via-sky-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent md:text-6xl text-center sm:text-left">
								{username}
							</h1>
							<div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
								<span className="uppercase">{region}</span>
								<span>•</span>
								<span>Level {summonerLevel}</span>
							</div>
						</div>
					</div>

					<FullSummonerUpdate
						user={{ ...summonerData, region }}
						awaitMatches={false}
					/>
				</motion.div>

				<nav className="flex flex-col gap-4">
					{NAV_ITEMS.map(({ path, title, description }) => (
						<motion.div
							key={path}
							variants={itemVariants}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="relative"
						>
							<Link
								to={`/$region/$username/${path}`}
								params={{ region: rawRegion, username: rawUsername }}
								preload="intent"
								className="group block h-full rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary hover:bg-accent/50 hover:shadow-lg"
							>
								<h2 className="text-xl font-semibold transition-colors group-hover:text-primary">
									{title}
								</h2>
								<p className="mt-2 text-sm text-muted-foreground">
									{description}
								</p>
							</Link>
						</motion.div>
					))}
				</nav>
			</motion.div>
		</div>
	);
}

function Header() {
	return (
		<header className="sticky top-0 z-30 grid w-full grid-cols-3 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 py-2 border-b">
			<div className="flex justify-center items-center">
				<MainTitleLink />
			</div>
			<div className="flex justify-center items-center">
				<Profile />
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

function ErrorState({ title, message }: { title: string; message: string }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex h-[60vh] flex-col items-center justify-center gap-2"
		>
			<p className="text-xl font-semibold text-red-500">{title}</p>
			<p className="text-sm text-muted-foreground">{message}</p>
		</motion.div>
	);
}
