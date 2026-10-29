import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { migrate as migratePg } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

export const MIGRATIONS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../migrations");
const DEFAULT_PGLITE_DIR =
  process.env.PGLITE_DIR ??
  resolve(dirname(fileURLToPath(import.meta.url)), "../../../.data/pglite");

export type Db = ReturnType<typeof drizzlePglite<typeof schema>>;

/**
 * DATABASE_URL があれば Postgres、なければ PGlite（ファイル保存）につなぐ。
 * どちらも同じ Postgres 方言なので、アプリのコードは区別しない。
 */
export async function createDb(databaseUrl = process.env.DATABASE_URL): Promise<Db> {
  if (databaseUrl) {
    const db = drizzlePg(postgres(databaseUrl), { schema });
    await migratePg(db, { migrationsFolder: MIGRATIONS_DIR });
    return db as unknown as Db;
  }
  mkdirSync(DEFAULT_PGLITE_DIR, { recursive: true });
  const db = drizzlePglite(new PGlite(DEFAULT_PGLITE_DIR), { schema });
  await migratePglite(db, { migrationsFolder: MIGRATIONS_DIR });
  return db;
}
