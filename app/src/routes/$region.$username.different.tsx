import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import FooterLinks from "@/components/footer/FooterLinks";
import RiotGamesDisclaimer from "@/components/footer/RiotGamesDisclaimer";
import { MainTitleLink } from "@/components/header/MainTitleLink";
import Profile from "@/components/header/Profile";
import Search from "@/components/header/Search";
import { ThemeSelector } from "@/components/theme-toggle";
import { DifferentSideBar } from "@/features/challenges/challenge-side-bar";
import { ChampionListHeader } from "@/features/mastery/champion-list-header";
import { RoleChampionList } from "@/features/mastery/role-champion-list";
import { regionToConstant } from "@/features/shared/champs";
import type { CompleteChampionInfo } from "@/features/shared/types";
import { getChallengesConfig } from "@/server/api/get-challenges-config";
import { getUserByNameAndRegion } from "@/server/api/get-user-by-name-and-region";
import {
	getAdaptToAllSituations,
	getChampionOcean,
	getChampionOcean2024Split3,
	getInvincible,
	getJackOfAllChamps,
} from "@/server/challenges/different-challenge-queries";
import { getCompleteChampionData } from "@/server/champions/get-complete-champion-data";
import {
	ChallengeProvider,
	useChallengeContext,
} from "@/stores/challenge-store";
import { OptionsProvider } from "@/stores/options-persistent-store";
import { UserProvider } from "@/stores/user-store";

export const getSummonerByNameRegionDifferent = createServerFn({
	method: "GET",
})
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;

		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion.toUpperCase());

		const user = await getUserByNameAndRegion(username, region);

		const [completeChampionsData, challenges] = await Promise.all([
			getCompleteChampionData(region, user),
			getChallengesConfig(),
		]);
		return {
			user,
			playerChampionInfo: completeChampionsData.completeChampionsData,
			challenges,
			version:
				completeChampionsData.completeChampionsData[0]?.version || "14.3.1",
		};
	});

export const Route = createFileRoute("/$region/$username/different")({
	loader: async ({ params: { username, region } }) => {
		const result = (await getSummonerByNameRegionDifferent({
			data: { username, region },
		})) as any;

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
			title: `LoL Mastery Challenge Tracker: ${username} Profile`,
			meta: [
				{ name: "application-name", content: "LoL Mastery Challenge Tracker" },
				{
					name: "description",
					content:
						"Made using Riot API. Repo can be found using https://github.com/Awolize. Challenge progress tracking for League of Legends.",
				},
				{
					name: "keywords",
					content: [
						region,
						username,
						"LoL",
						"mastery",
						"challenges",
						"tracker",
					].join(", "),
				},
			],
		};
	},
});

// Correct component
export function RouteComponent() {
	const { user, playerChampionInfo, challenges, version, username, region } =
		Route.useLoaderData();

	playerChampionInfo.sort((a: CompleteChampionInfo, b: CompleteChampionInfo) =>
		a.name.localeCompare(b.name),
	);

	const queryParams = useMemo(
		() => ({ username: `${user.gameName}#${user.tagLine}`, region }),
		[user.gameName, user.tagLine, region],
	);

	const ChallengeLogic = () => {
		const selectedChallengeId = useChallengeContext(
			(state) => state.selectedChallengeId,
		);
		const [challengeChampions, setChallengeChampions] = useState<any[]>([]);

		useEffect(() => {
			async function fetchChallenge() {
				if (!selectedChallengeId) {
					setChallengeChampions([]);
					return;
				}
				const challengeMap: { [key: number]: () => Promise<any[]> } = {
					401106: () => getJackOfAllChamps({ data: queryParams }),
					602001: () => getChampionOcean({ data: queryParams }),
					2024308: () => getChampionOcean2024Split3({ data: queryParams }),
					602002: () => getAdaptToAllSituations({ data: queryParams }),
					202303: () => getInvincible({ data: queryParams }),
				};
				const fetchFn = challengeMap[selectedChallengeId];
				if (fetchFn) {
					const data = await fetchFn();
					setChallengeChampions(data || []);
				} else {
					setChallengeChampions([]);
				}
			}
			fetchChallenge();
		}, [selectedChallengeId]);

		return (
			<>
				<header className="sticky top-0 z-30 grid grid-cols-3 w-screen justify-between bg-primary-foreground px-1 md:px-8">
					<MainTitleLink />
					<Profile />
					<Search />

					<div className="absolute top-4 right-4">
						<ThemeSelector />
					</div>
				</header>

				<div className="flex flex-row">
					<DifferentSideBar
						challenges={challenges}
						username={`${user.gameName}#${user.tagLine}`}
						region={region}
					/>
					<main className="flex flex-col flex-1">
						<ChampionListHeader
							challengeChampions={challengeChampions}
							champions={playerChampionInfo}
							version={version}
							profileId={`${user.gameName}-${user.tagLine}`}
						/>
						<RoleChampionList
							champions={playerChampionInfo}
							challengeChampions={challengeChampions}
							version={version}
							profileId={`${user.gameName}-${user.tagLine}`}
						/>
					</main>
				</div>

				<footer className="flex flex-col items-center gap-4 p-2 text-sm opacity-50">
					<FooterLinks />
					<RiotGamesDisclaimer />
				</footer>
			</>
		);
	};

	return (
		<UserProvider user={user}>
			<OptionsProvider persistName={`${user.gameName}-${user.tagLine}`}>
				<ChallengeProvider persistName={`${user.gameName}-${user.tagLine}`}>
					<ChallengeLogic />
				</ChallengeProvider>
			</OptionsProvider>
		</UserProvider>
	);
}
