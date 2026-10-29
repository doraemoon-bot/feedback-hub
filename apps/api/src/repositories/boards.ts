import { type Db, schema } from "@feedback-hub/db";
import type { CreateBoardInput } from "@feedback-hub/shared";
import { asc, eq } from "drizzle-orm";
import { first } from "./first";

export const boardRepository = (db: Db) => ({
  list: () => db.select().from(schema.boards).orderBy(asc(schema.boards.id)),
  findBySlug: async (slug: string) =>
    (await db.select().from(schema.boards).where(eq(schema.boards.slug, slug)))[0],
  create: async (input: CreateBoardInput) =>
    first(await db.insert(schema.boards).values(input).returning()),
});
