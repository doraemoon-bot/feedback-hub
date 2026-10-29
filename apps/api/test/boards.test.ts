import { describe, expect, it } from "vitest";
import { setup } from "./helpers";

describe("boards", () => {
  it("ボードを作って一覧に出る", async () => {
    const { json, board } = await setup();
    expect((await board()).status).toBe(201);
    const res = await json("GET", "/boards");
    expect(res.body.map((b: { slug: string }) => b.slug)).toEqual(["product"]);
  });

  it("同じ slug のボードは作れない", async () => {
    const { board } = await setup();
    await board();
    expect((await board()).status).toBe(409);
  });

  it("slug の形式が違えば 400", async () => {
    const { json } = await setup();
    expect((await json("POST", "/boards", { slug: "Bad Slug", name: "x" })).status).toBe(400);
  });
});
