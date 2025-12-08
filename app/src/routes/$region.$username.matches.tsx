import { createFileRoute } from "@tanstack/react-router";
import FooterLinks from "@/components/footer/FooterLinks";
import RiotGamesDisclaimer from "@/components/footer/RiotGamesDisclaimer";
import { MainTitleLink } from "@/components/header/MainTitleLink";
import Profile from "@/components/header/Profile";
import Search from "@/components/header/Search";
import { ThemeSelector } from "@/components/theme-toggle";
import { MatchHistory } from "@/features/matches/match-history";
import { FullSummonerUpdate } from "@/features/summoner/components/summoner-update";
import { getMatchesFn } from "@/server/matches/get-matches.api";
import { OptionsProvider } from "@/stores/options-persistent-store";
import { UserProvider } from "@/stores/user-store";

export const Route = createFileRoute("/$region/$username/matches")({
	loader: async ({ params: { username, region } }) => {
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
	const { user, matches } = Route.useLoaderData();

	return (
		<UserProvider user={user}>
			<OptionsProvider persistName={`${user.gameName}-${user.tagLine}`}>
				<div className="flex min-h-screen flex-col">
					<header className="sticky top-0 z-30 grid w-screen grid-cols-3 justify-between bg-primary-foreground px-1 md:px-8">
						<MainTitleLink />
						<Profile />
						<Search />

						<div className="absolute right-4 top-4">
							<ThemeSelector />
						</div>
					</header>

					<main className="flex flex-col px-4 py-8 min-h-screen">
						<div className="max-w-7xl mx-auto w-full">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
								<div>
									<h1 className="text-3xl font-bold tracking-tight">
										Match History
									</h1>
									<p className="text-muted-foreground mt-1">
										View detailed results from your recent League of Legends
										games
									</p>
								</div>
								<div className="flex items-center gap-4">
									<div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
										{matches.length} matches loaded
									</div>
									<FullSummonerUpdate user={user} />
								</div>
							</div>

							<MatchHistory matches={matches} />
						</div>
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
