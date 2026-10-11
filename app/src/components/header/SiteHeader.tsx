import type { ReactNode } from "react";

import { HeaderNav } from "~/components/header/HeaderNav";
import { MainTitleLink } from "~/components/header/MainTitleLink";
import Search from "~/components/header/Search";
import { ThemeSelector } from "~/components/theme-toggle";
import { cn } from "~/components/utils";

/** `hub` — frosted bar on profile home, challenges index, global leaderboards. `subpage` — solid bar under a summoner (mastery, matches, challenge tracker). */
type SiteHeaderVariant = "hub" | "subpage";

const shellClassName = "relative sticky top-0 z-30 w-full min-w-0 border-b";

const rowClassName = "grid w-full min-w-0 grid-cols-3 items-center px-1 py-2 md:px-8";

const variantClassName: Record<SiteHeaderVariant, string> = {
	hub: "bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur",
	subpage: "bg-primary-foreground",
};

type SiteHeaderProps = {
	/** Center column; empty by default, since navigation lives in `HeaderNav`. */
	center?: ReactNode;
	/** @default "hub" */
	variant?: SiteHeaderVariant;
};

export function SiteHeader({ center, variant = "hub" }: SiteHeaderProps) {
	return (
		<header className={cn(shellClassName, variantClassName[variant])}>
			<div className={rowClassName}>
				<div className="flex min-w-0 items-center justify-center">
					<MainTitleLink />
				</div>
				<div className="flex min-w-0 items-center justify-center">{center}</div>
				<div className="relative flex min-w-0 items-center pe-11 sm:pe-12">
					<div className="min-w-0 flex-1">
						<Search />
					</div>
					<div className="absolute top-1/2 right-0 -translate-y-1/2 sm:right-1">
						<ThemeSelector />
					</div>
				</div>
			</div>
			{/* Site-wide, and the summoner's sections when the URL names one. */}
			<HeaderNav />
		</header>
	);
}
