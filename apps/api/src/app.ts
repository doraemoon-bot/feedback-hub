import type { Db } from "@feedback-hub/db";
import { Hono } from "hono";
import { ConflictError, ForbiddenError, NotFoundError } from "./errors";
import { boardRoutes } from "./routes/boards";
import { postRoutes } from "./routes/posts";

export type AppDeps = { db: Db; adminToken: string };

export const createApp = ({ db, adminToken }: AppDeps) =>
  new Hono()
    .onError((err, c) => {
      if (err instanceof NotFoundError) return c.json({ error: err.message }, 404);
      if (err instanceof ConflictError) return c.json({ error: err.message }, 409);
      if (err instanceof ForbiddenError) return c.json({ error: err.message }, 403);
      console.error(err);
      return c.json({ error: "internal error" }, 500);
    })
    .get("/health", (c) => c.json({ ok: true }))
    .route("/boards", boardRoutes(db))
    .route("/posts", postRoutes(db, adminToken));

/** web から型付きクライアント（hono/client）で使う */
export type AppType = ReturnType<typeof createApp>;
