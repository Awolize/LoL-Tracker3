CREATE TABLE "MatchParticipant" (
	"matchId" text NOT NULL,
	"puuid" text NOT NULL,
	"participantId" integer NOT NULL,
	"teamId" integer NOT NULL,
	"championId" integer NOT NULL,
	"championName" text NOT NULL,
	"win" boolean NOT NULL,
	"teamPosition" text,
	"individualPosition" text,
	"placement" integer,
	"kills" integer NOT NULL,
	"deaths" integer NOT NULL,
	"assists" integer NOT NULL,
	"goldEarned" integer NOT NULL,
	"totalMinionsKilled" integer NOT NULL,
	"neutralMinionsKilled" integer NOT NULL,
	"visionScore" integer NOT NULL,
	"champLevel" integer NOT NULL,
	"timePlayed" integer NOT NULL,
	"totalDamageDealtToChampions" integer NOT NULL,
	"item0" integer,
	"item1" integer,
	"item2" integer,
	"item3" integer,
	"item4" integer,
	"item5" integer,
	"item6" integer,
	"summoner1Id" integer,
	"summoner2Id" integer,
	CONSTRAINT "MatchParticipant_pkey" PRIMARY KEY("matchId","participantId")
);
--> statement-breakpoint
ALTER TABLE "MatchParticipant" ADD CONSTRAINT "MatchParticipant_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("gameId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "MatchParticipant" ADD CONSTRAINT "MatchParticipant_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "public"."Summoner"("puuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "MatchParticipant_matchId_puuid_key" ON "MatchParticipant" USING btree ("matchId" text_ops,"puuid" text_ops);--> statement-breakpoint
CREATE INDEX "MatchParticipant_puuid_championId_idx" ON "MatchParticipant" USING btree ("puuid" text_ops,"championId" int4_ops);--> statement-breakpoint
CREATE INDEX "MatchParticipant_puuid_win_idx" ON "MatchParticipant" USING btree ("puuid" text_ops) WHERE "MatchParticipant"."win";