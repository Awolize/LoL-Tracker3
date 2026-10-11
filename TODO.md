# TODO

## Verify the Docker / compose path end-to-end

Everything so far has been run **host-side** (`pnpm dev` against `lol-db2`). The containerised
path is only partly exercised - the `down` → `up -d` persistence cycle is done below, but the
build, health-gating and refresh checks are not - and it is the one that ships.

- [ ] `docker compose up -d --build web` - builds the image (runs `pnpm install --frozen-lockfile`
      inside the container) and starts `web` + `db` + `redis` + `rustfs` + `rustfs-init`.
- [ ] `rustfs-init` creates the `images` bucket (it is idempotent; expect `created` on a fresh
      volume or `already exists`).
- [ ] `web` actually waits for `db` and `rustfs` to report **healthy** (`depends_on` conditions),
      and `web` comes up on `http://localhost:9103/`.
- [ ] Images load on the built server **without** the dev-only shim in `app/vite.config.ts`
      (the shim is `apply: "serve"`, so it must be absent from the build).
- [ ] The container finds the seeded PG18 data in `./db/data` rather than initialising a fresh,
      empty cluster (check `SELECT count(*) FROM "MatchInfo"` reports the expected rows).
- [ ] Press refresh on a profile, then confirm new matches land **and** the matching
      `MatchParticipant` rows are written (they are inserted in the same transaction).
- [x] ~~`docker compose down` → `docker compose up -d` and confirm data persists in `./db/data`
      and `./rustfs/data`.~~ - **done**: survived the cycle unchanged. Same 37,866 `MatchInfo` /
      37,866 `Match` / 397,391 `MatchParticipant` rows and the same 5 applied migrations before
      and after (the 397,253 `_MatchSummoners` rows this check also recorded no longer exist -
      migration 0005 dropped the table afterwards, so only the other counts are still
      reproducible); the 439 objects in `./rustfs/data/images` were
      byte-for-byte the same set, and the PG cluster stayed at `./db/data/18/docker` with
      `rustfs-init` reporting `already exists and matches the request` rather than re-creating it.
      The `images` bucket is therefore not re-created on a restart - it is found because it is
      still on the bind mount.
      **Caveat found while doing this**: `docker compose down` also removes the external `webnet`
      network, so the next `up` fails with `network webnet declared as external, but could not be
      found` until it is recreated (`docker network create webnet`). That is a deploy-order
      hazard, not a data one. Note also that this host has no Traefik container, so `webnet` was
      not created by anything running here - nothing re-creates it automatically.

## Deferred / nice to have

- [x] ~~Delete the dev-only image workaround in `app/vite.config.ts` once TanStack/Nitro fix
      <https://github.com/TanStack/router/issues/7523>~~ - **done**: `nitro 3.0.260903-beta` fixed
      the dev static handler. Shim removed, verified in dev (`/api/images/*.webp` now returns
      `200 image/webp` with browser `Accept` + `Sec-Fetch-Dest: image`).
- [x] ~~Derive the champion lanes from match data instead of `roles.json`.~~ - **done**:
      `app/src/server/champions/lane-data.ts` derives each champion's lane from
      `MatchParticipant.teamPosition`. Resolution is the summoner's own lane on the latest patch
      (≥5 games) → the champion's global lane → `"Bottom"`.
- [x] ~~Decide the fate of `roles.json`~~ - **done (deleted)**: every one of the 233 champions in
      `ChampionDetails` has recorded games, so no champion ever resolved through it. The file is
      gone, the `staticRoles` lookup is gone, and a champion with no recorded games now falls
      straight to `"Bottom"` instead of to a stale hand-maintained table.
