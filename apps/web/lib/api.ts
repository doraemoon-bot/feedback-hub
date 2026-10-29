import type { AppType } from "@feedback-hub/api/app";
import { hc } from "hono/client";

/** API への型付きクライアント。API の型が変わると、ここを使う画面の型チェックが落ちる */
export const api = hc<AppType>(process.env.API_URL ?? "http://localhost:8787", {
  init: { cache: "no-store" },
});
