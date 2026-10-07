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
			{/* The artwork band is dark in both themes, so its contents are hard-coded light. */}
			<div className="animate-pulse2 flex w-full flex-col items-center justify-center gap-4 bg-black py-16 text-white">
				<div>
					<MainText />
					<SubText />
				</div>

				<Search onDark />

				<Link
					to="/challenges"
					className="mt-4 rounded-lg bg-white px-6 py-3 font-medium text-neutral-900 transition-colors hover:bg-white/90"
				>
					Browse Challenges
				</Link>
			</div>
		</main>
	);
}
