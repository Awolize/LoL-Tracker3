import { createFileRoute } from "@tanstack/react-router";
import FooterLinks from "@/components/footer/FooterLinks";
import RiotGamesDisclaimer from "@/components/footer/RiotGamesDisclaimer";
import { MainTitleLink } from "@/components/header/MainTitleLink";
import Profile from "@/components/header/Profile";
import Search from "@/components/header/Search";
import { ThemeSelector } from "@/components/theme-toggle";
import ChampionList from "@/features/mastery/champions-list";
import SortedChampionList from "@/features/mastery/role-sorted-champion-list";
import type { CompleteChampionInfo, Summoner } from "@/features/shared/types";
import Header from "@/features/summoner/components/summoner-header";
import { getSummonerByNameRegion } from "@/server/summoner/mutations";
import {
	OptionsProvider,
	useOptionsPersistentContext,
} from "@/stores/options-persistent-store";
import { UserProvider } from "@/stores/user-store";

export const Route = createFileRoute("/$region/$username/mastery")({
	loader: async ({ params: { username, region } }) => {
		const result = (await getSummonerByNameRegion({
			data: { username, region },
		})) as {
			user: Summoner;
			playerChampionInfo: CompleteChampionInfo[];
			challenges: any[];
			version: string;
		};

		return {
			user: result.user,
			playerChampionInfo: result.playerChampionInfo,
			challenges: result.challenges,
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
			title: `Champion Mastery: ${username} (${region})`,
			meta: [
				{ name: "application-name", content: "LoL Mastery Tracker" },
				{
					name: "description",
					content: `Track League of Legends champion mastery points for ${username}. View mastery levels, chests available, and progress towards mastery milestones.`,
				},
				{
					name: "keywords",
					content: [
						region,
						username,
						"LoL",
						"champion mastery",
						"mastery points",
						"chests",
						"tracker",
					].join(", "),
				},
			],
		};
	},
});

export function RouteComponent() {
	const { user, playerChampionInfo, version } = Route.useLoaderData();

	playerChampionInfo.sort((a: CompleteChampionInfo, b: CompleteChampionInfo) =>
		a.name.localeCompare(b.name),
	);

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
}: {
	user: Summoner;
	playerChampionInfo: CompleteChampionInfo[];
	version: string;
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
		</main>
	);
}
