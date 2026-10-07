# LoL-Tracker4

League of Legends player tracker built with TanStack Start.

## Quick Start

```bash
# 1. Setup environment
cp .env.example .env
# Edit .env and add your RIOT_API_KEY

# 2. Create directories
mkdir -p db/data db/share db/scripts rustfs/data rustfs/logs

# 3. Start everything
docker-compose up -d --build

# 4. Setup database
docker-compose exec app sh -c "pnpm run db:push"

# 5. Open app
# http://localhost:9003
```

## Tech Stack

- **TanStack Start** - React SSR framework
- **PostgreSQL** - Database (Postgres 18)
- **RustFS** - S3-compatible object storage for game assets (MinIO successor)
- **Drizzle ORM** - Type-safe database queries
- **Riot API** - Game data via [Twisted](https://github.com/justadev-afk/twisted)

## Environment Variables

**Keep ONE `.env` file at the root** - it's used by both Docker and local development.

Required in `.env`:

```env
RIOT_API_KEY=RGAPI-your-key-here
DATABASE_URL=postgresql://postgres:password@db:5432/lol_tracker
POSTGRES_PASSWORD=password
# Object storage credentials. The names are still MINIO_* because
# app/src/server/external/minio.ts reads them; RustFS uses the values.
MINIO_ENDPOINT=rustfs
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

Get API key: https://developer.riotgames.com/

**Note**: For local dev, change `DATABASE_URL` to use `localhost` instead of `db`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/lol_tracker
```

## Common Commands

```bash
# View logs
docker-compose logs -f app

# Restart after code changes
docker-compose up -d --build app

# Database migrations
docker-compose exec app sh -c "pnpm run db:push"

# Database GUI
docker-compose exec app sh -c "pnpm run db:studio"
# Visit http://localhost:4983

# Stop everything
docker-compose down

# Clean everything (deletes data!)
docker-compose down -v
rm -rf db/data/* rustfs/data/*
```

## Local Development (without Docker)

```bash
# 1. Start DB and object storage only
docker-compose -f docker-compose.dev.yml up -d

# 2. Update .env to use localhost instead of 'db'
# DATABASE_URL=postgresql://postgres:password@localhost:5432/lol_tracker
# MINIO_ENDPOINT=localhost

# 3. Run app locally
cd app
pnpm install
pnpm run dev
# Visit http://localhost:3000
```

## Project Structure

```
app/
├── src/
│   ├── routes/      # TanStack Router pages
│   ├── server/      # Server-side functions
│   ├── components/  # React components
│   ├── lib/         # Utilities
│   └── db/          # Database schema
├── Dockerfile
└── package.json
```

## Ports

- **9003** - Application
- **5432** - PostgreSQL
- **9100** - RustFS S3 API
- **9105** - RustFS Console → http://localhost:9105/rustfs/console/ (login with `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY`)

## Object Storage (RustFS)

MinIO's community edition was archived in 2026: the `minio/minio` Docker Hub repository
was withdrawn (old tags no longer pull), the management UI features were moved to their
commercial AIStor product, and no community binaries or images are published any more.
`docker-compose.yml` therefore runs [RustFS](https://rustfs.com) 1.0.1 (Apache-2.0), a
drop-in S3-compatible replacement; the app's `minio` SDK and `MINIO_*` env var names are
unchanged and were verified against it (put/get/list all work).

Notes:

- The app expects a bucket named **`images`** but never creates it. The `rustfs-init`
  service creates it on every `docker-compose up` (idempotent). If you ever need to do it
  by hand, open the console and create `images`.
- RustFS's container defaults to UID/GID `10001`; the compose files run it as `1000:1000`
  so the `./rustfs/data` and `./rustfs/logs` bind mounts stay writable. If your deploy user
  is not UID/GID 1000, change the `user:` line (and make sure those directories exist and
  are owned by it before the first `up`).
- Nothing needs migrating: the object store only caches Riot assets, and
  `app/src/routes/api/images/$.ts` re-fetches and re-stores them on a cache miss. The old
  `./minio/` volume (MinIO's proprietary on-disk layout) has been removed, and its
  `.gitignore` entry went with it.

## Troubleshooting

**Build fails:**
```bash
docker-compose build --no-cache app
```

**Port in use:**
```bash
# Edit docker-compose.yml and change port 9003 to something else
```

**API key expired:**
- Dev keys expire every 24 hours
- Get new one at https://developer.riotgames.com/

**Database issues:**
```bash
# Check if running
docker-compose ps db

# Access database
docker-compose exec db psql -U postgres -d lol_tracker
```

## Production Notes

- Change all default passwords in `.env`
- Set up SSL/TLS reverse proxy
- Configure automated database backups
- Use production Riot API key (apply at developer portal)