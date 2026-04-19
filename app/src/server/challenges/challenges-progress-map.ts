/**
 * Per-player challenge progress from `ChallengesDetails` only.
 * Kept separate from `get-challenges.ts` so importers do not load every `createServerFn` in that file
 * (avoids pulling the whole module — and `pg` — into unrelated client/route chunks).
 */
import { eq, type InferSelectModel } from "drizzle-orm";

import { db } from "~/db";
import { challenge, challengesDetails } from "~/db/schema";

export type PlayerChallengeProgressEntry = {
	challengeId: number;
	percentile: number | null;
	level: string | null;
	value: number | null;
	achievedTime: Date | null;
};

export type PlayerChallengesProgressMap = Record<number, PlayerChallengeProgressEntry>;

export async function getChallengesProgressMapForPuuid(
	puuid: string,
): Promise<PlayerChallengesProgressMap | null> {
	const userChallengesDetails = await db.query.challengesDetails.findFirst({
		where: eq(challengesDetails.puuid, puuid),
		with: { challenges: true },
	});

	if (!userChallengesDetails?.challenges?.length) {
		return userChallengesDetails ? {} : null;
	}

	type ChallengeRow = InferSelectModel<typeof challenge>;

	return userChallengesDetails.challenges.reduce(
		(map: PlayerChallengesProgressMap, row: ChallengeRow) => {
			map[row.challengeId] = {
				challengeId: row.challengeId,
				percentile: row.percentile,
				level: row.level,
				value: row.value,
				achievedTime: row.achievedTime,
			};
			return map;
		},
		{} as PlayerChallengesProgressMap,
	);
}
