# DB ↔ Riot API audit (Twisted layer)

_Uncommitted review artifact. Generated from a comparison of `app/src/db/schema.ts` +
`app/drizzle/*` against the fields Riot actually returns, as exposed through the
`twisted@1.73.0` client the app uses._

## Sources

- Riot **official API reference** (`developer.riotgames.com/apis`) for Summoner-V4,
  Account-V1, Match-V5, Champion-Mastery-V4, Challenges-V1.
- **Twisted 1.73.0 DTOs** in `app/node_modules/twisted/dist/models-dto`
  (these are the types the app compiles against — several are now stale).
- One **live Champion-Mastery-V4 response** (171 entries) captured during the audit to
  settle fields the docs and Twisted disagree on.

## TL;DR

The schema was largely faithful to the legacy Match-V5 / Summoner-V4 shapes, but had drifted
from the current API in three ways: **removed fields still modelled** (`Summoner.summonerId`,
`accountId`), **new fields never stored** (season milestones, `endOfGameResult`, `dataVersion`,
challenge `playersInLevel`/`position`, crest preferences), and **two live bugs** — one in
`gameDuration`/`gameEndTimestamp`, one in the challenge-config `parentId` write. All are
addressed in migration `0003_align_schema_with_riot_api.sql` plus code changes.

---

## Table-by-table comparison

Legend: ✅ matches API · ⚠️ gap/drift · ❌ bug

### `Summoner` ← Summoner-V4 + Account-V1

| API field                          | DB before                            | Action                                           |
| ---------------------------------- | ------------------------------------ | ------------------------------------------------ |
| `puuid`                            | ✅                                   | —                                                |
| `profileIconId`                    | ✅                                   | —                                                |
| `summonerLevel`                    | ✅                                   | —                                                |
| `revisionDate`                     | ✅                                   | —                                                |
| `gameName`, `tagLine` (Account-V1) | ✅                                   | —                                                |
| ~~`id`~~ / ~~`accountId`~~         | ⚠️ `summonerId`, `accountId` columns | **Removed** — Riot no longer returns them at all |

- Confirmed against the official reference: Summoner-V4 returns **only**
  `profileIconId`, `revisionDate`, `puuid`, `summonerLevel`. Twisted's `SummonerV4DTO`
  still declares `id`/`accountId` as required, so the app was silently writing `undefined`.
- ❌ **Destructive change:** migration drops `summonerId` and `accountId`. Any historical
  values are lost. These IDs are no longer usable for lookups, so this is safe functionally,
  but revert those two statements if you want to keep the history.
- Added index `Summoner_region_gameName_tagLine_idx` for the by-name lookups.

### `Match` / `MatchInfo` ← Match-V5

| API field                                                                                                                 | DB before           | Action            |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------------- |
| `metadata.dataVersion`                                                                                                    | ⚠️ missing          | **Added**         |
| `info.endOfGameResult`                                                                                                    | ⚠️ missing          | **Added**         |
| `info.gameDuration`                                                                                                       | ❌ see below        | Fixed semantics   |
| `info.gameEndTimestamp`                                                                                                   | ❌ computed wrongly | Fixed             |
| `gameId/mode/name/type/version`, `mapId`, `platformId`, `queueId`, `tournamentCode`, `gameCreation`, `gameStartTimestamp` | ✅                  | —                 |
| `info.participants`, `info.teams`                                                                                         | ✅ as `jsonb`       | design note below |

- ❌ **`gameDuration` is in SECONDS** (post-11.20; the Riot doc text is explicit). The old
  code did `new Date(gameStartTimestamp + gameDuration)` — i.e. treated seconds as
  milliseconds, producing a `gameEndTimestamp` about _1–2 seconds_ after the game started.
  The UI separately formatted the same value as `MM:SS`, so the two halves of the app
  disagreed about the unit.
- ✅ Fixed by storing `info.gameEndTimestamp` directly, with a seconds-aware fallback for
  pre-11.20 matches (all ingestion is post-2022, so the field is always present in practice).
