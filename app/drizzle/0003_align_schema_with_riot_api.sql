ALTER TABLE "CategoryPoints" DROP CONSTRAINT "CategoryPoints_challengesDetailsId_fkey";
--> statement-breakpoint
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_challengesDetailsId_fkey";
--> statement-breakpoint
ALTER TABLE "Challenges" DROP CONSTRAINT "Challenges_puuid_fkey";
--> statement-breakpoint
ALTER TABLE "ChallengesDetails" DROP CONSTRAINT "ChallengesDetails_puuid_fkey";
--> statement-breakpoint
ALTER TABLE "ChampionMastery" DROP CONSTRAINT "ChampionMastery_puuid_fkey";
--> statement-breakpoint
ALTER TABLE "Preferences" DROP CONSTRAINT "Preferences_challengesDetailsId_fkey";
--> statement-breakpoint
ALTER TABLE "TotalPoints" DROP CONSTRAINT "TotalPoints_challengesDetailsId_fkey";
--> statement-breakpoint
ALTER TABLE "Challenge" ALTER COLUMN "value" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "Challenge" ADD COLUMN "playersInLevel" integer;--> statement-breakpoint
ALTER TABLE "Challenge" ADD COLUMN "position" integer;--> statement-breakpoint
ALTER TABLE "ChallengesConfig" ADD COLUMN "tracking" text;--> statement-breakpoint
ALTER TABLE "ChallengesConfig" ADD COLUMN "startTimestamp" timestamp (3);--> statement-breakpoint
ALTER TABLE "ChallengesDetails" ADD COLUMN "createdAt" timestamp (3) DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ChallengesDetails" ADD COLUMN "updatedAt" timestamp (3) DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ChampionMastery" ADD COLUMN "markRequiredForNextLevel" integer;--> statement-breakpoint
ALTER TABLE "ChampionMastery" ADD COLUMN "championSeasonMilestone" integer;--> statement-breakpoint
ALTER TABLE "ChampionMastery" ADD COLUMN "nextSeasonMilestone" jsonb;--> statement-breakpoint
ALTER TABLE "ChampionMastery" ADD COLUMN "milestoneGrades" text[];--> statement-breakpoint
ALTER TABLE "MatchInfo" ADD COLUMN "dataVersion" text;--> statement-breakpoint
ALTER TABLE "MatchInfo" ADD COLUMN "endOfGameResult" text;--> statement-breakpoint
ALTER TABLE "Preferences" ADD COLUMN "crestBorder" text;--> statement-breakpoint
ALTER TABLE "Preferences" ADD COLUMN "prestigeCrestBorderLevel" integer;--> statement-breakpoint
ALTER TABLE "TotalPoints" ADD COLUMN "percentile" double precision;--> statement-breakpoint
ALTER TABLE "CategoryPoints" ADD CONSTRAINT "CategoryPoints_challengesDetailsId_fkey" FOREIGN KEY ("challengesDetailsId") REFERENCES "public"."ChallengesDetails"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_challengesDetailsId_fkey" FOREIGN KEY ("challengesDetailsId") REFERENCES "public"."ChallengesDetails"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Challenges" ADD CONSTRAINT "Challenges_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "public"."Summoner"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ChallengesDetails" ADD CONSTRAINT "ChallengesDetails_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "public"."Summoner"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ChampionMastery" ADD CONSTRAINT "ChampionMastery_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "public"."Summoner"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_challengesDetailsId_fkey" FOREIGN KEY ("challengesDetailsId") REFERENCES "public"."ChallengesDetails"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TotalPoints" ADD CONSTRAINT "TotalPoints_challengesDetailsId_fkey" FOREIGN KEY ("challengesDetailsId") REFERENCES "public"."ChallengesDetails"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "Challenge_challengeId_value_idx" ON "Challenge" USING btree ("challengeId" int4_ops,"value" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "ChampionMastery_puuid_idx" ON "ChampionMastery" USING btree ("puuid" text_ops);--> statement-breakpoint
CREATE INDEX "MatchInfo_gameStartTimestamp_idx" ON "MatchInfo" USING btree ("gameStartTimestamp" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "Summoner_region_gameName_tagLine_idx" ON "Summoner" USING btree ("region" text_ops,"gameName" text_ops,"tagLine" text_ops);--> statement-breakpoint
ALTER TABLE "Summoner" DROP COLUMN "summonerId";--> statement-breakpoint
ALTER TABLE "Summoner" DROP COLUMN "accountId";