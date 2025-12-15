import { createFileRoute } from "@tanstack/react-router";
import { and, desc, eq, isNull, not } from "drizzle-orm";
import { db } from "@/db";
import { challengesConfig, summoner } from "@/db/schema";
import { regionToDisplay } from "@/features/shared/champs";

export const Route = createFileRoute("/api/sitemap/$page.xml")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				const page = Number(params.page) || 1;
				const pageSize = 500;
				const offset = (page - 1) * pageSize;

				const users = await db
					.select({
						region: summoner.region,
						gameName: summoner.gameName,
						tagLine: summoner.tagLine,
						updatedAt: summoner.updatedAt,
					})
					.from(summoner)
					.where(
						and(not(isNull(summoner.gameName)), not(isNull(summoner.tagLine))),
					)
					.orderBy(desc(summoner.createdAt))
					.limit(pageSize)
					.offset(offset);

				const baseUrl = "https://lol2.awot.dev";

				let challengeUrls = "";
				if (page === 1) {
					// Add challenge leaderboard URLs on first page
					const challenges = await db
						.select({ id: challengesConfig.id })
						.from(challengesConfig)
						.where(eq(challengesConfig.leaderboard, true));

					challengeUrls = challenges
						.map(
							(c) => `
  <url>
    <loc>${baseUrl}/challenge/${c.id}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`,
						)
						.join("");
				}

				const urls = users
					.map(
						(u) => `
  <url>
    <loc>${baseUrl}/${regionToDisplay(u.region)}/${u.gameName}-${u.tagLine}</loc>
    <lastmod>${u.updatedAt.toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
					)
					.join("");

				return new Response(
					`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${challengeUrls}${urls}
</urlset>`,
					{
						headers: {
							"Content-Type": "application/xml",
							"Cache-Control": "public, max-age=3600",
						},
					},
				);
			},
		},
	},
});
