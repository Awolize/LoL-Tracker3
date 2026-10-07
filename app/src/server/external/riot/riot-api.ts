import { config } from "dotenv";

import { RiotApi } from "~/server/external/riot/twisted";

config();

const globalForRiotApi = globalThis as unknown as {
	riotApi: RiotApi | undefined;
};

export const riotApi = globalForRiotApi.riotApi ?? new RiotApi();

if (process.env.NODE_ENV !== "production") {
	globalForRiotApi.riotApi = riotApi;
}
