import { Link } from "@tanstack/react-router";
import { ChevronLeftIcon, ChevronRightIcon, TrophyIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Summoner } from "~/features/shared/types";
import { FullSummonerUpdate } from "~/features/summoner/components/summoner-update";
import { useSelectedChallenge } from "~/stores/selected-challenge-context";

interface ChallengeConfig {
	config: {
		id: number;
		name?: string;
		shortDescription?: string;
		description?: string;
		thresholds: Record<string, number>;
	};
	localization?: {
		name: string;
		description: string;
		shortDescription: string;
	};
}

interface DifferentSideBarProps {
	challenges: ChallengeConfig[];
	username?: string;
	region?: string;
	user: Summoner;
}

export const DifferentSideBar = ({ challenges, username, region, user }: DifferentSideBarProps) => {
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [showAll, setShowAll] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const { selectedChallengeId, setSelectedChallengeId } = useSelectedChallenge();

	const handleItemClick = (itemId: number) => {
		setSelectedChallengeId(selectedChallengeId === itemId ? null : itemId);
	};

	// Implemented challenges
	const implementedChallengeIds = [401106, 602001, 2024308, 602002, 202303];

	const filteredChallenges = challenges
		.filter((item) => {
			const name = item.localization?.name || item.config.name;
			const description = item.localization?.description || item.config.description;

			if (!name) return false;

			const nameMatch = name.toLowerCase().includes(searchTerm.toLowerCase());
			const descriptionMatch = description?.toLowerCase().includes(searchTerm.toLowerCase());

			return nameMatch || descriptionMatch;
		})
		.sort((a, b) => a.config.id - b.config.id);

	return (
		<div className="sticky top-21 left-0 z-20 flex flex-row">
			<nav
				className={`bg-primary-foreground max-h-[calc(100vh-168px)] py-4 ${
					drawerOpen ? "w-72" : "w-4"
				} overflow-hidden border-t-2 duration-300`}
			>
				<div className="flex h-full max-h-[calc(100vh-200px)] w-68 flex-col gap-1 overflow-y-auto px-2">
					<h3 className="text-center font-bold">Challenges</h3>
					<hr className="border-gray-600" />
					<div className="flex justify-evenly gap-1 py-1">
						<Input
							type="text"
							placeholder="Search title..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="bg-background text-foreground"
						/>
						<Button
							variant={showAll ? "default" : "outline"}
							onClick={() => setShowAll(!showAll)}
							className="px-2"
						>
							{showAll ? "Filter" : "Show All"}
						</Button>
					</div>
					<ul className="flex flex-col gap-1 overflow-y-auto">
						{filteredChallenges.map((item) => {
							const implemented = implementedChallengeIds.includes(item.config.id);

							if (!showAll && !implemented) return null;

							return (
								<li
									key={item.config.id}
									className={`relative cursor-pointer rounded-sm border py-2 duration-300 ${
										selectedChallengeId === item.config.id
											? "bg-background"
											: ""
									}`}
									onClick={() => handleItemClick(item.config.id)}
								>
									<div className="flex gap-x-2 px-2">
										<span className="w-3 text-green-500">
											{implemented ? "●" : ""}
										</span>
										<div className="w-full">
											<p className="text-sm">
												{item.localization?.name || item.config.name}
											</p>
											<p className="text-xs opacity-50">
												{item.localization?.description ||
													item.config.description}
											</p>
										</div>
										<Link
											to="/challenge/$id"
											params={{ id: item.config.id.toString() }}
											search={
												username && region
													? {
															username: username.replace("#", "-"),
															region,
														}
													: undefined
											}
											className="text-muted-foreground hover:text-primary transition-colors"
											onClick={(e) => e.stopPropagation()}
										>
											<TrophyIcon className="h-4 w-4" />
										</Link>
									</div>
								</li>
							);
						})}
					</ul>
					<div className="mt-2 flex flex-col gap-2">
						<FullSummonerUpdate user={user} awaitMatches={true} />
					</div>
				</div>
			</nav>
			<button
				type="button"
				onClick={() => setDrawerOpen(!drawerOpen)}
				className="border-background bg-primary-foreground text-foreground hover:bg-background relative z-10 mt-2 -ml-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 p-1 transition-colors"
			>
				{drawerOpen ? (
					<ChevronLeftIcon className="h-5 w-5" />
				) : (
					<ChevronRightIcon className="h-5 w-5" />
				)}
			</button>
		</div>
	);
};
