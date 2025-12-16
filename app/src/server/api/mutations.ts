import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { getChallengesConfig as getChallengesConfigDb } from "./get-challenges-config";

export const getDataDragonVersion = createServerFn({ method: "GET" }).handler(
	async () => {
		const result = await db.query.championDetails.findFirst({
			columns: { version: true },
		});
		return result?.version ?? "15.24.1";
	},
);

export const getChallengesConfig = createServerFn().handler(async () => {
	return getChallengesConfigDb();
});
