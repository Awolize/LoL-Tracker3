import { Link, useRouterState } from "@tanstack/react-router";

import { cn } from "~/components/utils";
import { isShardRegionParam } from "~/features/shared/champs";

/**
 * The profile's sections, as header tabs.
 *
 * These used to be cards on the hub only, which left the sub-pages as dead ends: from the mastery
 * page there was no way to reach match history except the back button or the site logo. Living in
 * the header means every profile page can reach every other one.
 *
 * The route paths carry the params as `$region`/`$username` and are only used for `to`; the actual
 * link params come from the current URL, so a tab keeps you on the summoner you are already viewing.
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
			className="flex min-w-0 gap-1 overflow-x-auto border-t px-1 py-1 md:px-8"
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
						aria-current={active ? "page" : undefined}
						preload="intent"
						className={cn(
							"rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
							active
								? "bg-primary/10 text-primary"
								: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
						)}
					>
						{tab.label}
					</Link>
				);
			})}
		</nav>
	);
}
