import { type Db, schema } from "@feedback-hub/db";
import { and, eq } from "drizzle-orm";

const { votes } = schema;

export const voteRepository = (db: Db) => ({
  /** 追加できたら true（すでに投票済みなら false） */
  add: async (postId: number, voterId: string) =>
    (await db.insert(votes).values({ postId, voterId }).onConflictDoNothing().returning()).length >
    0,
  /** 消した件数を返す */
  remove: async (postId: number, voterId: string) =>
    (
      await db
        .delete(votes)
        .where(and(eq(votes.postId, postId), eq(votes.voterId, voterId)))
        .returning()
    ).length,
});