- [x] ~~Consider retiring `_MatchSummoners`~~ - **done**: `MatchParticipant` (`unique (matchId,
      puuid)`) is now the only match↔summoner link. `getMatches` filters with an `EXISTS` over
      `MatchParticipant`, `projectUserMatchParticipants` selects its matches through the
      projection itself, the table and its relations are out of `schema.ts`/`relations.ts`, and
      migration `0005_retire_match_summoners.sql` drops it (`DROP TABLE "_MatchSummoners"
      CASCADE`).
      Re-verified against the data before retiring, and the old note's numbers had drifted:
      `_MatchSummoners` holds 397,253 rows and `MatchParticipant` 397,391. In the direction that
      matters there were **no orphans** (every `_MatchSummoners` row has a participant row), but
      the reverse was **not** empty - 138 participant rows across 135 matches / 82 puuids have no
      join-table row, which is the write path being _more_ complete than the table being dropped.
      The core filter was proved equivalent on 5 heavy profiles (1,716–3,573 matches each):
      identical game-id sets in the same order. The projection and the lazy-repair guard were
      compared old-vs-new the same way (3,573 and 2,617 rows, 0 duplicates). The new
      `ensureUserParticipantsProjected` is a presence check - a user either has participant rows
      or has no history to read - instead of a row-count comparison against the retired table.
- [ ] 11 junk `MatchInfo` rows in the production data (0 participants, `1970-01-01` timestamps)
      are why 11 matches have no `MatchParticipant` rows. Harmless, but a cleanup script would
      tidy the projection integrity check. **Deliberately skipped for now** - nothing reads the
      integrity check, and deleting them would need a decision on re-fetching.
- [ ] `pnpm-workspace.yaml` could set `managePackageManagerVersions: false` to keep the `pnpm` /
      `@pnpm/exe` platform packages out of `pnpm-lock.yaml` (they were added when the project
      pinned `packageManager: pnpm@12.9.1`).
- [ ] 186 matches hold **fewer** `MatchParticipant` rows than their `MatchInfo.participants`
      jsonb. Verified decomposition (672 rows in total): **162** matches are short by 4 because
      five AI participants share the literal `puuid = "BOT"`, so `unique (matchId, puuid)`
      correctly keeps one row for them (810 bot entries across those 162 matches); the other
      **24** are short by 1 because a real participant has no `Summoner` row and the projection's
      FK blocks the insert. **A re-projection would fix nothing**: it is idempotent and the bots
      already have their single row, while all 24 genuinely missing participants have no
      `Summoner` row for `projectMatchesParticipants` to join on. The match view's player count
      reads `jsonb_array_length(MatchInfo.participants)` rather than counting the projection, so
      the UI is correct either way. Closing this needs the missing `Summoner` rows written from
      the jsonb first.
- Note: `MatchParticipant` **cannot** represent more than one bot in a match - they collide on
  `puuid = "BOT"` under `unique (matchId, puuid)`. Anything that needs a complete participant
  list has to read `MatchInfo.participants` (which is also why `playerCount` lives there).

## Notes on the lane calculation

The patch window is anchored to **Data Dragon**, asked live via twisted
(`lolApi.DataDragon.getVersions()`, `["16.20.1", …]` → `16.20`) and cached for 15 minutes. It is
used as a **cap**, not as the value itself: a summoner's games are counted on the newest
`PATCH_WINDOW` (2) patches at or below Data Dragon's, so an older patch is still used when the
newest one carries too few matches. Taking Data Dragon's patch literally would disable the
per-summoner tier every time a patch drops before enough games accumulate on it.

Data Dragon is asked **live** rather than read from `ChampionDetails.version`, because that column
is only as fresh as the last `updateChampionDetails()` sync while Data Dragon moves the moment a
patch ships. That gap would pin the window to a patch the game has already left. `getDataDragonVersion`
in `src/server/api/get-datadragon-version.ts` is the single resolver: live first, stored version as
the fallback when Data Dragon is unreachable. `getDataDragonVersion` in `mutations.ts` is the
server-function wrapper the client uses for icon URLs, and it resolves through the same cache.

`getStoredDataDragonVersion` reads `ChampionDetails.version` with an explicit `ORDER BY version
DESC` **because the table holds more than one version at a time** (currently `16.20.1` and
`16.15.1`), so an unordered `findFirst` could return the older one. It sorts 233 rows with a top-N
heapsort (~0.2 ms) and there is no index on `version`; at that size one is not needed.

`MatchInfo."dataVersion"` is **not** the patch - it is populated for only 19 rows with the value
`"2"`. The patch has to come from `gameVersion` (`16.19.823.722`), which is empty for the same 11
junk rows noted above.

