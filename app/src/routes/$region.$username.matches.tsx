import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import FooterLinks from "~/components/footer/FooterLinks";
import RiotGamesDisclaimer from "~/components/footer/RiotGamesDisclaimer";
import { SiteHeader } from "~/components/header/SiteHeader";
import {
	type MatchSearch,
	parseMatchSearch,
	toServerFilters,
} from "~/features/matches/match-filters";
import { MATCH_PAGE_SIZE, MatchHistorySection } from "~/features/matches/match-history-section";
import { regionToDisplay } from "~/features/shared/champs";
import { parseRiotId } from "~/features/shared/riot-id";
import { FullSummonerUpdate } from "~/features/summoner/components/summoner-update";
import { getMatchesFn } from "~/server/matches/mutations";
import { OptionsProvider } from "~/stores/options-persistent-store";
import { UserProvider } from "~/stores/user-store";
import { metaDescription } from "~/utils/seo";

export const Route = createFileRoute("/$region/$username/matches")({
	// Identity on purpose. Transforming the search here makes TanStack rewrite the URL: `?queue=420`
	// arrives as the *number* 420, so returning it as a string produced a canonicalising 307, and
	// dropping values it could not round-trip produced a 500. Normalisation happens in
	// `parseMatchSearch`, at the two places the values are actually used.
	validateSearch: (search: Record<string, unknown>): Record<string, unknown> => search,
	// Which matches are listed depends on the filters, so a change re-runs the loader instead of
	// being applied client-side only. The URL stays the single source of truth.
	loaderDeps: ({ search }) => parseMatchSearch(search),
	loader: async ({ params: { username, region }, deps }) => {
		const result = await getMatchesFn({
			data: {
				username: parseRiotId(username),
				region,
				take: MATCH_PAGE_SIZE,
				withFilterOptions: true,
				...toServerFilters(deps),
			},
		});

		if (!result.ok) {
			// Mirrors the profile hub: a summoner we cannot resolve is a 404, and a rate limit sends
			// the visitor home rather than pretending the profile has no matches.
			if (result.error === "rate_limit") {
				throw redirect({ to: "/", search: { error: "rate_limit" } });
			}
			throw notFound();
		}

		return {
			user: result.user,
			matches: result.matches,
			availableQueueIds: result.availableQueueIds ?? [],
			availableChampions: result.availableChampions ?? [],
			filters: deps,
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
	const { user, matches, availableQueueIds, availableChampions } = Route.useLoaderData();
	// The route deliberately does not transform its search (see `validateSearch`), so normalise here
	// rather than trusting the URL's types.
	const search = parseMatchSearch(Route.useSearch());
	const navigate = Route.useNavigate();
	const { region, username } = Route.useParams();

	const onSearchChange = (patch: Partial<MatchSearch>) => {
		void navigate({ search: (previous) => ({ ...previous, ...patch }) });
	};

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
									<FullSummonerUpdate user={user} awaitMatches={true} />
								</div>
							</div>

							{/* The key remounts the section on a filter change, which clears the pages
							    appended by "Load more". */}
							<MatchHistorySection
								key={JSON.stringify(search)}
								firstPage={matches}
								availableQueueIds={availableQueueIds}
								availableChampions={availableChampions}
								search={search}
								onSearchChange={onSearchChange}
								onClear={() => void navigate({ search: {} })}
								region={region}
								username={username}
							/>
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
