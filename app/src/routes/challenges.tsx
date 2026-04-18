import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

// Local imports (assuming these exist based on your code)
import { SiteHeader } from "~/components/header/SiteHeader";
import { useDataDragonPath } from "~/features/shared/hooks/useDataDragonPath";
import { getChallengesConfig, getDataDragonVersion } from "~/server/api/mutations";
import { seo } from "~/utils/seo";

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
		list.sort((a, b) => (a.localization?.name || "").localeCompare(b.localization?.name || ""));
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
	head: () => ({
		meta: [
			...seo({
				title: "League of Legends challenges - browse tiers, thresholds and leaderboards",
				description:
					"Explore every League of Legends seasonal and legacy challenge in one directory: filter by Veterancy, Expertise, Teamwork, and more, inspect Crystal tier thresholds, then open leaderboards to compare top summoners worldwide.",
			}),
		],
	}),
});

// --- Components ---

export default function ChallengesPage() {
	return (
		<div className="bg-background text-foreground flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">
				<ChallengesView />
			</main>
		</div>
	);
}

function Header() {
	return <SiteHeader variant="hub" />;
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
		<div className="container mx-auto min-h-screen px-4 py-8">
			<div className="mx-auto max-w-7xl space-y-8">
				{/* Page Title */}
				<div className="space-y-4 text-center">
					<h2 className="text-4xl font-bold tracking-tight">Challenges</h2>
					<p className="text-muted-foreground mx-auto max-w-2xl">
						Browse all available challenges, view tier requirements, and see global
						leaderboards.
					</p>
				</div>

				{/* Controls */}
				<div className="bg-background/95 sticky top-16 z-20 -mx-4 border-b px-4 py-4 backdrop-blur md:static md:border-none md:bg-transparent md:p-0">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
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
		<div className="scrollbar-hide flex w-full gap-2 overflow-x-auto p-2 md:w-auto">
			{ORDERED_CATEGORY_IDS.map((id) => {
				const count = counts[id]?.length || 0;
				const isActive = activeId === id;
				const isDimmed = count === 0 && hasSearch;

				return (
					<button
						key={id}
						onClick={() => onSelect(id)}
						className={`relative rounded-full px-6 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
							isActive
								? "bg-primary text-primary-foreground shadow-md"
								: "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
						} ${isDimmed ? "opacity-50" : ""} `}
					>
						{CATEGORY_CONFIG[id]}
						<span
							className={`ml-2 font-mono text-xs transition-colors ${isActive ? "opacity-80" : "opacity-60"}`}
						>
							{count}
						</span>
						{hasSearch && count > 0 && !isActive && (
							<span className="border-background absolute -top-1 -right-1 z-10 h-3 w-3 rounded-full border-2 bg-green-500" />
						)}
					</button>
				);
			})}
		</div>
	);
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<div className="relative w-full shrink-0 md:w-72">
			<div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
				<SearchIcon className="h-4 w-4" />
			</div>
			<input
				type="text"
				placeholder="Filter challenges..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="bg-muted/30 focus:ring-primary/50 w-full rounded-lg border py-2 pr-8 pl-9 text-sm focus:ring-2 focus:outline-none"
			/>
			{value && (
				<button
					onClick={() => onChange("")}
					className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
				>
					<XIcon className="h-3 w-3" />
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
			<div className="text-muted-foreground bg-muted/10 rounded-xl border border-dashed py-20 text-center">
				<p>No challenges found matching "{searchQuery}"</p>
				<button
					onClick={onClearSearch}
					className="text-primary mt-2 text-sm hover:underline"
				>
					Clear filter
				</button>
			</div>
		);
	}

	return (
		<div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-4 duration-500 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{challenges.map((challenge) => (
				<ChallengeCard key={challenge.config.id} challenge={challenge} getIcon={getIcon} />
			))}
		</div>
	);
}

function ChallengeCard({ challenge, getIcon }: { challenge: Challenge; getIcon: any }) {
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

	// Helper to format numbers compactly (e.g. 1500 -> 1.5k)
	const formatValue = (val: number) => {
		return new Intl.NumberFormat("en-US", {
			notation: "compact",
			maximumFractionDigits: 1,
		}).format(val);
	};

	return (
		<Link
			to="/challenge/$challengeId"
			params={{ challengeId: id.toString() }}
			className="group bg-card hover:border-primary/50 relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
		>
			<div className="flex h-full items-start gap-4 p-4">
				<div className="relative shrink-0">
					<div className="bg-muted/20 h-14 w-14 overflow-hidden rounded-lg">
						<img
							src={getIcon(id, thresholds)}
							alt=""
							loading="lazy"
							className="h-full w-full object-contain p-1 transition-transform group-hover:scale-110"
						/>
					</div>
				</div>

				<div className="flex h-full min-w-0 flex-1 flex-col">
					<h3 className="text-card-foreground group-hover:text-primary line-clamp-2 text-sm leading-tight font-semibold transition-colors">
						{name || "Unknown Challenge"}
					</h3>
					<p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
						{shortDescription || description}
					</p>

					{/* Tier Indicators */}
					{/* Added 'items-end' to align bars at bottom, 'h-10' to reserve space for numbers */}
					<div className="mt-auto flex h-12 items-end gap-1 pt-4">
						{tiers.map((tier) => {
							const value = thresholds?.[tier];
							const isActive = value !== undefined;

							return (
								// Wrapped in a column to stack Number + Bar
								<div
									key={tier}
									className="group/tier flex flex-1 cursor-help flex-col items-center gap-0.5"
									title={
										isActive
											? `${tier}: ${value?.toLocaleString()}`
											: `${tier} (Not tracked)`
									}
								>
									{/* The Number Label */}
									<span
										className={`text-muted-foreground/80 font-mono text-[9px] leading-none tracking-tighter ${isActive ? "opacity-100" : "opacity-0"}`}
									>
										{isActive ? formatValue(value) : "-"}
									</span>

									{/* The Color Bar */}
									<div
										className={`relative h-2 w-full rounded-full transition-colors ${
											isActive ? "" : "bg-muted/40"
										}`}
										style={{
											backgroundColor: isActive
												? `var(--tier-${tier.toLowerCase()})`
												: undefined,
										}}
									/>
								</div>
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
