// prod-migrate.mjs
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg'; // or 'postgres' if using postgres.js

const { Pool } = pg;

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  console.log('⏳ Running database migrations...');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  // This will run migrations from the './drizzle' folder in the container
  await migrate(db, { migrationsFolder: './drizzle' });

  await pool.end();
  console.log('✅ Migrations completed successfully');
};

runMigrations().catch((err) => {
  console.error('❌ Migration failed', err);
  process.exit(1);
});