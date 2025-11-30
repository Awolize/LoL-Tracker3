// app/server/userSuggestions.ts
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { summoner } from "@/db/schema";
import { ilike, and, desc } from "drizzle-orm";

export const getUsernameSuggestions = createServerFn({
  method: "POST",
})
  .inputValidator((data: { username: string; region: string }) => ({
    username: data.username,
    region: data.region,
  }))
  .handler(async ({ data: { username, region } }) => {
    const query = username.trim().toLowerCase();
    if (!query || query.length > 50) return [];

    // Split query on # to handle gameName#tagLine format
    const [gameNamePart = "", tagLinePart = ""] = query
      .split("#")
      .map((s) => s.trim());

    let whereConditions;
    if (gameNamePart && tagLinePart) {
      whereConditions = and(
        ilike(summoner.gameName, `%${gameNamePart}%`),
        ilike(summoner.tagLine, `%${tagLinePart}%`)
      );
    } else if (gameNamePart) {
      whereConditions = ilike(summoner.gameName, `%${gameNamePart}%`);
    } else if (tagLinePart) {
      whereConditions = ilike(summoner.tagLine, `%${tagLinePart}%`);
    } else {
      return [];
    }

    const suggestions = await db
      .select({
        gameName: summoner.gameName,
        tagLine: summoner.tagLine,
        summonerLevel: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
        region: summoner.region,
      })
      .from(summoner)
      .where(whereConditions)
      .orderBy(desc(summoner.updatedAt))
      .limit(10);

    return suggestions.map((entry) => ({
      username: `${entry.gameName}#${entry.tagLine}`,
      level: entry.summonerLevel,
      iconId: entry.profileIconId,
      region: entry.region,
    }));
  });
