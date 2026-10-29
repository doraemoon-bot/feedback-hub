import { describe, expect, it } from "vitest";
import { ADMIN, setup } from "./helpers";

describe("posts", () => {
  it("投稿を作り、詳細でコメントと一緒に取れる", async () => {
    const { json, board, post } = await setup();
    await board();
    const created = await post("ダークモード");
    expect(created.status).toBe(201);
    await json("POST", `/posts/${created.body.id}/comments`, { author: "a", body: "ほしい" });
    const detail = await json("GET", `/posts/${created.body.id}`);
    expect(detail.body.title).toBe("ダークモード");
    expect(detail.body.comments).toHaveLength(1);
  });

  it("存在しないボードへの投稿は 404", async () => {
    const { post } = await setup();
    expect((await post("タイトル", "nope")).status).toBe(404);
  });

  it("新しい順と人気順で並ぶ", async () => {
    const { json, board, post } = await setup();
    await board();
    const a = await post("投稿A");
    await post("投稿B");
    await json("POST", `/posts/${a.body.id}/votes`, undefined, { "x-voter-id": "u1" });
    const top = await json("GET", "/boards/product/posts?sort=top");
    const latest = await json("GET", "/boards/product/posts?sort=new");
    expect(top.body.map((p: { title: string }) => p.title)).toEqual(["投稿A", "投稿B"]);
    expect(latest.body.map((p: { title: string }) => p.title)).toEqual(["投稿B", "投稿A"]);
  });

  it("ステータスで絞り込める", async () => {
    const { json, board, post } = await setup();
    await board();
    const a = await post("投稿A");
    await post("投稿B");
    await json(
      "PATCH",
      `/posts/${a.body.id}/status`,
      { status: "planned" },
      { authorization: `Bearer ${ADMIN}` },
    );
    const res = await json("GET", "/boards/product/posts?status=planned");
    expect(res.body.map((p: { title: string }) => p.title)).toEqual(["投稿A"]);
  });

  it("ステータス変更は管理トークンが必要", async () => {
    const { json, board, post } = await setup();
    await board();
    const a = await post("投稿A");
    const res = await json("PATCH", `/posts/${a.body.id}/status`, { status: "done" });
    expect(res.status).toBe(403);
  });
});
