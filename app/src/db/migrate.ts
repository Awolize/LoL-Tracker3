import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

// Load environment variables
config();

async function runMigrations() {
	console.log("⏳ Running migrations...");

	const pool = new Pool({
		connectionString: process.env.DATABASE_URL!,
	});

	const db = drizzle(pool);

	try {
		await migrate(db, { migrationsFolder: "./drizzle" });
		console.log("✅ Migrations completed successfully");
		await pool.end();
		process.exit(0);
	} catch (error) {
		console.error("❌ Migration failed:", error);
		await pool.end();
		process.exit(1);
	}
}

runMigrations();
