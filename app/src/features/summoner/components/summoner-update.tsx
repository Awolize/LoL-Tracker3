import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2, Check, RefreshCw } from "lucide-react"; // Standard icons for Shadcn
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

// Helper to format time (cleaner than doing math in JSX)
const formatTimeAgo = (dateString: string | Date | null) => {
  if (!dateString) return null;
  
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

const MIN_LOADING_TIME = 1000; // ms
const SUCCESS_MSG_DURATION = 2000; // ms

export const FullSummonerUpdate = ({
  user,
  awaitMatches = true,
}: FullSummonerUpdateProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const lastUpdateQuery = useQuery({
    queryKey: ["lastMasteryUpdate", user.puuid],
    queryFn: () => getLastMasteryUpdate({ data: { puuid: user.puuid } }),
    staleTime: 60 * 1000, 
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
    if (refreshMutation.isSuccess) {
      const timer = setTimeout(() => {
        refreshMutation.reset();
      }, SUCCESS_MSG_DURATION);

      return () => clearTimeout(timer);
    }
  }, [refreshMutation.isSuccess, refreshMutation]);

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        className="px-3 py-1.5 text-sm transition-all min-w-[120px]" 
        onClick={() => refreshMutation.mutate()}
        disabled={refreshMutation.isPending}
      >
        {refreshMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Refreshing...
          </>
        ) : refreshMutation.isSuccess ? (
          <span className="flex items-center text-green-600 dark:text-green-500">
            <Check className="mr-2 h-4 w-4" />
            Updated
          </span>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </>
        )}
      </Button>

      {/* Timestamp Display */}
      {lastUpdateQuery.data && (
        <span className="text-xs text-muted-foreground">
          Last updated {formatTimeAgo(lastUpdateQuery.data)}
        </span>
      )}

      {/* Error Message */}
      {refreshMutation.isError && (
        <div className="text-red-500 text-xs text-center px-2">
          {refreshMutation.error?.message || "Update failed"}
        </div>
      )}
    </div>
  );
};