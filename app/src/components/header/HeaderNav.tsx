import { Link, useRouterState } from "@tanstack/react-router";

import { headerLinkClassName } from "~/components/header/header-link";
import { cn } from "~/components/utils";
import { isShardRegionParam } from "~/features/shared/champs";

/**
 * The header's navigation row: the site-wide challenge directory, plus the summoner's own sections
 * when the URL names one.
 *
 * It lives in its own row on every page so the two kinds of link can sit together without being
 * confused for each other — "All challenges" is the global directory and needs no summoner, while
 * Overview/Mastery/Challenges/Match History are all scoped to the summoner in the URL. The
 * directory link is therefore always rendered; the rest appear only when there is a summoner to
 * scope them to.
 *
 * The row shares the header's link look (`headerLinkClassName`) and adds no divider of its own: an
 * earlier version drew a `border-t` across this row, which split the header into two stacked bars
 * that read as two headers.
 *
 * Route paths carry the params as `$region`/`$username` and are used only for `to`; the link params
 * come from the current URL, so a tab keeps you on the summoner you are already viewing.
 */
const PROFILE_TABS = [
	{
		segment: "",
		to: "/$region/$username",
		label: "Overview",
		// Matched exactly: every profile path starts with the hub's, so a prefix match would light
		// this tab on all of them.
		exact: true,
		hint: "This summoner's profile",
	},
	{
		segment: "mastery",
		exact: false,
		to: "/$region/$username/mastery",
		label: "Mastery",
		// The hub's card copy, kept as a tooltip rather than dropped — it explains what the page is
		// for in a way the label cannot.
		hint: "Mastery Points Tracker — tailored for Catch 'em all, works with Master yourself and Master your enemy",
	},
	{
		segment: "challenge",
		exact: false,
		to: "/$region/$username/challenge",
		label: "Challenges",
		hint: "Challenge Tracker — a helper for specific challenges, like All Random All Champions, Jack of All Champs, and Protean Override.",
	},
	{
		segment: "matches",
		exact: false,
		to: "/$region/$username/matches",
		label: "Match History",
		hint: "View your recent games",
	},
] as const;

export function HeaderNav() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [regionSegment, usernameSegment] = pathname.split("/").filter(Boolean);

	// "All challenges" is the directory, so it is current on its own page and anything under it.
	const directoryActive = pathname === "/challenges" || pathname.startsWith("/challenges/");
	const hasSummoner = Boolean(
		regionSegment && usernameSegment && isShardRegionParam(regionSegment),
	);

	return (
		<nav
			aria-label="Site sections"
			// Centred once there is room for it. While the row has to scroll (phones), centring an
			// overflowing flex row clips the leading items and leaves them unreachable, so it stays
			// start-aligned there and the horizontal scroll does its job.
			//
			// No padding of its own: the header row supplies it, so the links line up with the wordmark
			// and the search whether this sits inline with them or on its own row below.
			className="flex min-w-0 items-center justify-start gap-1 overflow-x-auto md:justify-center"
		>
			<Link
				to="/challenges"
				preload="intent"
				title="Every challenge, with global leaderboards"
				className={cn(
					headerLinkClassName,
					// `shrink-0` so the pills keep their shape while the row scrolls on a phone.
					"shrink-0",
					directoryActive && "border-primary/40 bg-primary/10 text-primary",
				)}
			>
				All challenges
			</Link>

			{hasSummoner ? (
				<>
					<div className="bg-border mx-1 h-6 w-px shrink-0" aria-hidden="true" />
					{PROFILE_TABS.map((tab) => {
						const href = `/${regionSegment}/${usernameSegment}${tab.segment ? `/${tab.segment}` : ""}`;
						// A deeper path under a tab (`/matches/...`) keeps that tab lit; Overview is
						// exact, since every other profile path begins with it.
						const active = tab.exact
							? pathname === href
							: pathname === href || pathname.startsWith(`${href}/`);

						return (
							<Link
								key={tab.label}
								to={tab.to}
								params={{ region: regionSegment!, username: usernameSegment! }}
								title={tab.hint}
								preload="intent"
								// TanStack treats a link to the index route as current on its children, which
								// would mark Overview and the page's own tab both current. Match our rule.
								activeOptions={{ exact: tab.exact }}
								className={cn(
									headerLinkClassName,
									"shrink-0",
									active && "border-primary/40 bg-primary/10 text-primary",
								)}
							>
								{tab.label}
							</Link>
						);
					})}
				</>
			) : null}
		</nav>
	);
}
