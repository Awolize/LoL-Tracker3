import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Check, Loader2, type LucideIcon, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/utils";
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

const MIN_LOADING_TIME = 1000;
const SUCCESS_MSG_DURATION = 2000;

const formatTimeAgo = (date: string | Date | null) => {
	if (!date) return null;
	const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
	if (diff < 1) return "just now";
	if (diff < 60) return `${diff}m ago`;
	if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
	return `${Math.floor(diff / 1440)}d ago`;
};

type Status = "idle" | "loading" | "success";

const STATUS_UI: Record<
	Status,
	{ label: string; Icon: LucideIcon; className?: string }
> = {
	idle: { label: "Refresh", Icon: RefreshCw },
	loading: {
		label: "Refreshing...",
		Icon: Loader2,
		className: "opacity-80",
	},
	success: {
		label: "Updated",
		Icon: Check,
		className: "text-green-600 dark:text-green-500",
	},
};

export const FullSummonerUpdate = ({
	user,
	awaitMatches = true,
}: FullSummonerUpdateProps) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const lastUpdateQuery = useQuery({
		queryKey: ["lastMasteryUpdate", user.puuid],
		queryFn: () => getLastMasteryUpdate({ data: { puuid: user.puuid } }),
		staleTime: 60_000,
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
				new Promise((r) => setTimeout(r, MIN_LOADING_TIME)),
			]);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["lastMasteryUpdate", user.puuid],
			});
			router.invalidate();
		},
	});

	useEffect(() => {
		if (!refreshMutation.isSuccess) return;
		const t = setTimeout(() => refreshMutation.reset(), SUCCESS_MSG_DURATION);
		return () => clearTimeout(t);
	}, [refreshMutation.isSuccess, refreshMutation]);

	const status: Status = refreshMutation.isPending
		? "loading"
		: refreshMutation.isSuccess
			? "success"
			: "idle";

	const { label, Icon, className } = STATUS_UI[status];

	return (
		<div className="flex flex-col items-center gap-1">
			<Button
				variant="outline"
				size="sm"
				className="px-3 py-1.5 text-sm min-w-[130px] relative overflow-hidden"
				onClick={() => refreshMutation.mutate()}
				disabled={status === "loading"}
			>
				<AnimatePresence mode="wait" initial={false}>
					<motion.div
						key={status}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.18, ease: "easeOut" }}
						className={cn(
							"absolute inset-0 flex items-center justify-center gap-2",
							className,
						)}
					>
						<motion.div
							animate={status === "loading" ? { rotate: 360 } : { rotate: 0 }}
							transition={
								status === "loading"
									? { repeat: Infinity, duration: 1, ease: "linear" }
									: { duration: 0.2 }
							}
						>
							<Icon className="h-4 w-4" />
						</motion.div>
						<span>{label}</span>
					</motion.div>
				</AnimatePresence>
			</Button>

			<div className="h-4 flex items-center justify-center">
				<AnimatePresence mode="wait" presenceAffectsLayout={false}>
					{lastUpdateQuery.data && (
						<motion.span
							key={String(lastUpdateQuery.data)}
							initial={{ opacity: 0, y: 4 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -4 }}
							transition={{ duration: 0.18 }}
							className="text-xs text-muted-foreground"
						>
							Last updated{" "}
							<span
								className="font-mono px-1.5 py-0.5 rounded-sm shadow-sm 
                       bg-gray-200 text-gray-900 dark:bg-primary-foreground dark:text-white"
							>
								{formatTimeAgo(lastUpdateQuery.data)}
							</span>
						</motion.span>
					)}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{refreshMutation.isError && (
					<motion.div
						layout
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="text-red-500 text-xs text-center px-2 overflow-hidden"
					>
						{refreshMutation.error?.message || "Update failed"}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
