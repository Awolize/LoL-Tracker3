import { config } from "dotenv";
import { LolApi } from "twisted";

config();

const globalForLolApi = globalThis as unknown as {
	lolApi: LolApi | undefined;
};

export const lolApi = globalForLolApi.lolApi ?? new LolApi();

if (process.env.NODE_ENV !== "production") {
	globalForLolApi.lolApi = lolApi;
}