Do not select the latest patch with `ORDER BY` over the raw version string: `"16.9"` sorts above
`"16.19"` lexicographically, and patch 16.9 is real data, so the query would quietly return an older
patch. `lane-data.ts` reduces it to the two-segment form (`split_part` 1 and 2) and ranks patches by
`max("gameStartTimestamp")`.

`individualPosition` is unusable for this - it is `"Invalid"` for 108,914 of 397,351 rows, against
a clean ~57.6k per lane for `teamPosition`.

## Why the per-summoner tier needs a patch window

History is backfilled only for tracked players while participant rows exist for everyone in a
match, so a typical summoner has ~1.2 stored games, and the per-summoner tier only fires once a
summoner has `MIN_SUMMONER_GAMES` (5) games on one champion within the window. Measured:

| Window                                                 | Summoner-champion pairs at ≥5 games |
| ------------------------------------------------------ | ----------------------------------- |
| 16.20 alone (4 matches, 25 players, newest 2026-10-08) | **0**                               |
| 16.19 alone (179 matches)                              | 16                                  |
| 16.20 + 16.19 (`PATCH_WINDOW = 2`)                     | 17                                  |

With a single patch, the tier switches off for everyone for the first days after a patch drops and
every champion resolves through the global lane. `PATCH_WINDOW` in `lane-data.ts` widens it while
staying patch-shaped; both values are exported so they are easy to tune.

## Cleanup backlog

Phases 1–3 of the code audit are done (`f38a415`, `a609a6d`, `3de445c`, `95ce732`, `dbf50ba`,
`6921531`, `5e83a7f`, `7bc865d`). What is left:

### Waiting on a command only the maintainer can run

- [ ] **Drop the unused dependencies (C3).** `app/package.json` is already edited: `@nivo/core`,
      `@nivo/line`, `@tanstack/react-devtools`, `@tanstack/react-router-devtools`,
      `@tanstack/router-plugin`, `@testing-library/{dom,react}`, `jsdom`, `vitest` and the `test`
      script are gone. **`pnpm install` still has to run** to rewrite `pnpm-lock.yaml` - the
      Dockerfile installs with `--frozen-lockfile`, so it fails until the lockfile catches up. Run it
      before committing.
      `@tanstack/router-plugin` is safe to drop: nothing imports it, and `@tanstack/start-plugin-core`
      already declares it (`node_modules/.pnpm/@tanstack+react-start@*/node_modules/@tanstack/start-plugin-core/package.json:90`),
      so `tanstackStart()` resolves it transitively. `@headlessui/react` **stays** - it is used by
      `components/region-list-selector.tsx:1` and appears in the built bundle. A production
      `npx vite build` passed against the previous tree.
- [ ] **`pnpm-workspace.yaml`: set `managePackageManagerVersions: false`** to keep the `pnpm` /
      `@pnpm/exe` platform packages out of the lockfile (they arrived with the `packageManager` pin).

### Deferred, with the reason

- [ ] **C7, the dropdown half.** `components/ui/dropdown-menu.tsx:210-225` re-exports eight components
      nothing imports. Dropping the re-exports also deletes their implementations (~100 lines of the
      vendored primitive), because `noUnusedLocals` flags the orphaned functions - that is a
      functionality removal rather than an export tidy, so it wants its own decision.
- [ ] **C16 follow-up.** `projectUserMatchParticipants` / `ensureUserParticipantsProjected` are
      deleted, with the reason recorded inline in `match-participants.ts`. 23 puuids appear in some
      match's jsonb with neither a `MatchParticipant` nor a `Summoner` row, so they have no readable
      history; rebuilding them would mean writing the `Summoner` rows from the jsonb first. Left open
      deliberately.

### Deliberately kept

- `MatchInfo.dataVersion` - a Riot Match-V5 payload field (`game.metadata.dataVersion`), written and
  never read, but fields that come from Riot stay.
- `getArenaMatches` / `getSRMatches` (`get-matches.ts:135`) - no callers yet; the Arena stats feature
  consumes them. Their `ARENA_MATCH_FILTERS` / `SR_MATCH_FILTERS` siblings are in use by the
  challenge workers.
