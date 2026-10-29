import { describe, expect, it } from "vitest";
import { setup } from "./helpers";

describe("votes", () => {
  it("同じ人が2回投票しても1票", async () => {
    const { json, board, post } = await setup();
    await board();
    const p = await post("投稿A");
    await json("POST", `/posts/${p.body.id}/votes`, undefined, { "x-voter-id": "u1" });
    const res = await json("POST", `/posts/${p.body.id}/votes`, undefined, { "x-voter-id": "u1" });
    expect(res.body.voteCount).toBe(1);
  });

  it("投票を取り消すと票が減る", async () => {
    const { json, board, post } = await setup();
    await board();
    const p = await post("投稿A");
    await json("POST", `/posts/${p.body.id}/votes`, undefined, { "x-voter-id": "u1" });
    const res = await json("DELETE", `/posts/${p.body.id}/votes`, undefined, {
      "x-voter-id": "u1",
    });
    expect(res.body.voteCount).toBe(0);
  });

  it("投票者の指定がなければ 400", async () => {
    const { json, board, post } = await setup();
    await board();
    const p = await post("投稿A");
    expect((await json("POST", `/posts/${p.body.id}/votes`)).status).toBe(400);
  });
});
