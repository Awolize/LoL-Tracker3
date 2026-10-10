import { createServerFn } from "@tanstack/react-start";

import { getChallengesConfig as getChallengesConfigDb } from "./get-challenges-config";
import { getDataDragonVersion as resolveDataDragonVersion } from "./get-datadragon-version";

export const getDataDragonVersion = createServerFn({ method: "GET" }).handler(async () => {
	return resolveDataDragonVersion();
});

export const getChallengesConfig = createServerFn().handler(async () => {
	return getChallengesConfigDb();
});
