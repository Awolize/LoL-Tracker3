// app/routes/$region/$username/mastery.tsx
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import ChampionList from "@/components/custom/champions-list";
import Header from "@/components/custom/header";
import MatchHistory from "@/components/custom/match-history";
import SortedChampionList from "@/components/custom/role-sorted-champion-list";
import FooterLinks from "@/components/footer/FooterLinks";
import RiotGamesDisclaimer from "@/components/footer/RiotGamesDisclaimer";
import { MainTitleLink } from "@/components/header/MainTitleLink";
import Profile from "@/components/header/Profile";
import Search from "@/components/header/Search";
import { ThemeSelector } from "@/components/theme-toggle";
import { regionToConstant } from "@/lib/champs";
import type {
	CompleteChampionInfo,
	CompleteMatch,
	Summoner,
} from "@/lib/types";
import { getCompleteChampionData } from "@/server/get-complete-champion-data";
import { getMatches } from "@/server/get-matches";
import { getUserByNameAndRegion } from "@/server/get-user-by-name-and-region";
import {
	OptionsProvider,
	useOptionsPersistentContext,
} from "@/stores/options-persistent-store";
import { UserProvider } from "@/stores/user-store";

export const getSummonerByNameRegion = createServerFn({
	method: "GET",
})
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;

		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion.toUpperCase());

		const user = await getUserByNameAndRegion(username, region);

		const [completeChampionsData, matches] = await Promise.all([
			getCompleteChampionData(region, user),
			getMatches(user, 25),
		]);
		return {
			user,
			playerChampionInfo: completeChampionsData.completeChampionsData,
			matches,
			version: "latest",
		};
	});

export const Route = createFileRoute("/$region/$username/mastery")({
	loader: async ({ params: { username, region } }) => {
		const result = await getSummonerByNameRegion({
			data: { username, region },
		});

		return {
			user: result.user,
			playerChampionInfo: result.playerChampionInfo,
			matches: result.matches,
			version: result.version,
			region,
			username,
		};
	},
	component: RouteComponent,
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const { username, region } = loaderData;

		return {
			title: `LoL Mastery Tracker: ${username} Profile`,
			meta: [
				{ name: "application-name", content: "LoL Mastery Tracker" },
				{
					name: "description",
					content:
						"Made using Riot API. Repo can be found using https://github.com/Awolize. Boilerplate was generated using https://create.t3.gg/",
				},
				{
					name: "keywords",
					content: [region, username, "LoL", "mastery", "tracker"].join(", "),
				},
			],
		};
	},
});

// Correct component
export function RouteComponent() {
	const { user, playerChampionInfo, matches, version, username, region } =
		Route.useLoaderData();

	playerChampionInfo.sort((a: CompleteChampionInfo, b: CompleteChampionInfo) => a.name.localeCompare(b.name));

	return (
		<UserProvider user={user}>
			<OptionsProvider persistName={`${user.gameName}-${user.tagLine}`}>
				<div className="flex flex-col">
					<header className="sticky top-0 z-30 grid grid-cols-3 w-screen justify-between bg-primary-foreground px-1 md:px-8">
						<MainTitleLink />
						<Profile />
						<Search />

						<div className="absolute top-4 right-4">
							<ThemeSelector />
						</div>
					</header>

					<Main
						playerChampionInfo={playerChampionInfo}
						matches={matches}
						user={user}
						version={version}
					/>

					<footer className="flex flex-col items-center gap-4 p-2 text-sm opacity-50">
						<FooterLinks />
						<RiotGamesDisclaimer />
					</footer>
				</div>
			</OptionsProvider>
		</UserProvider>
	);
}

function Main({
	playerChampionInfo,
	matches,
}: {
	user: Summoner;
	playerChampionInfo: CompleteChampionInfo[];
	version: string;
	matches: CompleteMatch[];
}) {
	const byRole = useOptionsPersistentContext((state) => state.byRole);

	return (
		<main className="flex flex-col">
			<Header champions={playerChampionInfo} />

			{byRole ? (
				<SortedChampionList champions={playerChampionInfo} />
			) : (
				<ChampionList champions={playerChampionInfo} />
			)}

			<MatchHistory matches={matches} />
		</main>
	);
}
