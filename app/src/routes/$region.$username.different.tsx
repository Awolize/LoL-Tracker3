import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

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
	getPlayerChallengesProgress,
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

const searchSchema = z.object({
	challengeId: z.number().optional(),
});

export const Route = createFileRoute("/$region/$username/different")({
	validateSearch: searchSchema,
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

	const search = useSearch({ from: Route.id });
	const navigate = useNavigate({ from: Route.id });

	const ChallengeLogic = () => {
		const selectedChallengeId = useChallengeContext(
			(state) => state.selectedChallengeId,
		);
		const setSelectedChallengeId = useChallengeContext(
			(state) => state.setSelectedChallengeId,
		);
		const [challengeChampions, setChallengeChampions] = useState<any[]>([]);
		const [playerProgress, setPlayerProgress] = useState<Record<
			number,
			any
		> | null>(null);

		useEffect(() => {
			if (search.challengeId !== undefined) {
				setSelectedChallengeId(search.challengeId);
			}
		}, []);

		useEffect(() => {
			const currentSearchId = search.challengeId;
			const currentStateId = selectedChallengeId;

			if (currentStateId !== currentSearchId) {
				if (currentStateId) {
					navigate({
						search: { challengeId: currentStateId },
						replace: true,
					});
				} else {
					navigate({
						search: {},
						replace: true,
					});
				}
			}
		}, [selectedChallengeId, search.challengeId, navigate]);

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

		useEffect(() => {
			async function fetchPlayerProgress() {
				try {
					const progress = await getPlayerChallengesProgress({
						data: queryParams,
					});
					setPlayerProgress(progress);
				} catch (error) {
					console.error("Failed to fetch player progress:", error);
					setPlayerProgress(null);
				}
			}
			fetchPlayerProgress();
		}, []);

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
						user={user}
					/>
					<main className="flex flex-col flex-1 p-4">
						<ChampionListHeader
							challengeChampions={challengeChampions}
							champions={playerChampionInfo}
							version={version}
							profileId={`${user.gameName}-${user.tagLine}`}
							playerProgress={playerProgress}
							challenges={challenges}
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
