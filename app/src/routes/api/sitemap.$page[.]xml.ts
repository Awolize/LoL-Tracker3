// sitemap.$page[.]xml.ts
import { createFileRoute } from "@tanstack/react-router";
import { and, desc, eq, isNull, not } from "drizzle-orm";
import { db } from "@/db";
import { challengesConfig, summoner } from "@/db/schema";
import { regionToDisplay } from "@/features/shared/champs";

const escapeXml = (s: string) =>
	s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/api/sitemap/$page.xml")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				console.log(params);

				const rawPage = params["page.xml"].replace(".xml", "");
				const page = Number(rawPage) || 1;
				const pageSize = 5000;
				const offset = (page - 1) * pageSize;

				const users = await db
					.select({
						region: summoner.region,
						gameName: summoner.gameName,
						tagLine: summoner.tagLine,
						updatedAt: summoner.updatedAt,
					})
					.from(summoner)
					.where(and(not(isNull(summoner.gameName)), not(isNull(summoner.tagLine))))
					.orderBy(desc(summoner.createdAt))
					.limit(pageSize)
					.offset(offset);

				const baseUrl = "https://lol.awot.dev";

				let challengeUrls = "";
				if (page === 1) {
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
					.map((u) => {
						const loc = `${baseUrl}/${regionToDisplay(u.region)}/${encodeURIComponent(u.gameName!)}-${encodeURIComponent(u.tagLine!)}`;
						return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${u.updatedAt.toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
					})
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
							"Content-Type": "text/xml; charset=utf-8",
							"Cache-Control": "public, max-age=3600",
						},
					},
				);
			},
		},
	},
});
