/** Client-safe types for the profile hub (no server/db imports). */

export type ProfileChallengesProgressInput = Record<
	number,
	{ level: string | null; value: number | null; percentile: number | null }
> | null;

export type ProfileChallengeRow = {
	id: number;
	name: string;
	shortDescription: string | null;
	thresholds: Record<string, number>;
	progress: {
		level: string | null;
		value: number | null;
		percentile: number | null;
	} | null;
};

export type ProfileHubChallengesPayload = {
	rows: ProfileChallengeRow[];
	challengesSynced: boolean;
	dataDragonVersion: string;
};
