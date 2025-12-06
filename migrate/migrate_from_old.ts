import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as newSchema from "./new/schema";
import * as oldSchema from "./old/schema";

const oldClient = new Client({
  connectionString: "postgresql://postgres:asdhjDHJsdchjnk12NKADHJNK23ASNK1@localhost:5432/postgres",
});
const newClient = new Client({
  connectionString: "postgresql://postgres:password@nixos:9132/postgres",
});

const oldDb = drizzle(oldClient);
const newDb = drizzle(newClient);

function toDate(value: any) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

async function migrateTable(
  name: string,
  oldTable: any,
  newTable: any,
  transform?: (row: any) => any,
  pk?: any
) {
  console.log(`\nMigrating table: ${name}`);
  const rows = await oldDb.select().from(oldTable);
  let success = 0;
  let skipped = 0;

  for (const r of rows) {
    try {
      await newDb.insert(newTable).values(transform ? transform(r) : r).onConflictDoNothing(pk);
      success++;
    } catch (err) {
      skipped++;
      
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`Row skipped in ${name}:`, msg);
    }
  }

  console.log(`Finished ${name}. Inserted: ${success}, Skipped: ${skipped}`);
}

async function migrate() {
  await oldClient.connect();
  await newClient.connect();

  await migrateTable(
    "Summoner",
    oldSchema.summoner,
    newSchema.summoner,
    (s) => ({
      summonerId: s.summonerId,
      createdAt: toDate(s.createdAt),
      updatedAt: toDate(s.updatedAt),
      region: s.region,
      profileIconId: s.profileIconId,
      puuid: s.puuid,
      summonerLevel: s.summonerLevel,
      revisionDate: toDate(s.revisionDate),
      accountId: s.accountId,
      gameName: s.gameName,
      tagLine: s.tagLine,
    }),
    newSchema.summoner.puuid
  );

  await migrateTable("Challenges", oldSchema.challenges, newSchema.challenges, undefined, newSchema.challenges.puuid);
  await migrateTable("ChallengesDetails", oldSchema.challengesDetails, newSchema.challengesDetails, undefined, newSchema.challengesDetails.puuid);
  await migrateTable("TotalPoints", oldSchema.totalPoints, newSchema.totalPoints, undefined, newSchema.totalPoints.challengesDetailsId);
  await migrateTable("Preferences", oldSchema.preferences, newSchema.preferences, undefined, newSchema.preferences.challengesDetailsId);
  await migrateTable(
    "Challenge",
    oldSchema.challenge,
    newSchema.challenge,
    (c) => ({ ...c, achievedTime: toDate(c.achievedTime) }),
    { challengeId: newSchema.challenge.challengeId, challengesDetailsId: newSchema.challenge.challengesDetailsId }
  );
  await migrateTable("CategoryPoints", oldSchema.categoryPoints, newSchema.categoryPoints, undefined, { category: newSchema.categoryPoints.category, challengesDetailsId: newSchema.categoryPoints.challengesDetailsId });
  await migrateTable("ChampionDetails", oldSchema.championDetails, newSchema.championDetails, undefined, newSchema.championDetails.id);
  await migrateTable(
    "ChampionMastery",
    oldSchema.championMastery,
    newSchema.championMastery,
    (m) => ({
      championId: m.championId,
      updatedAt: toDate(m.updatedAt),
      championLevel: m.championLevel,
      championPoints: m.championPoints,
      tokensEarned: m.tokensEarned,
      lastPlayTime: toDate(m.lastPlayTime),
      championPointsUntilNextLevel: m.championPointsUntilNextLevel,
      championPointsSinceLastLevel: m.championPointsSinceLastLevel,
      puuid: m.puuid,
    }),
    { championId: newSchema.championMastery.championId, puuid: newSchema.championMastery.puuid }
  );
  await migrateTable("Match", oldSchema.match, newSchema.match, undefined, newSchema.match.gameId);
  await migrateTable(
    "MatchInfo",
    oldSchema.matchInfo,
    newSchema.matchInfo,
    (m) => ({
      ...m,
      gameCreation: toDate(m.gameCreation),
      gameStartTimestamp: toDate(m.gameStartTimestamp),
      gameEndTimestamp: toDate(m.gameEndTimestamp),
    }),
    newSchema.matchInfo.gameId
  );

  // Repeat for the rest of the join tables
  const joinTables = [
    ["_MatchSummoners", oldSchema.matchSummoners, newSchema.matchSummoners, { a: newSchema.matchSummoners.a, b: newSchema.matchSummoners.b }],
    ["_ChallengeHeroes", oldSchema.challengeHeroes, newSchema.challengeHeroes, { a: newSchema.challengeHeroes.a, b: newSchema.challengeHeroes.b }],
    ["_ChallengesChampionOcean", oldSchema.challengesChampionOcean, newSchema.challengesChampionOcean, { a: newSchema.challengesChampionOcean.a, b: newSchema.challengesChampionOcean.b }],
    ["_ChallengesChampionOcean2024Split3", oldSchema.challengesChampionOcean2024Split3, newSchema.challengesChampionOcean2024Split3, { a: newSchema.challengesChampionOcean2024Split3.a, b: newSchema.challengesChampionOcean2024Split3.b }],
    ["_ChallengesAdaptToAllSituations", oldSchema.challengesAdaptToAllSituations, newSchema.challengesAdaptToAllSituations, { a: newSchema.challengesAdaptToAllSituations.a, b: newSchema.challengesAdaptToAllSituations.b }],
    ["_ChallengesInvincible", oldSchema.challengesInvincible, newSchema.challengesInvincible, { a: newSchema.challengesInvincible.a, b: newSchema.challengesInvincible.b }],
  ];

for (const [tableName, oldT, newT, pk] of joinTables) {
  await migrateTable(String(tableName), oldT, newT, undefined, pk);
}

  console.log("\nMigration complete");
  await oldClient.end();
  await newClient.end();
}

migrate().catch(console.error);
