CREATE TYPE "public"."Language" AS ENUM('en_US');--> statement-breakpoint
CREATE TABLE "CategoryPoints" (
	"category" text NOT NULL,
	"level" text NOT NULL,
	"current" integer NOT NULL,
	"max" integer NOT NULL,
	"percentile" double precision NOT NULL,
	"challengesDetailsId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Challenge" (
	"challengeId" integer NOT NULL,
	"percentile" double precision,
	"level" text,
	"value" integer,
	"achievedTime" timestamp (3),
	"challengesDetailsId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_ChallengeHeroes" (
	"A" text NOT NULL,
	"B" integer NOT NULL,
	CONSTRAINT "_ChallengeHeroes_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "ChallengeLocalization" (
	"id" integer NOT NULL,
	"language" "Language" NOT NULL,
	"description" text NOT NULL,
	"name" text NOT NULL,
	"shortDescription" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Challenges" (
	"puuid" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_ChallengesAdaptToAllSituations" (
	"A" text NOT NULL,
	"B" integer NOT NULL,
	CONSTRAINT "_ChallengesAdaptToAllSituations_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_ChallengesChampionOcean" (
	"A" text NOT NULL,
	"B" integer NOT NULL,
	CONSTRAINT "_ChallengesChampionOcean_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_ChallengesChampionOcean2024Split3" (
	"A" text NOT NULL,
	"B" integer NOT NULL,
	CONSTRAINT "_ChallengesChampionOcean2024Split3_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "ChallengesConfig" (
	"id" integer PRIMARY KEY NOT NULL,
	"state" text,
	"leaderboard" boolean NOT NULL,
	"endTimestamp" timestamp (3),
	"thresholds" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ChallengesDetails" (
	"puuid" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_ChallengesInvincible" (
	"A" text NOT NULL,
	"B" integer NOT NULL,
	CONSTRAINT "_ChallengesInvincible_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "ChampionDetails" (
	"id" integer PRIMARY KEY NOT NULL,
	"version" text,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"blurb" text NOT NULL,
	"attack" integer NOT NULL,
	"defense" integer NOT NULL,
	"magic" integer NOT NULL,
	"difficulty" integer NOT NULL,
	"full" text NOT NULL,
	"sprite" text NOT NULL,
	"group" text NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"w" integer NOT NULL,
	"h" integer NOT NULL,
	"tags" text[],
	"partype" text NOT NULL,
	"hp" double precision NOT NULL,
	"hpperlevel" double precision NOT NULL,
	"mp" double precision NOT NULL,
	"mpperlevel" double precision NOT NULL,
	"movespeed" double precision NOT NULL,
	"armor" double precision NOT NULL,
	"armorperlevel" double precision NOT NULL,
	"spellblock" double precision NOT NULL,
	"spellblockperlevel" double precision NOT NULL,
	"attackrange" double precision NOT NULL,
	"hpregen" double precision NOT NULL,
	"hpregenperlevel" double precision NOT NULL,
	"mpregen" double precision NOT NULL,
	"mpregenperlevel" double precision NOT NULL,
	"crit" double precision NOT NULL,
	"critperlevel" double precision NOT NULL,
	"attackdamage" double precision NOT NULL,
	"attackdamageperlevel" double precision NOT NULL,
	"attackspeedperlevel" double precision NOT NULL,
	"attackspeed" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ChampionMastery" (
	"championId" integer NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"championLevel" integer NOT NULL,
	"championPoints" integer NOT NULL,
	"tokensEarned" integer NOT NULL,
	"lastPlayTime" timestamp (3) NOT NULL,
	"championPointsUntilNextLevel" integer NOT NULL,
	"championPointsSinceLastLevel" integer NOT NULL,
	"puuid" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Match" (
	"gameId" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "MatchInfo" (
	"gameId" text PRIMARY KEY NOT NULL,
	"gameDuration" integer NOT NULL,
	"gameMode" text NOT NULL,
	"gameName" text NOT NULL,
	"gameType" text NOT NULL,
	"gameVersion" text NOT NULL,
	"mapId" integer NOT NULL,
	"participants" jsonb NOT NULL,
	"platformId" text NOT NULL,
	"queueId" integer NOT NULL,
	"teams" jsonb NOT NULL,
	"tournamentCode" text NOT NULL,
	"gameCreation" timestamp (3) NOT NULL,
	"gameStartTimestamp" timestamp (3) NOT NULL,
	"gameEndTimestamp" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_MatchSummoners" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_MatchSummoners_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "Preferences" (
	"bannerAccent" text NOT NULL,
	"title" text NOT NULL,
	"challengeIds" integer[],
	"challengesDetailsId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Summoner" (
	"summonerId" text,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"region" text NOT NULL,
	"profileIconId" integer NOT NULL,
	"puuid" text PRIMARY KEY NOT NULL,
	"summonerLevel" integer NOT NULL,
	"revisionDate" timestamp (3) NOT NULL,
	"accountId" text,
	"gameName" text,
	"tagLine" text
);
--> statement-breakpoint
CREATE TABLE "TotalPoints" (
	"level" text NOT NULL,
	"current" integer NOT NULL,
	"max" integer NOT NULL,
	"challengesDetailsId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "CategoryPoints" ADD CONSTRAINT "CategoryPoints_challengesDetailsId_fkey" FOREIGN KEY ("challengesDetailsId") REFERENCES "public"."ChallengesDetails"("puuid") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_challengesDetailsId_fkey" FOREIGN KEY ("challengesDetailsId") REFERENCES "public"."ChallengesDetails"("puuid") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ChallengeHeroes" ADD CONSTRAINT "_ChallengeHeroes_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Challenges"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ChallengeHeroes" ADD CONSTRAINT "_ChallengeHeroes_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."ChampionDetails"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ChallengeLocalization" ADD CONSTRAINT "ChallengeLocalization_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."ChallengesConfig"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Challenges" ADD CONSTRAINT "Challenges_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "public"."Summoner"("puuid") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ChallengesAdaptToAllSituations" ADD CONSTRAINT "_ChallengesAdaptToAllSituations_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Challenges"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ChallengesAdaptToAllSituations" ADD CONSTRAINT "_ChallengesAdaptToAllSituations_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."ChampionDetails"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ChallengesChampionOcean" ADD CONSTRAINT "_ChallengesChampionOcean_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Challenges"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ChallengesChampionOcean" ADD CONSTRAINT "_ChallengesChampionOcean_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."ChampionDetails"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ChallengesChampionOcean2024Split3" ADD CONSTRAINT "_ChallengesChampionOcean2024Split3_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Challenges"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ChallengesChampionOcean2024Split3" ADD CONSTRAINT "_ChallengesChampionOcean2024Split3_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."ChampionDetails"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ChallengesDetails" ADD CONSTRAINT "ChallengesDetails_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "public"."Summoner"("puuid") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ChallengesInvincible" ADD CONSTRAINT "_ChallengesInvincible_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Challenges"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ChallengesInvincible" ADD CONSTRAINT "_ChallengesInvincible_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."ChampionDetails"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ChampionMastery" ADD CONSTRAINT "ChampionMastery_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "public"."Summoner"("puuid") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "MatchInfo" ADD CONSTRAINT "MatchInfo_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Match"("gameId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_MatchSummoners" ADD CONSTRAINT "_MatchSummoners_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Match"("gameId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_MatchSummoners" ADD CONSTRAINT "_MatchSummoners_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Summoner"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_challengesDetailsId_fkey" FOREIGN KEY ("challengesDetailsId") REFERENCES "public"."ChallengesDetails"("puuid") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TotalPoints" ADD CONSTRAINT "TotalPoints_challengesDetailsId_fkey" FOREIGN KEY ("challengesDetailsId") REFERENCES "public"."ChallengesDetails"("puuid") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "CategoryPoints_category_challengesDetailsId_key" ON "CategoryPoints" USING btree ("category" text_ops,"challengesDetailsId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Challenge_challengeId_challengesDetailsId_key" ON "Challenge" USING btree ("challengeId" int4_ops,"challengesDetailsId" text_ops);--> statement-breakpoint
CREATE INDEX "_ChallengeHeroes_B_index" ON "_ChallengeHeroes" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ChallengeLocalization_id_language_key" ON "ChallengeLocalization" USING btree ("id" int4_ops,"language");--> statement-breakpoint
CREATE UNIQUE INDEX "Challenges_puuid_key" ON "Challenges" USING btree ("puuid" text_ops);--> statement-breakpoint
CREATE INDEX "_ChallengesAdaptToAllSituations_B_index" ON "_ChallengesAdaptToAllSituations" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE INDEX "_ChallengesChampionOcean_B_index" ON "_ChallengesChampionOcean" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE INDEX "_ChallengesChampionOcean2024Split3_B_index" ON "_ChallengesChampionOcean2024Split3" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE INDEX "_ChallengesInvincible_B_index" ON "_ChallengesInvincible" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ChampionDetails_id_key" ON "ChampionDetails" USING btree ("id" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ChampionMastery_championId_puuid_key" ON "ChampionMastery" USING btree ("championId" int4_ops,"puuid" text_ops);--> statement-breakpoint
CREATE INDEX "_MatchSummoners_B_index" ON "_MatchSummoners" USING btree ("B" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Preferences_challengesDetailsId_key" ON "Preferences" USING btree ("challengesDetailsId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Summoner_puuid_key" ON "Summoner" USING btree ("puuid" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TotalPoints_challengesDetailsId_key" ON "TotalPoints" USING btree ("challengesDetailsId" text_ops);