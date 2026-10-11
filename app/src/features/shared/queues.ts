/**
 * Short labels for the queue ids this app has matches for.
 *
 * Ids and descriptions come from Riot's published list,
 * <https://static.developer.riotgames.com/docs/lol/queues.json>. Ids that appear in our data but
 * are absent from that list (710, 740, 860, 1740, 1750, 3100, 3130, 3140) deliberately fall back
 * to `Queue <id>` rather than being given an invented name.
 */
const QUEUE_LABELS: Record<number, string> = {
	0: "Custom",
	400: "Draft Pick",
	420: "Ranked Solo",
	440: "Ranked Flex",
	450: "ARAM",
	480: "Swiftplay",
	490: "Quickplay",
	700: "Clash",
	720: "ARAM Clash",
	870: "Co-op vs AI (Intro)",
	880: "Co-op vs AI (Beginner)",
	890: "Co-op vs AI (Intermediate)",
	900: "ARURF",
	1020: "One for All",
	1400: "Ultimate Spellbook",
	1700: "Arena",
	1710: "Arena (16)",
	1810: "Swarm (1p)",
	1820: "Swarm (2p)",
	1830: "Swarm (3p)",
	1840: "Swarm (4p)",
	1900: "Pick URF",
};

/**
 * Queues worth offering first in a filter, most-played first. Anything the user has that is not
 * listed here still appears, sorted after these by queue id.
 */
const QUEUE_PRIORITY = [420, 440, 400, 450, 480, 490, 1700, 1710, 700, 720, 900, 1900, 1020, 1400];

export const queueLabel = (queueId: number): string => QUEUE_LABELS[queueId] ?? `Queue ${queueId}`;

/** Orders the user's queues for display: the common ones first, then everything else by id. */
export const sortQueueIds = (queueIds: number[]): number[] =>
	[...queueIds].sort((a, b) => {
		const aRank = QUEUE_PRIORITY.indexOf(a);
		const bRank = QUEUE_PRIORITY.indexOf(b);
		if (aRank !== -1 || bRank !== -1) {
			if (aRank === -1) return 1;
			if (bRank === -1) return -1;
			return aRank - bRank;
		}
		return a - b;
	});
