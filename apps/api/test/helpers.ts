import { createTestDb } from "@feedback-hub/db/testing";
import { createApp } from "../src/app";

export const ADMIN = "test-admin";

/** テストごとに空の DB とアプリを作る。json() はリクエストを送って本文とステータスを返す */
export async function setup() {
  const app = createApp({ db: await createTestDb(), adminToken: ADMIN });
  const json = async (
    method: string,
    path: string,
    body?: unknown,
    headers: Record<string, string> = {},
  ) => {
    const res = await app.request(path, {
      method,
      headers: { "content-type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    // テストでは本文の形を毎回書かずに読みたいので any にしている
    // biome-ignore lint/suspicious/noExplicitAny: テスト用のゆるい型
    return { status: res.status, body: (await res.json()) as any };
  };
  const board = (slug = "product") => json("POST", "/boards", { slug, name: "要望" });
  const post = (title: string, slug = "product") =>
    json("POST", `/boards/${slug}/posts`, { title });
  return { app, json, board, post };
}
