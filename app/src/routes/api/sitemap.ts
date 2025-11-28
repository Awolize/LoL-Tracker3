// /api/sitemap/index/xml.ts
import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { summoner } from "@/db/schema";
import { sql } from "drizzle-orm";

export const Route = createFileRoute('/api/sitemap')({
  server: {
    handlers: {
      GET: async () => {
        const base = "https://lol2.awot.dev";
        const pageSize = 500;

        // count total users with valid gameName/tagLine
        const totalUsersResult = await db
          .select({ count: sql`count(*)` })
          .from(summoner)
          .where(
            sql`${summoner.gameName} IS NOT NULL AND ${summoner.tagLine} IS NOT NULL`
          );

        const totalUsers = Number(totalUsersResult[0].count);
        const totalPages = Math.ceil(totalUsers / pageSize);

        const sitemaps = Array.from({ length: totalPages }, (_, i) => `
  <sitemap>
    <loc>${base}/api/sitemap/${i + 1}</loc>
  </sitemap>`).join("");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps}
</sitemapindex>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
