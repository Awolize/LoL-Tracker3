import { createFileRoute } from "@tanstack/react-router";
import FooterLinks from "@/components/footer/FooterLinks";
import RiotGamesDisclaimer from "@/components/footer/RiotGamesDisclaimer";
import { MainTitleLink } from "@/components/header/MainTitleLink";
import Profile from "@/components/header/Profile";
import Search from "@/components/header/Search";
import { ThemeSelector } from "@/components/theme-toggle";
import MatchHistory from "@/features/matches/match-history";
import type { CompleteMatch } from "@/features/shared/types";
import Header from "@/features/summoner/components/summoner-header";
import { getMatchesFn } from "@/server/matches/get-matches";
import { OptionsProvider } from "@/stores/options-persistent-store";
import { UserProvider } from "@/stores/user-store";

export const Route = createFileRoute("/$region/$username/matches")({
	loader: async ({ params: { username, region } }): Promise<any> => {
		const usernameParsed = username.replace("-", "#");

		const result = await getMatchesFn({
			data: { username: usernameParsed, region, take: 50 },
		});

		return {
			user: result.user,
			matches: result.matches,
			region,
			username,
		};
	},
	component: RouteComponent,
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const { username, region } = loaderData;

		return {
			title: `LoL Match History: ${username}`,
			meta: [
				{ name: "application-name", content: "LoL Mastery Tracker" },
				{
					name: "description",
					content: "Match history tracker made using Riot API.",
				},
				{
					name: "keywords",
					content: [region, username, "LoL", "match history", "tracker"].join(
						", ",
					),
				},
			],
		};
	},
});

function RouteComponent() {
	const { user, matches, username, region } = Route.useLoaderData();

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

					<main className="flex flex-col">
						<Header champions={[]} />
						<MatchHistory matches={matches} />
					</main>

					<footer className="flex flex-col items-center gap-4 p-2 text-sm opacity-50">
						<FooterLinks />
						<RiotGamesDisclaimer />
					</footer>
				</div>
			</OptionsProvider>
		</UserProvider>
	);
}
