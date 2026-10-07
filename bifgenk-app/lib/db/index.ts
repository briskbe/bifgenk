import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Neon on the Vercel Marketplace sets DATABASE_URL (and POSTGRES_URL as an alias).
const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Reuse the connection across hot reloads in development.
const globalForDb = globalThis as unknown as { pgClient?: postgres.Sql };

// `prepare: false` is required for Neon's pooled (PgBouncer) connection string.
const client =
  globalForDb.pgClient ?? postgres(connectionString, { prepare: false, max: 5 });

if (process.env.NODE_ENV !== "production") globalForDb.pgClient = client;

export const db = drizzle(client, { schema });
