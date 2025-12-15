import { Link } from "@tanstack/react-router";
import { ChevronLeftIcon, ChevronRightIcon, TrophyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Summoner } from "@/features/shared/types";
import { FullSummonerUpdate } from "@/features/summoner/components/summoner-update";
import { useChallengeContext } from "@/stores/challenge-store";

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

export const DifferentSideBar = ({
	challenges,
	username,
	region,
	user,
}: DifferentSideBarProps) => {
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [showAll, setShowAll] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const selectedChallengeId = useChallengeContext(
		(state) => state.selectedChallengeId,
	);
	const setSelectedChallengeId = useChallengeContext(
		(state) => state.setSelectedChallengeId,
	);

	const handleItemClick = (itemId: number) => {
		setSelectedChallengeId(selectedChallengeId === itemId ? null : itemId);
	};

	// Implemented challenges
	const implementedChallengeIds = [401106, 602001, 2024308, 602002, 202303];

	const filteredChallenges = challenges
		.filter((item) => {
			const name = item.localization?.name || item.config.name;
			const description =
				item.localization?.description || item.config.description;

			if (!name) return false;

			const nameMatch = name.toLowerCase().includes(searchTerm.toLowerCase());
			const descriptionMatch = description
				?.toLowerCase()
				.includes(searchTerm.toLowerCase());

			return nameMatch || (descriptionMatch && descriptionMatch);
		})
		.sort((a, b) => a.config.id - b.config.id);

	return (
		<nav
			className={`sticky top-21 left-0 max-h-[calc(100vh-168px)] bg-primary-foreground py-4 ${
				drawerOpen ? "w-72 pr-2 pl-2" : "w-0 px-2"
			} relative border-t-2 duration-300 overflow-y-auto`}
		>
			{drawerOpen ? (
				<ChevronLeftIcon
					className="absolute top-13 -right-4 w-8 h-8 cursor-pointer rounded-full border-2 border-background bg-primary-foreground p-1 text-foreground"
					onClick={() => setDrawerOpen(!drawerOpen)}
				/>
			) : (
				<ChevronRightIcon
					className="absolute top-13 -right-4 w-8 h-8 cursor-pointer rounded-full border-2 border-background bg-primary-foreground p-1 text-foreground"
					onClick={() => setDrawerOpen(!drawerOpen)}
				/>
			)}

			{drawerOpen && (
				<div className="flex h-full flex-col gap-1">
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
							const implemented = implementedChallengeIds.includes(
								item.config.id,
							);

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
													? { username: username.replace("#", "-"), region }
													: undefined
											}
											className="text-muted-foreground hover:text-primary transition-colors"
											onClick={(e) => e.stopPropagation()}
										>
											<TrophyIcon className="w-4 h-4" />
										</Link>
									</div>
								</li>
							);
						})}
					</ul>
					<div className="flex flex-col gap-2 mt-2">
						<FullSummonerUpdate user={user} awaitMatches={true} />
					</div>
				</div>
			)}
		</nav>
	);
};
