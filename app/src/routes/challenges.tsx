import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

// Local imports (assuming these exist based on your code)
import { MainTitleLink } from "@/components/header/MainTitleLink";
import Profile from "@/components/header/Profile";
import Search from "@/components/header/Search";
import { ThemeSelector } from "@/components/theme-toggle";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import {
	getChallengesConfig,
	getDataDragonVersion,
} from "@/server/api/mutations";

// --- Types ---
type Challenge = Awaited<ReturnType<typeof getChallengesConfig>>[0];
type CategoryMap = Record<string, Challenge[]>;

// --- Constants ---
const CATEGORY_CONFIG: Record<string, string> = {
	"1": "Veterancy",
	"2": "Expertise",
	"3": "Teamwork",
	"4": "Imagination",
	"5": "Collection",
	"0": "Legacy & Events",
};

const ORDERED_CATEGORY_IDS = ["1", "2", "3", "4", "5", "0"];

// --- Logic / Utilities ---

/**
 * Pure function to sort and bucket challenges.
 * Moved out of the loader for testability and cleanliness.
 */
function processChallenges(challenges: Challenge[]): CategoryMap {
	const categories: CategoryMap = {
		"1": [],
		"2": [],
		"3": [],
		"4": [],
		"5": [],
		"0": [],
	};

	challenges.forEach((challenge) => {
		const { id } = challenge.config;
		const idStr = id.toString();

		// Skip Crystal (0) and Headers (1-5)
		if (id <= 5) return;

		// 7-digit IDs are Legacy/Seasonal
		if (idStr.length === 7) {
			categories["0"].push(challenge);
			return;
		}

		// Standard categorization based on first digit
		const firstDigit = idStr[0];
		if (Object.hasOwn(categories, firstDigit)) {
			categories[firstDigit].push(challenge);
		} else {
			categories["0"].push(challenge);
		}
	});

	// Sort buckets alphabetically
	Object.values(categories).forEach((list) => {
		list.sort((a, b) =>
			(a.localization?.name || "").localeCompare(b.localization?.name || ""),
		);
	});

	return categories;
}

// --- Route Definition ---

export const Route = createFileRoute("/challenges")({
	loader: async () => {
		const challenges = await getChallengesConfig();
		return { categories: processChallenges(challenges) };
	},
	component: ChallengesPage,
});

// --- Components ---

export default function ChallengesPage() {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<Header />
			<main className="flex-1">
				<ChallengesView />
			</main>
		</div>
	);
}

function Header() {
	return (
		<header className="sticky top-0 z-30 grid w-full grid-cols-3 bg-background/95 backdrop-blur px-4 py-2 border-b">
			<div className="flex justify-start items-center">
				<MainTitleLink />
			</div>
			<div className="flex justify-center items-center">
				<Profile />
			</div>
			<div className="flex items-center w-full justify-end gap-2">
				<div className="flex-1 max-w-sm">
					<Search />
				</div>
				<ThemeSelector />
			</div>
		</header>
	);
}

/**
 * Main View Component
 * Orchestrates data fetching and state
 */
function ChallengesView() {
	const { categories } = Route.useLoaderData();

	// Data Dragon Version
	const { data: version = "15.24.1" } = useQuery({
		queryKey: ["dd-version"],
		queryFn: getDataDragonVersion,
	});

	const { getChallengeIcon } = useDataDragonPath(version);

	// Filter Logic
	const {
		activeCategory,
		setActiveCategory,
		searchQuery,
		setSearchQuery,
		filteredCategories,
		displayList,
	} = useChallengeFilters(categories);

	return (
		<div className="min-h-screen container mx-auto px-4 py-8">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Page Title */}
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold tracking-tight">Challenges</h1>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Browse all available challenges, view tier requirements, and see
						global leaderboards.
					</p>
				</div>

				{/* Controls */}
				<div className="sticky top-16 z-20 bg-background/95 backdrop-blur py-4 -mx-4 px-4 border-b md:border-none md:static md:bg-transparent md:p-0">
					<div className="flex flex-col md:flex-row gap-4 justify-between items-center">
						<CategoryTabs
							activeId={activeCategory}
							onSelect={setActiveCategory}
							counts={filteredCategories}
							hasSearch={!!searchQuery}
						/>
						<SearchBar value={searchQuery} onChange={setSearchQuery} />
					</div>
				</div>

				{/* Results */}
				<ChallengeGrid
					challenges={displayList}
					getIcon={getChallengeIcon}
					searchQuery={searchQuery}
					onClearSearch={() => setSearchQuery("")}
				/>
			</div>
		</div>
	);
}

// --- Sub-Components (Cleaned & Focused) ---