- `card.tsx`'s `CardTitle` / `CardDescription` / `CardAction` / `CardFooter` - unused today, needed by
  the champion stats page.
- `Constants` in `external/riot/twisted.ts` - part of that module's deliberate re-export surface.
- `$region.$username.different.tsx` - an intentional 301 to `/challenge` for old links.

## Feature backlog

Data readiness is the point of this list. "Reads existing data" means no schema change and no new
Riot endpoint.

### Reads data already stored

- [ ] **F1 - match history filters + pagination.** Queue, champion, role, result, patch, date, and
      paging past 50. `getMatches` already accepts the filters (`get-matches.ts:7-41`) - the route just
      passes `{}` and `take: 50`. Needs a small static `queueId → name` map (it is not in the DB).
- [ ] **F2 - full match scoreboard.** Widen the expanded row with damage, gold, CS, vision, role,
      items and summoner spells. `MatchInfo.participants` holds all of it, and item/spell icons need
      no server work because `/api/images/$` proxies any Data Dragon path.
- [ ] **F3 - personal records.** Pentas, quadras, unreal kills, largest spree, highest damage, fastest
      win. Mostly jsonb-only fields; follow the projection pattern at `match-participants.ts:28-55`.
- [ ] **F4 - ban statistics.** Most-banned overall and per lane. `MatchInfo.teams[].bans` is present on
      37,859 matches and rendered nowhere. Watch `championId: -1` (that side had no ban).
- [ ] **F5 - Arena stats.** Average placement, top-1/top-4 rate, per-champion placement.
      `MatchParticipant.placement` is already projected and there are ~3.6k Arena matches; wire up
      `getArenaMatches`, which is the dead export this was written for.
- [ ] **F6 - ranked form.** Per-queue W-L, KDA, current streak, last 10. Queues 420 (19,200 rows) and
      440 (5,408) are already in the projection, and 47 users have ≥100 ranked-solo games.
- [ ] **F7 - duo / premade stats.** W-L and average KDA per recurring teammate; self-join
      `MatchParticipant` on `(matchId, teamId)`. Per-profile only - a typical participant has ~1.2
      stored games. **Measure the self-join on a heavy profile before shipping.**
- [ ] **F8 - per-champion performance page.** Winrate, KDA, CS/min, damage and vision per champion,
      filterable by role and queue. The biggest product gap; `getChampionIdsForUser`
      (`match-participants.ts:115`) is the pattern to copy. **Build on match data, not mastery** -
      `ChampionMastery` covers only 54 users while 145 puuids have ≥50 match rows.
- [ ] **F9 - lane matchup / record vs champion.** Self-join on `matchId` with a differing `teamId` and
      a matching `teamPosition`. `teamPosition` is null on ~27% of rows (288,501 / 397,431), so the
      join needs a documented fallback rather than silently dropping games.
- [ ] **F10 - global champion stats pages.** Public per-champion/per-role WR/KDA/CS pages built from
      every stored match; shares one aggregate module with F8. Patch extraction is already solved
      (`patchOf` / `patchWindow`) and the sitemap + IndexNow plumbing exists. Keep it behind F8.

### Needs a schema change or a new Riot endpoint

- [ ] **F11 - progress deltas over time.** "You gained 12,400 mastery points this week." Needs a
      snapshot table: nothing in the schema keeps history (`ChampionMastery` is overwritten in place).
      No new Riot calls. **Decide retention before shipping.** If this is planned, `@nivo/line` comes
      off the C3 removal list.
- [ ] **F12 - rank badge and climb history.** There is no league table, and `lolApi.League.byPUUID` is
      never called although the SDK exposes it. Do F6 first, then see whether phase 2 is still wanted.
- [ ] **F13 - match timeline.** The big one: a new endpoint, a frames/events table, and a backfill of
      every stored match. Defer until F1–F9 ship.

### Already exists - do not propose again

Challenge directory, search and tier bars; challenge leaderboards with a "your rank" deep-link;
per-challenge threshold ladders, maxed/left-to-max filters and near-top-tier sort; the mastery roster
with role grouping, sort, Jade toggle and manual role override; the five tracked challenges with
manual marking; username autocomplete; the image CDN proxy/cache; sitemaps + IndexNow; and the
theme toggle.
