import { createFileRoute } from "@tanstack/react-router";
import FooterLinks from "@/components/footer/FooterLinks";
import RiotGamesDisclaimer from "@/components/footer/RiotGamesDisclaimer";
import { MainTitleLink } from "@/components/header/MainTitleLink";
import Profile from "@/components/header/Profile";
import Search from "@/components/header/Search";
import { ThemeSelector } from "@/components/theme-toggle";

export const Route = createFileRoute("/$region/$username/different")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
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
				<div>Hello "/$region/$username/different"!</div>
			</main>

			<footer className="flex flex-col items-center gap-4 p-2 text-sm opacity-50">
				<FooterLinks />
				<RiotGamesDisclaimer />
			</footer>
		</div>
	);
}
