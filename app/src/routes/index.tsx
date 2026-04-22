import { createFileRoute, Link } from "@tanstack/react-router";

import { MainText } from "~/components/header/MainText";
import Search from "~/components/header/Search";
import { SubText } from "~/components/header/SubText";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/")({
	component: Home,
	head: () => ({
		meta: [
			...seo({
				title: "Awot's Challenge Tracker for League of Legends",
				description:
					"Search by username#tag + region and track champion mastery progress, challenges, leaderboards, and match history. From Riot's API for League of Legends.",
			}),
		],
	}),
});

export function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-[url('/league-of-legends-background.webp')] bg-cover bg-center">
			<div className="animate-pulse2 flex w-full flex-col items-center justify-center gap-4 bg-black py-16">
				<div>
					<MainText />
					<SubText />
				</div>

				<Search />

				<Link
					to="/challenges"
					className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-lg px-6 py-3 font-medium transition-colors"
				>
					Browse Challenges
				</Link>
			</div>
		</main>
	);
}
