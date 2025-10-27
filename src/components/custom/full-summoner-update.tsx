import { useState } from "react";
import type { Summoner } from "@/lib/types";
import { fullUpdateSummoner } from "@/server/full-update-summoner";
import { Button } from "../ui/button";

interface FullSummonerUpdateProps {
	user: Summoner;
}

export const FullSummonerUpdate = ({ user }: FullSummonerUpdateProps) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const updateUser = async () => {
		if (!user.gameName || !user.tagLine) return;

		setIsUpdating(true);
		setError(null);
		setSuccess(false);

		try {
			const result = await fullUpdateSummoner({
				data: {
					gameName: user.gameName,
					tagLine: user.tagLine,
					region: user.region,
				},
			});

			if (result) setSuccess(true);
		} catch (err: any) {
			console.error("Failed to update summoner:", err);
			setError(err.message || "Unknown error");
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div>
			<Button
				variant="secondary"
				size="sm"
				className={`${
					!isUpdating
						? "bg-linear-to-r from-indigo-500 to-purple-500"
						: "w-16 bg-linear-to-r from-purple-500 to-indigo-500"
				} relative my-2 inline-flex w-24 items-center justify-center rounded px-3 py-1`}
				onClick={updateUser}
				disabled={isUpdating}
			>
				{isUpdating ? "Updating..." : "Update"}
			</Button>
			{success && (
				<div className="text-green-500 text-xs mt-1">Update complete!</div>
			)}
			{error && <div className="text-red-500 text-xs mt-1">{error}</div>}
		</div>
	);
};