- Design note: `participants`/`teams` are stored as opaque `jsonb`, so **new Riot participant
  fields flow through automatically** — that is why the huge `MatchPlayerData` type never
  broke. The trade-off is that per-participant queries need jsonb operators and the blob is
  large. Left as-is deliberately.
- `MatchInfo.gameId` holds `metadata.matchId` (the string `EUW1_…`), not the numeric
  `info.gameId` — correct, since the numeric id exceeds JS `Number.MAX_SAFE_INTEGER`.
- Added index `MatchInfo_gameStartTimestamp_idx` (match history sorts on it).

### `ChampionMastery` ← Champion-Mastery-V4

Live response fields: `puuid, championId, championLevel, championPoints, tokensEarned,
lastPlayTime, championPointsUntilNextLevel, championPointsSinceLastLevel,
markRequiredForNextLevel, championSeasonMilestone, nextSeasonMilestone, milestoneGrades`.

| API field                      | DB before  | Action                     |
| ------------------------------ | ---------- | -------------------------- |
| legacy 8 fields                | ✅         | —                          |
| `markRequiredForNextLevel`     | ⚠️ missing | **Added**                  |
| `championSeasonMilestone`      | ⚠️ missing | **Added**                  |
| `nextSeasonMilestone` (object) | ⚠️ missing | **Added** (`jsonb`)        |
| `milestoneGrades` (`string[]`) | ⚠️ missing | **Added**                  |
| `chestGranted`                 | —          | **Deliberately NOT added** |

- ⚠️ The official reference still lists `chestGranted`, but the **live response omits it**
  (none of 171 entries had it — Riot retired champion chests). Adding a column would model a
  field that no longer exists, so it was left out.
- Twisted's `ChampionMasteryDTO` lacks `milestoneGrades`; the code widens the response type
  locally (`ChampionMasteryDtoWithMilestones`).
- No primary key (only a unique index on `championId + puuid`). Works, but a real PK would be
  tidier.

### `ChallengesConfig` / `ChallengeLocalization` ← Challenges-V1 config

Config DTO: `id, localizedNames, state, tracking, startTimestamp, endTimestamp, leaderboard,
thresholds`.

| API field                                                  | DB before                                                               | Action                         |
| ---------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------ |
| `id`, `state`, `leaderboard`, `endTimestamp`, `thresholds` | ✅                                                                      | —                              |
| `tracking`                                                 | ⚠️ missing                                                              | **Added**                      |
| `startTimestamp`                                           | ⚠️ missing                                                              | **Added**                      |
| `thresholds` type                                          | ⚠️ `jsonb` → `unknown`                                                  | Typed `Record<string, number>` |
| `localizedNames`                                           | ✅ (`en_US` only)                                                       | —                              |
| ~~`parentId`~~                                             | ❌ schema column **dropped in migration 0002**, but code still wrote it | **Removed the dead write**     |

- ❌ `update-challenges-config.ts` built `rowData` with `parentId: (config as any).parentId`.
  There is **no `parentId` in the Riot config response** and no `parentId` column (it was
  added in `0001` and reverted in `0002`). Drizzle silently ignored the extra key, so this was
  dead code masquerading as a feature. Removed.
- Typing `thresholds` as `Record<string, number>` also cleared a pre-existing server-fn
  serialization type error.

### `ChallengesDetails` / `TotalPoints` / `Preferences` / `Challenge` / `CategoryPoints`

### ← Challenges-V1 player-data

`ChallengeInfoDto`: `percentile, playersInLevel, achievedTime, value, challengeId, level,
position`. `ChallengePointDto`: `level, current, max, percentile`.
`PlayerClientPreferencesDto`: `bannerAccent, title, challengeIds, crestBorder,
prestigeCrestBorderLevel`.

