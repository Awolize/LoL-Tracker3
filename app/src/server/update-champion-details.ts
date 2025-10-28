import type { InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import type { ChampionsDataDragonDetails } from "twisted/dist/models-dto";
import { db } from "@/db";
import type { summoner } from "@/db/schema";
import { championDetails } from "@/db/schema";
import { lolApi } from "@/lib/lol-api";
import type { CompleteChampionInfo } from "@/lib/types";
import { masteryBySummoner } from "@/server/mastery-by-summoner";
import rolesJson from "./roles.json";

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

export async function updateChampionDetails() {
	const data = await lolApi.DataDragon.getChampion();
	const champions = Object.values(data.data);

	await Promise.all(
		champions.map(async (champion) => {
			if (!champion) return;
			const champ = flattenChamp(champion);

			const existing = await db
				.select()
				.from(championDetails)
				.where(eq(championDetails.id, champ.id))
				.then((r) => r[0]);

			if (existing) {
				await db
					.update(championDetails)
					.set(champ)
					.where(eq(championDetails.id, champ.id));
			} else {
				await db.insert(championDetails).values(champ);
			}
		}),
	);
}

export async function getCompleteChampionData(
	region: Regions,
	user: InferSelectModel<typeof summoner>,
) {
	const championMasteries = await masteryBySummoner(region, user);
	const champions = await db.select().from(championDetails);

	const completeChampionsData: CompleteChampionInfo[] = champions.map(
		(champion) => {
			const role = rolesJson[champion.key] || "Bottom";
			const mastery = championMasteries.find(
				(m) => m.championId === champion.id,
			) ?? {
				championPoints: 0,
				championLevel: 0,
			};
			return {
				...champion,
				...mastery,
				role,
				name: champion.name === "Nunu & Willump" ? "Nunu" : champion.name,
			};
		},
	);

	const version = champions.at(0)?.version ?? "";
	return { completeChampionsData, version };
}
