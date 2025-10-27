// app/routes/$region/$username.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { Regions } from "twisted/dist/constants";
import FooterLinks from "@/components/footer/FooterLinks";
import RiotGamesDisclaimer from "@/components/footer/RiotGamesDisclaimer";
import { MainTitleLink } from "@/components/header/MainTitleLink";
import Profile from "@/components/header/Profile";
import Search from "@/components/header/Search";
import { ThemeSelector } from "@/components/theme-toggle";
import { db } from "@/db";
import { regionToConstant } from "@/lib/champs";
import { getSummonerByUsernameRateLimit } from "@/server/get-summoner-by-username-rate-limit";

export const getUserByNameAndRegionFn = createServerFn({
	method: "GET",
})
	.inputValidator((input: { username: string; region: Regions }) => input)
	.handler(async ({ data }) => {
		const { username, region } = data;

		try {
			const user = await getSummonerByUsernameRateLimit(
				username.toLowerCase(),
				region,
			)

			const versionRow = await db.query.championDetails.findFirst({
				columns: { version: true },
			})
			const version = versionRow?.version ?? "latest";

			const profileIconUrl = user.summoner?.profileIconId
				? `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${user.summoner.profileIconId}.png`
				: null

			return { summonerData: user.summoner, profileIconUrl, error: null };
		} catch (err: any) {
			console.log(err);

			const error = err?.status === 429 ? "rate_limit" : "not_found";
			return { summonerData: null, profileIconUrl: null, error };
		}
	});

export const Route = createFileRoute("/$region/$username/")({
	loader: async ({ params: { username: rawUsername, region: rawRegion } }) => {
		const username = rawUsername.replace("-", "#");
		const region = regionToConstant(rawRegion.toUpperCase());

		const result = await getUserByNameAndRegionFn({
			data: {
				username,
				region,
			},
		})

		return {
			username,
			region,
			rawUsername,
			rawRegion,
			...result,
		}
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
				{ name: "title", content: "LoL Mastery Tracker: ${username} Profile" },
			],
		}
	},
});

export default function RouteComponent() {
	return (
		<div className="flex flex-col ">
			<header className="sticky top-0 z-30 grid grid-cols-3 w-screen justify-between bg-primary-foreground px-1 md:px-8">
				<MainTitleLink />
				<Profile />
				<Search />

				<div className="absolute top-4 right-4">
					<ThemeSelector />
				</div>
			</header>

			<Client></Client>

			<footer className="flex flex-col items-center gap-4 p-2 text-sm opacity-50">
				<FooterLinks />
				<RiotGamesDisclaimer />
			</footer>
		</div>
	)
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

	if (error === "rate_limit") {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-xl text-red-500">
					Riot API rate limit reached. Please try again in a few seconds.
				</p>
			</div>
		)
	}

	if (!summonerData) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-xl text-red-500">Summoner not found.</p>
			</div>
		)
	}

	const { summonerLevel } = summonerData;

	return (
		<div className="flex h-screen w-screen justify-center">
			<ul className="flex flex-col text-xl">
				<div className="h-5" />
				<div className="relative flex flex-row items-center justify-center gap-6">
					<div className="absolute left-0">
						<img
							src={profileIconUrl!}
							alt={String(username)}
							height={90}
							width={90}
						/>
					</div>
					<div className="flex-col items-center bg-linear-to-r from-green-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
						<div className="text-6xl">{username}</div>
						<div className="flex flex-row items-center justify-between ">
							<div className="font-bold text-sm ">{region}</div>
							<div className="font-bold text-sm ">{summonerLevel}</div>
						</div>
					</div>
				</div>
				<div className="h-10" />
				<div className="flex flex-col items-center">
					<div className="flex flex-col gap-6 ">
						<div>
							<Link
								to="/$region/$username/mastery"
								params={{
									region: rawRegion,
									username: rawUsername,
								}}
								className="underline"
							>
								Mastery Points Tracker
							</Link>
							<div className="text-sm">
								Tailored for{" "}
								<span className="font-bold italic">Catch ’em all</span>, but
								works with{" "}
								<span className="font-bold italic">Master yourself</span> and{" "}
								<span className="font-bold italic">Master your enemy</span>
							</div>
						</div>
						<div>
							<Link
								to="/$region/$username/different"
								params={{
									region: rawRegion,
									username: rawUsername,
								}}
								className="underline"
							>
								Champion Tracker
							</Link>
							<div className="text-sm">
								Manually track heroes. For challenges such as{" "}
								<span className="font-bold italic">
									All Random All Champions
								</span>
								, <span className="font-bold italic">Jack of All Champs</span>,
								and <span className="font-bold italic">Protean Override</span>.
							</div>
						</div>
					</div>
				</div>
			</ul>
		</div>
	)
}
