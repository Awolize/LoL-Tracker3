import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Summoner } from "@/features/shared/types";
import { fullUpdateSummoner } from "@/server/summoner/full-update-summoner.api";
import { getLastMasteryUpdate } from "@/server/summoner/summoner.api";

interface FullSummonerUpdateProps {
	user: Summoner;
	includeMatches?: boolean;
}

export const FullSummonerUpdate = ({
	user,
	includeMatches = true,
}: FullSummonerUpdateProps) => {
	const router = useRouter();
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [justCompleted, setJustCompleted] = useState(false);
	// reprocess removed as per user request

	const updateUser = async () => {
		if (!user.gameName || !user.tagLine) return;

		setIsUpdating(true);
		setError(null);
		setJustCompleted(false);

		try {
			await fullUpdateSummoner({
				data: {
					gameName: user.gameName,
					tagLine: user.tagLine,
					region: user.region,
					includeMatches,
				},
			});

			setJustCompleted(true);
			// Invalidate and reload the current route to refresh data
			await router.invalidate();

			// Reset the just completed state after 3 seconds
			setTimeout(() => setJustCompleted(false), 3000);
		} catch (err: any) {
			console.error("Failed to refresh summoner:", err);
			setError(err.message || "Unknown error");
		} finally {
			setIsUpdating(false);
		}
	};

	const [lastUpdatedDate, setLastUpdatedDate] = useState<Date | null>(null);

	// Fetch the last mastery update timestamp on component mount
	useEffect(() => {
		const fetchLastMasteryUpdate = async () => {
			try {
				const lastUpdate = await getLastMasteryUpdate({
					data: { puuid: user.puuid },
				});
				setLastUpdatedDate(lastUpdate ? new Date(lastUpdate) : null);
			} catch (err) {
				console.error("Failed to fetch mastery update date:", err);
			}
		};

		fetchLastMasteryUpdate();
	}, [user.puuid]);

	const timeSinceUpdate = lastUpdatedDate
		? Math.floor((Date.now() - lastUpdatedDate.getTime()) / 1000 / 60) // minutes
		: null;

	return (
		<div className="flex flex-col items-center gap-1">
			<Button
				variant="outline"
				size="sm"
				className="px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
				onClick={updateUser}
				disabled={isUpdating}
			>
				{isUpdating ? (
					<span className="flex items-center gap-2">
						<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						Refreshing...
					</span>
				) : justCompleted ? (
					<span className="flex items-center gap-2 text-green-600">
						<svg
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
						Updated
					</span>
				) : (
					<span className="flex items-center gap-2">
						<svg
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
						Refresh
					</span>
				)}
			</Button>
			{timeSinceUpdate !== null && (
				<span className="text-xs text-muted-foreground">
					Last updated{" "}
					{timeSinceUpdate < 1
						? "just now"
						: timeSinceUpdate < 60
							? `${timeSinceUpdate}m ago`
							: timeSinceUpdate < 1440
								? `${Math.floor(timeSinceUpdate / 60)}h ago`
								: `${Math.floor(timeSinceUpdate / 1440)}d ago`}
				</span>
			)}
			{error && <div className="text-red-500 text-xs">{error}</div>}
		</div>
	);
};
