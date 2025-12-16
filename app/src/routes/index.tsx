import { createFileRoute, Link } from "@tanstack/react-router";
import { MainText } from "@/components/header/MainText";
import Search from "@/components/header/Search";
import { SubText } from "@/components/header/SubText";

export const Route = createFileRoute("/")({ component: Home });

export function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-[url('/background-1.webp')] bg-center bg-cover">
			<div className="flex w-full animate-pulse2 flex-col items-center justify-center gap-4 bg-black py-16">
				<div>
					<MainText />
					<SubText />
				</div>

				<Search />

				<Link
					to="/challenges"
					className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
				>
					Browse Challenges
				</Link>
			</div>
		</main>
	);
}
