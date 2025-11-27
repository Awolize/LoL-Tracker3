import MatchItem from "@/features/matches/match-item";
import type { CompleteMatch } from "@/features/shared/types";

interface MatchHistoryProps {
	matches: CompleteMatch[];
	showAsSheet?: boolean;
}

export const MatchHistory = ({ matches }: MatchHistoryProps) => {

	if (!matches?.length) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<p className="text-lg text-muted-foreground mb-2">No matches found</p>
					<p className="text-sm text-muted-foreground">
						Click the update button on your profile to fetch the latest matches.
						<br />
						This can take a LONG time but you should start seeing your latest
						games in a few minutes.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{matches.map((match) => {
				return <MatchItem key={match.gameId} match={match} />;
			})}
		</div>
	);
};