| API field                               | DB before                                         | Action                            |
| --------------------------------------- | ------------------------------------------------- | --------------------------------- |
| `Challenge.playersInLevel`              | ⚠️ missing                                        | **Added**                         |
| `Challenge.position`                    | ⚠️ missing                                        | **Added**                         |
| `Challenge.value`                       | ⚠️ `integer`, but API is `double`                 | **Widened** to `double precision` |
| `TotalPoints.percentile`                | ⚠️ missing                                        | **Added**                         |
| `Preferences.crestBorder`               | ⚠️ missing                                        | **Added**                         |
| `Preferences.prestigeCrestBorderLevel`  | ⚠️ missing                                        | **Added**                         |
| `ChallengesDetails.createdAt/updatedAt` | ⚠️ code wrote them, columns **did not exist**     | **Added**                         |
| `Preferences.challengeIds`              | ⚠️ doc says `List[string]`, column is `integer[]` | Coerced with `Number()`           |

- ⚠️ `upsertPlayerChallenges` inserted `createdAt`/`updatedAt` into a table whose schema had
  only `puuid`. Drizzle drops unknown insert keys, so `updatedAt` was never persisted — the
  "last synced" information was silently thrown away. Columns now exist and `updatedAt` is
  refreshed via `onConflictDoUpdate`.
- ⚠️ Riot documents the total-points percentile as `precentile` (an upstream typo); Twisted
  and the actual payload use `percentile`, which is what was stored.
- Added index `Challenge_challengeId_value_idx` (leaderboards filter by challenge and sort by
  value) and `ChampionMastery_puuid_idx`.

### `ChampionDetails` ← Data Dragon

- ✅ The flattened stat columns match Data Dragon's `stats` object exactly.
- `id = Number(champion.key)` and `key = champion.id` — intentional inversion, consistent.
- Design note: `skins`, `spells`, `passive`, `lore`, `recommended`, tips are intentionally not
  stored; the app doesn't render them.

---

## Cross-cutting fixes

### 1. FK `onDelete: restrict` → `cascade` (real bug)

`Challenges`, `ChampionMastery`, `ChallengesDetails` (and their children `TotalPoints`,
`Preferences`, `Challenge`, `CategoryPoints`) referenced `Summoner` with `ON DELETE RESTRICT`.
But `get-user-by-name-and-region.ts` **deletes dead/renamed summoners**. Because every tracked
player has mastery rows, that prune would have thrown a FK violation. The whole player-owned
graph now cascades from `Summoner`; verified functionally (below).

### 2. Match ingestion is now atomic

Previously `Match` was inserted first and `MatchInfo` second, outside a transaction. If the
second insert failed, the bare `Match` row survived — and `fetchMatchIds` skips any `matchId`
already present in `Match`, so that game would be **permanently lost**. Now both writes plus
the participant links happen in one transaction with `onConflictDoNothing()`. Each participant
upsert runs in a **nested transaction (SAVEPOINT)** so a single bad participant can't abort the
match (`try/catch` inside a Postgres transaction would otherwise poison it).

### 3. Riot ID casing consistency

`updateGamesSingle` stored `participant.riotIdGameName` with Riot's canonical casing, while
every other write path stores lowercase and `getUserByNameAndRegionFn` looks up with `eq`.
Match-ingested players could therefore be invisible to the name-cached lookup. Now lowercased.

---

## MatchParticipant projection

`MatchInfo.participants` / `teams` stay the raw source of truth and are unchanged. Added on top:

- **`MatchParticipant`** — a typed projection of the ~30 participant fields the app actually
  queries (identity, filter/stats scalars, items, summoner spells), with
  `PK (matchId, participantId)`, `unique (matchId, puuid)`, `(puuid, championId)` and a partial
  `(puuid) WHERE win` index; FKs to `Match` and `Summoner`, both cascade.
- **Write path** — [`updateGamesSingle`](app/src/server/matches/updateGames.ts) inserts the rows
  in the same transaction as the match.
