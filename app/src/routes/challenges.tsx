import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MainTitleLink } from "@/components/header/MainTitleLink";
import Profile from "@/components/header/Profile";
import Search from "@/components/header/Search";
import { ThemeSelector } from "@/components/theme-toggle";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import {
	getChallengesConfig,
	getDataDragonVersion,
} from "@/server/api/mutations";

export const Route = createFileRoute("/challenges")({
	loader: async () => {
		const challenges = await getChallengesConfig();

		// Create a map for quick lookup
		const challengeMap = new Map<number, (typeof challenges)[0]>();
		challenges.forEach((challenge) => {
			challengeMap.set(challenge.config.id, challenge);
		});

		// Categorize challenges based on ID patterns
		// From what I can see, challenge IDs seem to follow patterns:
		// 1xxxxx - Collection (510008, 510009)
		// 2xxxxx - Expertise (203101)
		// 3xxxxx - Teamwork (303500, 303506)
		// 4xxxxx - Veterancy (402500-402503)
		// 5xxxxx - Imagination
		const categorizeById = (id: number): string | null => {
			const idStr = id.toString();
			if (idStr.startsWith("1")) return "4"; // Collection
			if (idStr.startsWith("2")) return "2"; // Expertise
			if (idStr.startsWith("3")) return "3"; // Teamwork
			if (idStr.startsWith("4")) return "1"; // Veterancy
			if (idStr.startsWith("5")) return "5"; // Imagination
			return null;
		};

		// Group challenges by category
		const categories: Record<string, typeof challenges> = {
			"1": [], // Veterancy
			"2": [], // Expertise
			"3": [], // Teamwork
			"4": [], // Collection
			"5": [], // Imagination
		};

		// Filter out capstones (IDs 1-5) and group challenges
		let filteredCount = 0;
		challenges.forEach((challenge) => {
			// Skip capstones (IDs 1-5)
			if (challenge.config.id >= 1 && challenge.config.id <= 5) return;

			filteredCount++;

			// Categorize by ID pattern
			const category = categorizeById(challenge.config.id);
			if (category && categories[category]) {
				categories[category].push(challenge);
			} else {
				console.log(
					"Challenge without category:",
					challenge.config.id,
					challenge.localization?.name,
				);
			}
		});

		console.log("Filtered challenges:", filteredCount);
		console.log(
			"Categories counts:",
			Object.fromEntries(
				Object.entries(categories).map(([k, v]) => [k, v.length]),
			),
		);

		return {
			categories,
		};
	},
	component: ChallengesPage,
});

export default function ChallengesPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">
				<Client />
			</main>
		</div>
	);
}

function Client() {
	const { categories } = Route.useLoaderData();
	const [activeCategory, setActiveCategory] = useState("1");
	const [searchQuery, setSearchQuery] = useState("");

	const { data: version = "15.24.1" } = useQuery({
		queryKey: ["dd-version"],
		queryFn: getDataDragonVersion,
	});
	const { getChallengeIcon } = useDataDragonPath(version);

	const categoryNames: Record<string, string> = {
		"1": "Veterancy",
		"2": "Expertise",
		"3": "Teamwork",
		"4": "Collection",
		"5": "Imagination",
	};

	// Filter challenges based on search query
	const filteredChallenges =
		categories[activeCategory]?.filter((challenge) => {
			if (!searchQuery) return true;
			const name = challenge.localization?.name?.toLowerCase() || "";
			const description =
				challenge.localization?.description?.toLowerCase() || "";
			const query = searchQuery.toLowerCase();
			return name.includes(query) || description.includes(query);
		}) || [];

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto">
					<h1 className="text-4xl font-bold text-center mb-8">Challenges</h1>

					{/* Search Bar */}
					<div className="flex justify-center mb-8">
						<input
							type="text"
							placeholder="Search challenges..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="px-4 py-2 border border-input bg-background rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-ring"
						/>
					</div>

					{/* Category Tabs */}
					<div className="flex flex-wrap justify-center gap-2 mb-8">
						{Object.entries(categories).map(([categoryId, challenges]) => (
							<button
								key={categoryId}
								onClick={() => setActiveCategory(categoryId)}
								className={`px-4 py-2 rounded-lg transition-colors ${
									activeCategory === categoryId
										? "bg-primary text-primary-foreground"
										: "bg-muted text-muted-foreground hover:bg-muted/80"
								}`}
							>
								{categoryNames[categoryId]}
								<span className="ml-2 text-sm opacity-75">
									({challenges.length})
								</span>
							</button>
						))}
					</div>

					{/* Challenges Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredChallenges.map((challenge) => (
							<a
								key={challenge.config.id}
								href={`/challenge/${challenge.config.id}`}
								className="bg-card rounded-lg p-4 border hover:shadow-lg transition-shadow block"
							>
								<div className="flex items-start gap-3">
									<img
										src={getChallengeIcon(
											challenge.config.id,
											challenge.config.thresholds as Record<string, number>,
										)}
										alt={
											challenge.localization?.name ||
											`Challenge ${challenge.config.id}`
										}
										className="w-12 h-12 rounded object-cover flex-shrink-0"
									/>
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-sm leading-tight mb-1">
											{challenge.localization?.name ||
												`Challenge ${challenge.config.id}`}
										</h3>
										<p className="text-xs text-muted-foreground line-clamp-2">
											{challenge.localization?.shortDescription ||
												challenge.localization?.description ||
												"Complete this challenge to earn rewards"}
										</p>
									</div>
								</div>
							</a>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function Header() {
	return (
		<header className="sticky top-0 z-30 grid w-full grid-cols-3 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 py-2 border-b">
			<div className="flex justify-center items-center">
				<MainTitleLink />
			</div>
			<div className="flex justify-center items-center">
				<Profile />
			</div>

			<div className="flex items-center w-full relative">
				<div className="flex-1">
					<Search />
				</div>

				<div className="absolute top-0 right-0">
					<ThemeSelector />
				</div>
			</div>
		</header>
	);
}
