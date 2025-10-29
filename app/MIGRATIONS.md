# Database Migrations Guide

This guide explains how to manage database migrations in development and production environments.

## Overview

- **Development**: Use `db:push` for rapid iteration
- **Production**: Use migrations for tracked, versioned schema changes

## Development Workflow

### Making Schema Changes

1. Edit your schema in `src/db/schema.ts`
2. Push changes directly to your dev database:
   ```bash
   pnpm db:push
   ```

This bypasses migrations and directly syncs your schema to the database. Perfect for rapid development!

### When to Generate Migrations

Generate migrations when your schema is stable and ready for production:

```bash
pnpm db:generate
```

This creates a new migration file in `drizzle/` (e.g., `drizzle/0001_migration_name.sql`)

**Important**: Review the generated SQL before committing!

### Commit Your Migrations

```bash
git add drizzle/
git commit -m "Add migration: [description]"
git push
```

## Production Workflow

### Automatic Migrations on Container Start

The production Docker container automatically runs pending migrations on startup via `docker-entrypoint.sh`:

1. Container starts
2. Runs `pnpm drizzle-kit migrate`
3. If migrations succeed → starts the application
4. If migrations fail → container exits with error

### Manual Migration (Alternative)

If you prefer to run migrations manually:

```bash
# SSH into production container or connect to prod DB
pnpm db:migrate
```

### Production Deployment Steps

1. **Build and push Docker image**:
   ```bash
   docker build -t your-app:latest .
   docker push your-app:latest
   ```

2. **Deploy container** (migrations run automatically on startup)

3. **Verify migrations**:
   ```bash
   docker logs your-container-name
   # Look for: ✅ Migrations completed successfully
   ```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm db:push` | Sync schema directly to DB (dev only) |
| `pnpm db:generate` | Generate migration files from schema |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm db:pull` | Pull schema from existing database |
| `pnpm db:studio` | Open Drizzle Studio (GUI) |

## Migration Files

Migration files are stored in `drizzle/` and track schema changes:

```
drizzle/
├── 0000_initial_schema.sql
├── 0001_add_users.sql
├── 0002_add_indexes.sql
└── meta/
    └── _journal.json
```

### Migration File Structure

Each migration file contains:
- SQL statements to apply the change
- Drizzle metadata comments

Example:
```sql
CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "name_idx" ON "users" ("name");
```

## Common Issues

### Migration Failed in Production

**Symptoms**: Container exits with migration error

**Solutions**:
1. Check logs: `docker logs your-container-name`
2. Fix the migration SQL in `drizzle/*.sql`
3. Rebuild and redeploy

### Schema Out of Sync

**Symptoms**: `db:push` shows many changes

**Solution**:
```bash
# Generate a new migration capturing current state
pnpm db:generate

# Review and commit
git add drizzle/
git commit -m "Sync schema with database"
```

### Rollback a Migration

Drizzle doesn't have built-in rollback. To revert:

1. **Manual SQL**: Write and execute reverse SQL
2. **New Migration**: Generate a migration that undoes changes
3. **Restore Backup**: Restore database from backup (safest for production)

## Best Practices

### Development
- ✅ Use `db:push` for rapid iteration
- ✅ Test schema changes thoroughly
- ✅ Generate migrations when feature is complete
- ❌ Don't commit every tiny change

### Production
- ✅ Always review generated SQL
- ✅ Test migrations on staging first
- ✅ Backup database before major migrations
- ✅ Keep migrations small and focused
- ❌ Never edit migration files after they've run in production
- ❌ Never use `db:push` in production

### Migration Guidelines
- **One change per migration** (easier to debug)
- **Descriptive names** (use `db:generate --name "add_user_avatar"`)
- **Backwards compatible** when possible (add columns as nullable first)
- **Test rollback strategy** before production

## Emergency: Bypass Migrations

If migrations are blocking your deployment, you can temporarily disable them:

### Option 1: Comment out migration step in docker-entrypoint.sh
```bash
# Comment out this line:
# pnpm drizzle-kit migrate
```

### Option 2: Use db:push in production (not recommended)
```bash
# SSH into production
pnpm db:push
```

⚠️ **Warning**: Only use this in emergencies! Always fix the underlying issue.

## Resources

- [Drizzle ORM Migrations Docs](https://orm.drizzle.team/docs/migrations)
- [Drizzle Kit Commands](https://orm.drizzle.team/kit-docs/overview)
- Schema location: `src/db/schema.ts`
- Config location: `drizzle.config.ts`
