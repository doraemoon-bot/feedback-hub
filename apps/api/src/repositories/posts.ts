import { type Db, schema } from "@feedback-hub/db";
import type { CreatePostInput, ListPostsQuery, PostStatus } from "@feedback-hub/shared";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { first } from "./first";

const { posts, comments } = schema;

export const postRepository = (db: Db) => ({
  listByBoard: (boardId: number, q: ListPostsQuery) =>
    db
      .select()
      .from(posts)
      .where(and(eq(posts.boardId, boardId), q.status ? eq(posts.status, q.status) : undefined))
      .orderBy(...(q.sort === "top" ? [desc(posts.voteCount), desc(posts.id)] : [desc(posts.id)])),
  find: async (id: number) => (await db.select().from(posts).where(eq(posts.id, id)))[0],
  create: async (boardId: number, input: CreatePostInput) =>
    first(
      await db
        .insert(posts)
        .values({ boardId, ...input })
        .returning(),
    ),
  updateStatus: async (id: number, status: PostStatus) =>
    (await db.update(posts).set({ status }).where(eq(posts.id, id)).returning())[0],
  addToVoteCount: (id: number, delta: number) =>
    db
      .update(posts)
      .set({ voteCount: sql`${posts.voteCount} + ${delta}` })
      .where(eq(posts.id, id)),
  listComments: (postId: number) =>
    db.select().from(comments).where(eq(comments.postId, postId)).orderBy(asc(comments.id)),
  addComment: async (postId: number, author: string, body: string) =>
    first(await db.insert(comments).values({ postId, author, body }).returning()),
});