- **Backfill** — [`scripts/backfill-match-participants.ts`](app/scripts/backfill-match-participants.ts)
  (`pnpm db:backfill-participants`), idempotent and batched, rebuilt purely from the jsonb.
  Promoting a newly-wanted field later is an `ALTER TABLE` + backfill, never a Riot re-fetch.
- **`ensureUserParticipantsProjected`** — a cheap count guard that projects a user's history on
  first use, so deploying before the backfill cannot silently recompute challenges as empty.
- **Challenge workers** now run their participant predicates in SQL instead of loading every
  match (and its participant blob) into Node.

`0004_match_participant_projection.sql` is **DDL only** — no data statement — so container
startup is not blocked by a large backfill. Run `pnpm db:backfill-participants` once, or let the
lazy per-user guard fill it in.

## Open items / decisions for you

1. **`DROP COLUMN summonerId, accountId`** — **confirmed, keep it.** The live Summoner-V4
   response returns only `profileIconId`, `revisionDate`, `puuid`, `summonerLevel`; the columns
   can never be populated again and the encrypted ids are no longer usable for lookups.
2. **`_prisma_migrations`** — leftover table from the pre-Drizzle setup, still modelled and
   unused. Could be dropped in a later migration.
3. **No ranked/league table** — the app never calls League-V4, so nothing is missing, but
   that's the obvious next feature if you want rank on profiles.
4. ~~**`participants`/`teams` are untyped `jsonb`.**~~ **Done.** Typed with `MatchParticipantDTO[]`
   / `MatchTeamDTO[]` derived from the `MatchV5.get` signature (v1.83 no longer exports
   `MatchV5DTOs` by name). The `as unknown as Array<any>` casts are gone and the hand-written
   `match-player-data.ts` mirror was deleted.
5. **`challengeIds` / `percentile` spelling** — **confirmed from a live `PlayerChallenges`** call.
   `totalPoints` is `{level, current, max, percentile}`, so `percentile` is right (Riot's
   `precentile` is a typo), and `preferences.challengeIds` is a **numeric** array
   (`201002, -1, -1` — note the `-1` "unset" sentinel), so `integer[]` is correct. The live entry
   did **not** carry `playersInLevel` / `position` despite the reference listing them; those two
   columns stay nullable and unpopulated unless Riot sends them.
6. **Pre-existing type errors** (33 messages across 12 files, mostly the `Regions` type mismatch
   between `features/shared/champs.ts` and Twisted, plus knip/`any` warnings) are deliberately
   untouched. Every change here adds none.

---

## Verification performed

- `drizzle-kit generate` produced `0003_align_schema_with_riot_api.sql` (reviewed by hand).
- Rehearsed on a **real production copy**: restored the prod dump into `postgres:18-alpine`
  (`pg_restore`, 37,843 matches), confirmed it was at migration `0002`, then ran
  `src/db/migrate.ts` to apply `0003` + `0004` — **success**.
- Ran `db:backfill-participants` against that copy: 397,161 `MatchParticipant` rows in ~60s.
- Verified the new SQL challenge path against the old jsonb path on real users: identical sets
  (zero symmetric difference), and a live refresh ingested 19 missing matches with all 10
  participant rows projected per match.
- Introspected the migrated DB: columns, all cascading FKs, and the new indexes present and correct.
- Functional round-trip with live-shaped values: inserted a summoner + mastery + full
  challenge graph + match; deleted the summoner; **every child row cascaded to 0**.
- SAVEPOINT test: a failing nested transaction does not abort the outer one.
- `tsc --noEmit`: **0 new errors** vs a pristine `HEAD` worktree.
- `oxfmt --check`: clean.

---

## Dependency upgrade: `twisted` 1.73.0 → 1.83.0

Separate follow-up. Before upgrading I verified the installed copy was the stock published
tarball (sha512 matched the lockfile; `diff -r` against the npm tarball showed no changes), so
there was **no fork wired into this repo**. Latest is **1.83.0**.

**What 1.83 changes**

