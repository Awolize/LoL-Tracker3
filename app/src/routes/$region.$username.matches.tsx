import { createFileRoute } from "@tanstack/react-router";

import FooterLinks from "~/components/footer/FooterLinks";
import RiotGamesDisclaimer from "~/components/footer/RiotGamesDisclaimer";
import { SiteHeader } from "~/components/header/SiteHeader";
import { MatchHistory } from "~/features/matches/match-history";
import { regionToDisplay } from "~/features/shared/champs";
import { FullSummonerUpdate } from "~/features/summoner/components/summoner-update";
import { getMatchesFn } from "~/server/matches/mutations";
import { OptionsProvider } from "~/stores/options-persistent-store";
import { UserProvider } from "~/stores/user-store";
import { metaDescription } from "~/utils/seo";

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
		const regionLabel = regionToDisplay(region);

		return {
			title: `Match History: ${username} (${regionLabel})`,
			meta: [
				{ name: "application-name", content: "LoL Match History" },
				{
					name: "description",
					content: metaDescription(
						`Review recent League of Legends match history for ${username} on ${regionLabel}. Scan queue types, wins and losses, KDA, damage share, vision, and other post-game stats across the latest games returned from Riot.`,
					),
				},
				{
					name: "keywords",
					content: [
						regionLabel,
						username,
						"LoL",
						"match history",
						"game stats",
						"kda",
						"tracker",
					].join(", "),
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
					<SiteHeader variant="subpage" />

					<main className="flex min-h-screen flex-col px-4 py-8">
						<div className="mx-auto w-full max-w-7xl">
							<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
								<div>
									<h2 className="text-3xl font-bold tracking-tight">
										Match History
									</h2>
									<p className="text-muted-foreground mt-1">
										View detailed results from your recent League of Legends
										games
									</p>
								</div>
								<div className="flex items-center gap-4">
									<div className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-sm">
										{matches.length} matches loaded
									</div>
									<FullSummonerUpdate user={user} awaitMatches={true} />
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
