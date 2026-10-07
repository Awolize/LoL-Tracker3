# TODO

## Verify the Docker / compose path end-to-end

Everything so far has been run **host-side** (`pnpm dev` against `lol-local-db18`). The
containerised path has never been exercised, and it is the one that ships.

- [ ] `docker compose up -d --build web` — builds the image (runs `pnpm install --frozen-lockfile`
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
- [ ] `docker compose down` → `docker compose up -d` and confirm data persists in `./db/data`
      and `./rustfs/data`.

## Deferred / nice to have

- [ ] Delete the dev-only image workaround in `app/vite.config.ts` once TanStack/Nitro fix
      <https://github.com/TanStack/router/issues/7523> (splat routes + file extensions 404 under
      `vite dev` when `Accept`/`Sec-Fetch-Dest` aren't `text/html`/`document`).
- [ ] Consider retiring `_MatchSummoners` — `MatchParticipant` (`unique (matchId, puuid)`) now
      subsumes the match↔summoner link, so the join table and its relations could go.
- [ ] 11 junk `MatchInfo` rows in the production data (0 participants, `1970-01-01` timestamps)
      are why 11 matches have no `MatchParticipant` rows. Harmless, but a cleanup script would
      tidy the projection integrity check.
- [ ] `pnpm-workspace.yaml` could set `managePackageManagerVersions: false` to keep the `pnpm` /
      `@pnpm/exe` platform packages out of `pnpm-lock.yaml` (they were added when the project
      pinned `packageManager: pnpm@12.9.1`).
