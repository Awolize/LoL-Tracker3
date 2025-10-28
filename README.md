# LoL-Tracker4

League of Legends player tracker built with TanStack Start.

## Quick Start

```bash
# 1. Setup environment
cp .env.example .env
# Edit .env and add your RIOT_API_KEY

# 2. Create directories
mkdir -p db/data db/share db/scripts minio/data

# 3. Start everything
docker-compose up -d --build

# 4. Setup database
docker-compose exec app sh -c "pnpm run db:push"

# 5. Open app
# http://localhost:9003
```

## Tech Stack

- **TanStack Start** - React SSR framework
- **PostgreSQL** - Database
- **MinIO** - Object storage for game assets
- **Drizzle ORM** - Type-safe database queries
- **Riot API** - Game data via [Twisted](https://github.com/Sansossio/twisted)

## Environment Variables

**Keep ONE `.env` file at the root** - it's used by both Docker and local development.

Required in `.env`:

```env
RIOT_API_KEY=RGAPI-your-key-here
DATABASE_URL=postgresql://postgres:password@db:5432/lol_tracker
POSTGRES_PASSWORD=password
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
rm -rf db/data/* minio/data/*
```

## Local Development (without Docker)

```bash
# 1. Start DB and MinIO only
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
- **9000** - MinIO API
- **9005** - MinIO Console (login: minioadmin/minioadmin)

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