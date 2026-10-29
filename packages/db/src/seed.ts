import { createDb } from "./client";
import { boards, comments, posts, votes } from "./schema";

const db = await createDb();
const existing = await db.select().from(boards);
if (existing.length > 0) {
  console.log("すでにデータがあるので何もしません");
  process.exit(0);
}
const [board] = await db
  .insert(boards)
  .values({ slug: "product", name: "プロダクトへの要望" })
  .returning();
if (!board) throw new Error("board not created");
const rows = await db
  .insert(posts)
  .values([
    { boardId: board.id, title: "ダークモードがほしい", body: "夜に使うとまぶしい", voteCount: 2 },
    {
      boardId: board.id,
      title: "CSV でエクスポートしたい",
      body: "集計を表計算でしたい",
      voteCount: 1,
      status: "planned",
    },
    { boardId: board.id, title: "Slack に通知してほしい", body: "", status: "in_progress" },
  ])
  .returning();
await db.insert(votes).values([
  { postId: rows[0]?.id ?? 0, voterId: "alice" },
  { postId: rows[0]?.id ?? 0, voterId: "bob" },
  { postId: rows[1]?.id ?? 0, voterId: "alice" },
]);
await db.insert(comments).values({ postId: rows[0]?.id ?? 0, author: "carol", body: "同じく！" });
console.log("サンプルデータを入れました");
process.exit(0);
