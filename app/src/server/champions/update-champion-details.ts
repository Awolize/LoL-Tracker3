import { eq } from "drizzle-orm";

import { db } from "~/db";
import { championDetails } from "~/db/schema";
import {
	CLASSIC_CHAMPION_VERSION,
	fetchClassicChampionDetail,
	fetchClassicChampions,
	toRiotTags,
} from "~/server/champions/classic-champions";
import { lolApi } from "~/server/external/riot/lol-api";
import type { ChampionsDataDragonDetails } from "~/server/external/riot/twisted";

// Flatten champion data (Drizzle expects a flat object)
const flattenChamp = (obj: ChampionsDataDragonDetails) => ({
	id: Number(obj.key),
	version: obj.version,
	key: obj.id,
	name: obj.name,
	title: obj.title,
	blurb: obj.blurb,
	attack: obj.info.attack,
	defense: obj.info.defense,
	magic: obj.info.magic,
	difficulty: obj.info.difficulty,
	full: obj.image.full,
	sprite: obj.image.sprite,
	group: obj.image.group,
	x: obj.image.x,
	y: obj.image.y,
	w: obj.image.w,
	h: obj.image.h,
	tags: obj.tags,
	partype: obj.partype,
	...obj.stats,
});

/**
 * Add the classic champions Data Dragon no longer lists.
 *
 * Data Dragon only shipped the `Jade_*` entries in 16.15.1, so a sync that reads its current
 * champion file can never see them again - the 60 rows in the table are the launch snapshot and
 * every champion Riot has added to the mode since is absent. CommunityDragon's client data still
 * has the roster, so the missing ids are topped up from there.
 *
 * The classic rows keep the current champion's stat block (the page shows identity and mastery,
 * never classic combat stats) and take their name, title and tags from CommunityDragon's files.
 */
const updateClassicChampionDetails = async (currentChampions: ChampionsDataDragonDetails[]) => {
	const classics = await fetchClassicChampions();
	if (classics.length === 0) return;

	const stored = await db.select({ id: championDetails.id }).from(championDetails);
	const storedIds = new Set(stored.map((row) => row.id));
	const missing = classics.filter((champion) => !storedIds.has(champion.id));
	if (missing.length === 0) return;

	const currentById = new Map(
		currentChampions.map((champion) => [Number(champion.key), champion]),
	);
	const currentByName = new Map(currentChampions.map((champion) => [champion.name, champion]));

	const rows = await Promise.all(
		missing.map(async (classic) => {
			try {
				const detail = await fetchClassicChampionDetail(classic.id);
				const base =
					(detail.relatedPrimeItemId === undefined
						? undefined
						: currentById.get(detail.relatedPrimeItemId)) ??
					currentByName.get(classic.name);

				if (!base) {
					console.warn(
						`[Champions] no current champion mirrors ${classic.alias}, skipping`,
					);
					return null;
				}

				const baseRow = flattenChamp(base);
				return {
					...baseRow,
					id: classic.id,
					version: CLASSIC_CHAMPION_VERSION,
					key: classic.alias,
					name: classic.name,
					title: detail.title ?? classic.description ?? baseRow.title,
					blurb: detail.shortBio ?? baseRow.blurb,
					tags: toRiotTags(detail.roles ?? classic.roles),
					full: `${classic.alias}.png`,
				};
			} catch (error) {
				// One champion's file failing must not hold back the rest of the set.
				console.error(`[Champions] could not load classic ${classic.alias}`, error);
				return null;
			}
		}),
	);

	const insertable = rows.filter((row): row is NonNullable<typeof row> => row !== null);
	if (insertable.length === 0) return;

	await db.insert(championDetails).values(insertable);
	console.log(
		`[Champions] inserted ${insertable.length} classic champions (${insertable
			.map((row) => row.key)
			.join(", ")})`,
	);
};

export async function updateChampionDetails() {
	const data = await lolApi.DataDragon.getChampion();
	const champions = Object.values(data.data).filter(
		(champion): champion is ChampionsDataDragonDetails => Boolean(champion),
	);

	await Promise.all(
		champions.map(async (champion) => {
			const champ = flattenChamp(champion);

			const existing = await db
				.select()
				.from(championDetails)
				.where(eq(championDetails.id, champ.id))
				.then((r) => r[0]);

			if (existing) {
				await db.update(championDetails).set(champ).where(eq(championDetails.id, champ.id));
			} else {
				await db.insert(championDetails).values(champ);
			}
		}),
	);

	try {
		await updateClassicChampionDetails(champions);
	} catch (error) {
		// A CommunityDragon outage must not fail the sync that keeps the 173 current champions
		// fresh; the next run retries the classic set.
		console.error("[Champions] classic champion sync failed", error);
	}
}
