# LoL-Tracker3

League of Legends match tracker: TanStack Start (React SSR) + Postgres/Drizzle, with a BullMQ
worker queue. Public profile pages (hub, champion mastery, match history, a five-challenge
tracker), a global challenge directory with leaderboards, and an image CDN proxy that caches Data
Dragon and CommunityDragon assets in RustFS.

`README.md` covers setup and deploy. `TODO.md` is the backlog, plus the notes on how the champion
lane calculation works.

## Layout

- `app/src/routes/` — file-based routes. `routeTree.gen.ts` is generated; do not edit it.
- `app/src/features/` — UI, grouped by feature. `app/src/components/` — shared UI.
- `app/src/db/schema.ts` — Drizzle schema. `app/drizzle/` — generated migrations and snapshots.
- `app/src/server/` — everything server-side.
  - The hazard to avoid: **never let DB/Node-only helpers be imported by a module a route statically
    imports**, because the bundler then drags `pg` and friends into the client bundle. That is why
    `api/get-challenge-leaderboard.api.ts` exists.
  - The naming for that boundary is **not** applied consistently, and does not need to be: plenty of
    `createServerFn`s live in `mutations.ts` / `get-challenges.ts` modules that routes import
    directly. Match the file you are in rather than imposing one pattern.
- `app/scripts/` — one-off scripts; they load the repo-root `.env` **before** importing the db.

## Conventions that bite when ignored

- **Drizzle query builder first** (`db.select()`). Raw `` sql` ` `` only for expressions the builder
  cannot express.
- **Never call a `createServerFn` from another server module** — it throws
  `No Start context found in AsyncLocalStorage`. Extract a plain function instead.
- **Prefer a literal `createServerFn` per exported server function over a factory.** TanStack
  discovers them from the exported declaration, so a wrapper risks leaving their client bindings out
  of the bundle. That is a precaution taken in `get-challenges.ts`, not something that was tested —
  share the *body* and keep one declaration per server function.
- `~/*` path alias (Vite's native `resolve.tsconfigPaths`), never `@`.
- **TanStack Router coerces numeric search params to numbers**: `?queue=420` reaches the route as
  `queue: 420`, while `?queue=420,440` stays a string. So `validateSearch` must not transform values
  (returning the number as a string makes the router rewrite the URL with a 307, and dropping values
  it cannot round-trip 500s) — validate as identity and normalise where the values are used.
- Tuning lives in exported constants, not magic numbers.
- Order versions from the data (`max(timestamp)`), never `ORDER BY` a version *string*: `"16.9"`
  sorts above `"16.19"`, and 16.9 is real data.
- Migrations do **not** run on container start. Deploy applies them explicitly:
  `docker compose run --rm web node prod-migrate.mjs` before `up -d`.
- The jsonb payload (`MatchInfo.participants`, `MatchInfo.teams`) is the source of truth;
  `MatchParticipant` is a rebuildable projection of it. Anything needing a complete participant
  list must read the jsonb — the projection cannot hold more than one bot per match.

## Code style

- Prefer `unknown` to `any`; `satisfies` for object literals; `as const`/`readonly` where they fit.
- Guard clauses, custom type guards, discriminated unions with exhaustive `never` checks; narrow
  early instead of optional-chaining everywhere.
- React: colocate state, compute rather than derive, custom hooks for non-UI logic, stable list
  keys, no side effects in render, and no reflexive `useMemo`/`useCallback`.

## Commands

`pnpm dev` (port 3001) · `pnpm check` (oxlint + oxfmt) · `pnpm db:migrate:prod` ·
`pnpm db:backfill-participants`

- **Ask before running a build or `pnpm dev`.**
- **There are no tests, and none are wanted.** Verification is `tsc --noEmit`, `oxlint`,
  `oxfmt --check`, plus rendering the affected route and checking it by hand. If `pnpm` cannot
  write its store where you are running, call the tools directly through `./node_modules/.bin/`.
- Commits: `type(scope): subject`, with a body that explains *why* and carries the measurements.

## Two environment files

`app/.env` points a host-run app at the local stack on localhost ports; the repo-root `.env` is for
Docker and uses compose service names (`db`, `rustfs`, `redis`).