- Ships as a **single bundle** (`dist/index.js` + `dist/index.d.ts`). The `twisted/dist/*` deep
  paths no longer exist — the app had 27 of those imports.
- Drops `axios`, `lodash`, `dotenv`, `uuid`, `http-status-codes` for native `fetch`; Node ≥ 18.
- Root exports are now only: `RiotApi`, `LolApi`, `TftApi`, `Constants`, `Dto`, `RateLimitError`,
  `GenericError`, `ServiceUnavailable`, `ApiKeyNotFound`, `IErrors`.
- **Upstream packaging regression:** `Constants` and `Dto` are exported as _values only_, so
  `Constants.Regions` / `Dto.ChampionMasteryDTO` are not usable as **types**, and the DTO type
  names are no longer exported at all. The migration is therefore not a pure find-and-replace.

**How the app was migrated**

- New `app/src/server/external/riot/twisted.ts` is the single module that imports `twisted`. It
  re-exports the runtime values and **derives the DTO types from the client's own method
  signatures** — e.g.
  `AccountDto = Awaited<ReturnType<RiotApi["Account"]["getByRiotId"]>>["response"]`.
- All 23 Twisted imports across 21 files now point at that shim.
- This incidentally picks up the **1.75.1 bugfix** where an internal 429/503 retry dropped the
  request's query params (relevant to `MatchV5.list({ count, start, startTime })`).

**Not fixed by the upgrade** — still absent from 1.83.0's models, so the local type widenings
stay: `milestoneGrades`, `playersInLevel`, `crestBorder`, `prestigeCrestBorderLevel`; and
`SummonerV4DTO` still declares the removed `id` / `accountId`.

**Verified** — `tsc` error set identical (33 pre-existing, none new); `vite build` succeeds and
bundles `twisted.mjs` (37.6 kB, no axios); a live `Challenges.Configs("EUW1")` call returns 405
configs; Node ESM↔CJS named-import interop checked.

---

## Files touched

Schema / DB work:

```
app/drizzle/0003_align_schema_with_riot_api.sql   (new)
app/drizzle/meta/0003_snapshot.json               (new)
app/drizzle/meta/_journal.json
app/src/db/schema.ts
app/src/routes/challenge.$challengeId.tsx
app/src/server/api/get-user-by-name-and-region.ts
app/src/server/challenges/update-challenges-config.ts
app/src/server/challenges/update-player-challenges.ts
app/src/server/champions/upsertMastery.ts
app/src/server/matches/updateGames.ts
app/src/server/summoner/mutations.ts
```

Twisted 1.83 migration:

```
app/package.json
app/pnpm-lock.yaml
app/src/server/external/riot/twisted.ts            (new — the shim)
app/scripts/verify-stable-queue-job-ids.ts
app/src/features/shared/types.ts
app/src/server/api/{get-user-by-name-and-region,lol-api-summoner-by-puuid,rate-limit-wrapper}.ts
app/src/server/api/riot-api-account-by-{puuid,username}.ts
app/src/server/challenges/{mutations,update-challenges-config,update-player-challenges}.ts
app/src/server/champions/{get-complete-champion-data,mastery-by-summoner,update-champion-details,upsertMastery}.ts
app/src/server/external/riot/{lol-api,riot-api}.ts
app/src/server/jobs/{queue,queue-stable-job-opts}.ts
app/src/server/matches/updateGames.ts
app/src/server/summoner/{get-summoner-by-username-rate-limit,mutations,upsertSummoner}.ts
```

Nothing was committed. `app/pnpm-workspace.yaml` was already modified before this work and was
left alone.

> **Note on `node_modules`:** this sandbox's pnpm store is read-only, so the lockfile was
> updated via `--lockfile-only` and `twisted@1.83.0` was placed into `node_modules` by hand for
> verification. Run `pnpm install` normally on your machine — the lockfile already validates
> (`pnpm install --frozen-lockfile` passes) and will materialise the tree and prune the now
> unused `uuid` / `http-status-codes` lock entries.