function CategoryTabs({
	activeId,
	onSelect,
	counts,
	hasSearch,
}: {
	activeId: string;
	onSelect: (id: string) => void;
	counts: CategoryMap;
	hasSearch: boolean;
}) {
	return (
		<div className="flex overflow-x-auto p-2 gap-2 w-full md:w-auto scrollbar-hide">
			{ORDERED_CATEGORY_IDS.map((id) => {
				const count = counts[id]?.length || 0;
				const isActive = activeId === id;
				const isDimmed = count === 0 && hasSearch;

				return (
					<button
						key={id}
						onClick={() => onSelect(id)}
						className={`
							whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all relative
							${
								isActive
									? "bg-primary text-primary-foreground shadow-md"
									: "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
							}
							${isDimmed ? "opacity-50" : ""}
						`}
					>
						{CATEGORY_CONFIG[id]}
						<span
							className={`ml-2 text-xs font-mono transition-colors ${isActive ? "opacity-80" : "opacity-60"}`}
						>
							{count}
						</span>
						{hasSearch && count > 0 && !isActive && (
							<span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background z-10" />
						)}
					</button>
				);
			})}
		</div>
	);
}

function SearchBar({
	value,
	onChange,
}: {
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div className="relative w-full md:w-72 shrink-0">
			<div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
				<SearchIcon className="w-4 h-4" />
			</div>
			<input
				type="text"
				placeholder="Filter challenges..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full pl-9 pr-8 py-2 bg-muted/30 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
			/>
			{value && (
				<button
					onClick={() => onChange("")}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
				>
					<XIcon className="w-3 h-3" />
				</button>
			)}
		</div>
	);
}

function ChallengeGrid({
	challenges,
	getIcon,
	searchQuery,
	onClearSearch,
}: {
	challenges: Challenge[];
	getIcon: any;
	searchQuery: string;
	onClearSearch: () => void;
}) {
	if (challenges.length === 0) {
		return (
			<div className="text-center py-20 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
				<p>No challenges found matching "{searchQuery}"</p>
				<button
					onClick={onClearSearch}
					className="mt-2 text-primary hover:underline text-sm"
				>
					Clear filter
				</button>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{challenges.map((challenge) => (
				<ChallengeCard
					key={challenge.config.id}
					challenge={challenge}
					getIcon={getIcon}
				/>
			))}
		</div>
	);
}

function ChallengeCard({
	challenge,
	getIcon,
}: {
	challenge: Challenge;
	getIcon: any;
}) {
	const { id, thresholds } = challenge.config;
	const { name, shortDescription, description } = challenge.localization || {};

	const tiers = [
		"IRON",
		"BRONZE",
		"SILVER",
		"GOLD",
		"PLATINUM",
		"DIAMOND",
		"MASTER",
		"GRANDMASTER",
		"CHALLENGER",
	];

	return (
		<Link
			to="/challenge/$challengeId"
			params={{ challengeId: id.toString() }}
			className="group relative flex flex-col bg-card border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
		>
			<div className="p-4 flex gap-4 items-start h-full">
				<div className="relative shrink-0">
					<div className="w-14 h-14 rounded-lg bg-muted/20 overflow-hidden">
						<img
							src={getIcon(id, thresholds)}
							alt=""
							loading="lazy"
							className="w-full h-full object-contain p-1 transition-transform group-hover:scale-110"
						/>
					</div>
				</div>

				<div className="flex-1 min-w-0 flex flex-col h-full">
					<h3 className="font-semibold text-sm leading-tight text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
						{name || "Unknown Challenge"}
					</h3>
					<p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
						{shortDescription || description}
					</p>

					{/* Tier Indicators */}
					<div className="mt-auto pt-3 flex items-center gap-1">
						{tiers.map((tier) => {
							const isActive = thresholds?.[tier] !== undefined;

							return (
								<div
									key={tier}
									className={`h-2 flex-1 rounded-full relative transition-colors ${
										isActive ? "" : "bg-muted/40"
									}`}
									style={{
										backgroundColor: isActive
											? `var(--tier-${tier.toLowerCase()})`
											: undefined,
									}}
									title={
										isActive
											? `${tier}: ${thresholds[tier]?.toLocaleString()}`
											: `${tier} (Not tracked)`
									}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</Link>
	);
}

// --- Hooks ---

/**
 * Custom hook to handle category selection and search filtering
 */
function useChallengeFilters(categories: CategoryMap) {
	const initialCategory = useMemo(
		() => Object.keys(categories).find((k) => categories[k].length > 0) || "1",
		[categories],
	);

	const [activeCategory, setActiveCategory] = useState(initialCategory);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredCategories = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return categories;

		const result: CategoryMap = {};
		Object.keys(categories).forEach((key) => {
			result[key] = categories[key].filter((c) => {
				const name = c.localization?.name?.toLowerCase() || "";
				const desc = c.localization?.description?.toLowerCase() || "";
				const idStr = c.config.id.toString();
				return name.includes(query) || desc.includes(query) || idStr === query;
			});
		});
		return result;
	}, [categories, searchQuery]);

	const displayList = filteredCategories[activeCategory] || [];

	return {
		activeCategory,
		setActiveCategory,
		searchQuery,
		setSearchQuery,
		filteredCategories,
		displayList,
	};
}
