import { sql } from "drizzle-orm";
import { integer, pgEnum, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";

export const postStatus = pgEnum("post_status", [
  "open",
  "planned",
  "in_progress",
  "done",
  "declined",
]);

export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  boardId: integer("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  status: postStatus("status").notNull().default("open"),
  // 投票数は votes から数え直さずに済むよう、非正規化して持つ（votes と必ず同時に更新する）
  voteCount: integer("vote_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    voterId: text("voter_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("votes_post_voter").on(t.postId, t.voterId)],
);

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  author: text("author").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});
