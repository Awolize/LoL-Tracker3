import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";

export const getDataDragonVersion = createServerFn({ method: "GET" }).handler(
	async () => {
		const result = await db.query.championDetails.findFirst({
			columns: { version: true },
		});
		return result?.version ?? "13.24.1";
	},
);
