/**
 * The challenges this app actually implements a tracker for.
 *
 * App configuration rather than Riot data: the challenge sidebar filters down to these five, and the
 * challenge route needs a champion-list fetcher for each one. It lives here so the two cannot drift
 * apart - the route's fetcher map is typed as `Record<ImplementedChallengeId, ...>`, so adding an id
 * to this list fails the build until a fetcher exists for it.
 */
export const IMPLEMENTED_CHALLENGE_IDS = [401106, 602001, 2024308, 602002, 202303] as const;

export type ImplementedChallengeId = (typeof IMPLEMENTED_CHALLENGE_IDS)[number];

export function isImplementedChallengeId(id: number): id is ImplementedChallengeId {
	return (IMPLEMENTED_CHALLENGE_IDS as readonly number[]).includes(id);
}
