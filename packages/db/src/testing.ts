import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { type Db, MIGRATIONS_DIR } from "./client";
import * as schema from "./schema";

// マイグレーション済みのひな形を1つだけ作り、テストごとに複製する（毎回作るより速い）
let template: Promise<PGlite> | undefined;
const getTemplate = () => {
  template ??= (async () => {
    const pg = new PGlite();
    await migrate(drizzle(pg, { schema }), { migrationsFolder: MIGRATIONS_DIR });
    return pg;
  })();
  return template;
};

/** テスト用: マイグレーション済みの空の DB を返す（テストごとに独立） */
export async function createTestDb(): Promise<Db> {
  return drizzle((await (await getTemplate()).clone()) as PGlite, { schema });
}
