import { Link, useRouterState } from "@tanstack/react-router";

import { headerLinkClassName } from "~/components/header/header-link";
import { cn } from "~/components/utils";
import { isShardRegionParam } from "~/features/shared/champs";

/**
 * The profile's sections, as tabs in the site header.
 *
 * These used to be cards on the hub only, which left the sub-pages as dead ends: from the mastery
 * page there was no way to reach match history except the back button or the site logo.
 *
 * They deliberately share the header's existing link look (`headerLinkClassName` — the small
 * bordered pill used by the wordmark's Challenges link and the summoner link) and add no divider of
 * their own. An earlier version drew a `border-t` across this row, which turned the single header
 * into two stacked bars that read as two separate headers.
 *
 * The route paths carry the params as `$region`/`$username` and are only used for `to`; the link
 * params come from the current URL, so a tab keeps you on the summoner you are already viewing.
 */
const TABS = [
	{
		segment: "mastery",
		to: "/$region/$username/mastery",
		label: "Mastery",
		// The hub's card copy, kept as a tooltip rather than dropped — it explains what the page is
		// for in a way the label cannot.
		hint: "Mastery Points Tracker — tailored for Catch 'em all, works with Master yourself and Master your enemy",
	},
	{
		segment: "challenge",
		to: "/$region/$username/challenge",
		label: "Challenges",
		hint: "Challenge Tracker — a helper for specific challenges, like All Random All Champions, Jack of All Champs, and Protean Override.",
	},
	{
		segment: "matches",
		to: "/$region/$username/matches",
		label: "Match History",
		hint: "View your recent games",
	},
] as const;

/** Derives the summoner from the URL, exactly as `Profile` does, and hides itself off profile routes. */
export function ProfileNav() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [regionSegment, usernameSegment] = pathname.split("/").filter(Boolean);

	if (!regionSegment || !usernameSegment || !isShardRegionParam(regionSegment)) {
		return null;
	}

	return (
		<nav
			aria-label="Profile sections"
			className="flex min-w-0 items-center gap-1 overflow-x-auto px-1 pb-2 md:px-8"
		>
			{TABS.map((tab) => {
				const href = `/${regionSegment}/${usernameSegment}/${tab.segment}`;
				// A deeper path under a tab (`/matches/...`) should keep that tab lit.
				const active = pathname === href || pathname.startsWith(`${href}/`);

				return (
					<Link
						key={tab.segment}
						to={tab.to}
						params={{ region: regionSegment, username: usernameSegment }}
						title={tab.hint}
						preload="intent"
						className={cn(
							headerLinkClassName,
							// `shrink-0` so the pills keep their shape while the row scrolls on a phone.
							"shrink-0",
							active && "border-primary/40 bg-primary/10 text-primary",
						)}
					>
						{tab.label}
					</Link>
				);
			})}
		</nav>
	);
}
