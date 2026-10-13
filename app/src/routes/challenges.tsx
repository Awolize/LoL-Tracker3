import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchIcon, TrophyIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

// Local imports (assuming these exist based on your code)
import { SiteHeader } from "~/components/header/SiteHeader";
import {
	resolveChallengeCategoryId,
	type ChallengeTagsById,
} from "~/features/challenges/lib/challenge-ancestry";
import { useDataDragonPath } from "~/features/shared/hooks/useDataDragonPath";
import { getChallengesConfig, getDataDragonVersion } from "~/server/api/mutations";
import { seo } from "~/utils/seo";

// --- Types ---
type Challenge = Awaited<ReturnType<typeof getChallengesConfig>>[0];
type CategoryMap = Record<string, Challenge[]>;

// --- Constants ---
/**
 * Tab labels by category id, named from the game's own data rather than from how the ids look.
 *
 * `ChallengesConfig` joined to `ChallengeLocalization` (the authoritative pair) gives
 * 0 CRYSTAL, 1 IMAGINATION, 2 EXPERTISE, 3 VETERANCY, 4 TEAMWORK, 5 COLLECTION; CommunityDragon's
 * `v1/challenges.json` carries the same six names. Ids 1, 3 and 4 previously read Veterancy,
 * Teamwork and Imagination - the three names rotated by one slot (1 showed 3's name, 3 showed 4's,
 * 4 showed 1's), which put Teamwork on two tabs and left Imagination mislabelled.
 *
 * `0` is deliberately not Riot's "CRYSTAL": this bucket is the fallback for a challenge whose
 * parent chain reaches no category (see `processChallenges`), and no non-category challenge
 * resolves to category 0, so labelling it Crystal would describe the wrong set.
 */
const CATEGORY_CONFIG: Record<string, string> = {
	"1": "Imagination",
	"2": "Expertise",
	"3": "Veterancy",
	"4": "Teamwork",
	"5": "Collection",
	"0": "Legacy & Events",
};

const ORDERED_CATEGORY_IDS = ["1", "2", "3", "4", "5", "0"];

/** Bucket for a challenge whose parent chain reaches no category (see `processChallenges`). */
const LEGACY_CATEGORY_KEY = "0";

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

	const tagsById: ChallengeTagsById = new Map(
		challenges.map((challenge) => [challenge.config.id, challenge.config.tags ?? null]),
	);

	challenges.forEach((challenge) => {
		const { id } = challenge.config;

		// Ids 0-5 are the category aggregates themselves, not challenges inside one.
		if (id <= 5) return;

		// Riot's `tags.parent` chain is the category, not the id's first digit (nor its length:
		// the 7-digit retired seasons reach no category and belong in the legacy bucket).
		const categoryId = resolveChallengeCategoryId(id, tagsById);
		categories[categoryId === null ? LEGACY_CATEGORY_KEY : String(categoryId)].push(challenge);
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
				title: "Challenges - lol.awot.dev",
				description:
					"Explore every League of Legends seasonal and legacy challenge in one directory: filter by Veterancy, Expertise, Teamwork, and more, inspect Crystal tier thresholds, then open leaderboards ranked across the summoners this tracker follows.",
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
						Browse all available challenges, view tier requirements, and open the
						leaderboards tracked here.
					</p>
				</div>

				{/*
				 * The overall ranking. Challenge 0 is the Crystal aggregate over all five categories,
				 * so it is deliberately a separate affordance rather than another tab: the "Legacy &
				 * Events" tab is the fallback bucket for challenges whose parent chain reaches no
				 * category, which is a different set entirely.
				 */}
				<Link
					to="/challenge/$challengeId"
					params={{ challengeId: "0" }}
					className="group bg-card hover:border-primary/50 mx-auto flex max-w-2xl items-center gap-4 rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
				>
					<div className="bg-muted/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
						<TrophyIcon className="text-primary h-6 w-6" />
					</div>
					<div className="min-w-0 text-left">
						<h3 className="text-card-foreground group-hover:text-primary text-sm font-semibold transition-colors">
							Global challenge leaderboard
						</h3>
						<p className="text-muted-foreground mt-1 text-xs leading-relaxed">
							Where every player stands once all their challenges count, instead of
							one challenge at a time.
						</p>
					</div>
				</Link>

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
