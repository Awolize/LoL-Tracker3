// app/routes/$region/$username/mastery.tsx
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import ChampionList from "@/components/custom/champions-list";
import Header from "@/components/custom/header";
import MatchHistory from "@/components/custom/match-history";
import SortedChampionList from "@/components/custom/role-sorted-champion-list";
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

	playerChampionInfo.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<UserProvider user={user}>
			<OptionsProvider persistName={`${user.gameName}-${user.tagLine}`}>
				<Main
					playerChampionInfo={playerChampionInfo}
					matches={matches}
					user={user}
					version={version}
				/>
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
