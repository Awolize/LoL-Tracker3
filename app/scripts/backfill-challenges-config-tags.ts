/**
 * One-off backfill: `ChallengesConfig.tags` and `ChallengeTitle` from CommunityDragon.
 *
 * Why not a re-sync: `updateChallengesConfigServer` reads Riot's `Challenges.Configs`, and the
 * configured API key answers 403, so the config rows cannot be refreshed through Riot right now.
 * CommunityDragon publishes the same config publicly at
 * `.../rcp-be-lol-game-data/global/default/v1/challenges.json`, and that file carries both the
 * `tags` object (`isCapstone`, `isCategory`, `parent`, ...) for every challenge it lists and the
 * top-level `titles` map (UUID keyed, each with the numeric `itemId` that `Preferences.title`
 * stores), so the game's own markers and title names can be filled in without Riot.
 *
 * Idempotent: it only sets `tags` on ids CommunityDragon publishes and upserts titles by `itemId`,
 * and never inserts or deletes a challenge row. Re-running is how a newer CommunityDragon snapshot
 * gets picked up.
 *
 * Usage (from `app/`):
 *   pnpm db:backfill-challenge-tags
 *
 * Env: reads the repo-root `.env` for DATABASE_URL (override it inline to point at production).
 * Optional: COMMUNITYDRAGON_CHALLENGES_URL.
 */
import { fileURLToPath } from "node:url";

import { config } from "dotenv";

config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const CHALLENGES_URL =
	process.env.COMMUNITYDRAGON_CHALLENGES_URL ??
	"https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/challenges.json";

type CommunityDragonTitle = { itemId?: unknown; name?: unknown };

type CommunityDragonPayload = {
	challenges: Record<string, { tags?: unknown }>;
	titles?: Record<string, CommunityDragonTitle>;
};

/**
 * CommunityDragon answers 200 for anything - a directory listing, a missing file - so the shape is
 * checked rather than the status alone. A run that cannot see a `challenges` object stops before
 * writing anything. `titles` is checked separately: it feeds a cosmetic column, so a snapshot
 * without it still gets its tags written.
 */
function isChallengesPayload(value: unknown): value is CommunityDragonPayload {
	if (typeof value !== "object" || value === null) return false;
	const { challenges } = value as { challenges?: unknown };
	return typeof challenges === "object" && challenges !== null && !Array.isArray(challenges);
}

/** Only entries with an integer `itemId` and a non-empty name are usable; the rest are skipped. */
function parseTitles(value: unknown): { itemId: number; name: string }[] {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return [];

	const titles: { itemId: number; name: string }[] = [];
	for (const entry of Object.values(value)) {
		if (typeof entry !== "object" || entry === null) continue;
		const { itemId, name } = entry as CommunityDragonTitle;
		if (typeof itemId !== "number" || !Number.isInteger(itemId)) continue;
		if (typeof name !== "string" || name.length === 0) continue;
		titles.push({ itemId, name });
	}
	return titles;
}

const { db } = await import("../src/db/index.ts");
const { challengesConfig, challengeTitle } = await import("../src/db/schema.ts");
const { isCapstoneTags, isCategoryTags, parseChallengeTags } =
	await import("../src/server/challenges/challenge-tags.ts");
const { count, eq, isNotNull } = await import("drizzle-orm");

async function main() {
	console.log(`Reading challenge configs from ${CHALLENGES_URL} ...`);

	const res = await fetch(CHALLENGES_URL);
	if (!res.ok) throw new Error(`CommunityDragon answered ${res.status}`);

	const payload: unknown = await res.json();
	if (!isChallengesPayload(payload)) {
		throw new Error("CommunityDragon payload has no `challenges` object - refusing to write");
	}

	const entries = Object.entries(payload.challenges);
	const parsed = entries.flatMap(([rawId, entry]) => {
		const id = Number.parseInt(rawId, 10);
		const tags = parseChallengeTags(entry.tags);
		if (!Number.isInteger(id) || tags === null) return [];
		return [{ id, tags }];
	});

	if (parsed.length === 0) {
		throw new Error("CommunityDragon payload carries no `tags` - refusing to write");
	}
	const parsedIds = new Set(parsed.map((entry) => entry.id));

	const dbIds = new Set(
		(await db.select({ id: challengesConfig.id }).from(challengesConfig)).map((row) => row.id),
	);

	let updated = 0;
	let capstones = 0;
	let categories = 0;

	for (const { id, tags } of parsed) {
		if (!dbIds.has(id)) continue; // A Riot id this database has never synced.

		const rows = await db
			.update(challengesConfig)
			.set({ tags })
			.where(eq(challengesConfig.id, id))
			.returning({ id: challengesConfig.id });

		updated += rows.length;
		if (isCapstoneTags(tags)) capstones += 1;
		if (isCategoryTags(tags)) categories += 1;
	}

	const [{ total }] = await db.select({ total: count() }).from(challengesConfig);
	const [{ populated }] = await db
		.select({ populated: count() })
		.from(challengesConfig)
		.where(isNotNull(challengesConfig.tags));

	console.log(
		`CommunityDragon: ${entries.length} challenges, ${parsed.length} with parsable tags.`,
	);
	console.log(`Rows written: ${updated} (capstone ${capstones}, category ${categories}).`);
	console.log(`ChallengesConfig.tags populated: ${populated} / ${total}.`);

	const untagged = [...dbIds].filter((id) => !parsedIds.has(id));
	if (untagged.length > 0) {
		console.log(
			`Left NULL - absent from the CommunityDragon file, or its tags did not parse: ${untagged.join(", ")}`,
		);
	}

	const titles = parseTitles(payload.titles);
	for (const title of titles) {
		await db
			.insert(challengeTitle)
			.values(title)
			.onConflictDoUpdate({
				target: challengeTitle.itemId,
				set: { name: title.name },
			});
	}

	const [{ storedTitles }] = await db.select({ storedTitles: count() }).from(challengeTitle);
	console.log(`Titles: ${titles.length} in the payload, ${storedTitles} stored.`);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
