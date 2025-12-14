import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { Summoner } from "@/features/shared/types";
import {
	fullUpdateSummoner,
	getLastMasteryUpdate,
} from "@/server/summoner/mutations";

type SummonerUpdateInput = Pick<
	Summoner,
	"puuid" | "gameName" | "tagLine" | "region"
>;

interface FullSummonerUpdateProps {
	user: SummonerUpdateInput;
	awaitMatches?: boolean;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const FullSummonerUpdate = ({
	user,
	awaitMatches = true,
}: FullSummonerUpdateProps) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const lastUpdateQuery = useQuery({
		queryKey: ["lastMasteryUpdate", user.puuid],
		queryFn: () => getLastMasteryUpdate({ data: { puuid: user.puuid } }),
		staleTime: 60000, // optional: cache for 1 min
	});

	const refreshMutation = useMutation({
		mutationFn: async () => {
			await Promise.all([
				fullUpdateSummoner({
					data: {
						gameName: user.gameName ?? "",
						tagLine: user.tagLine ?? "",
						region: user.region,
						awaitMatches,
					},
				}),
				delay(1000),
			]);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["lastMasteryUpdate", user.puuid],
			});
			router.invalidate();
		},
	});

	const timeSinceUpdate = lastUpdateQuery.data
		? Math.floor(
				(Date.now() - new Date(lastUpdateQuery.data).getTime()) / 60000,
			)
		: null;

	return (
		<div className="flex flex-col items-center gap-1">
			<Button
				variant="outline"
				size="sm"
				className="px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
				onClick={() => refreshMutation.mutate()}
				disabled={refreshMutation.isPending}
			>
				{refreshMutation.isPending ? (
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
				) : refreshMutation.isSuccess ? (
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

			{refreshMutation.isError && (
				<div className="text-red-500 text-xs">
					{refreshMutation.error?.message || "Update failed"}
				</div>
			)}
		</div>
	);
};
