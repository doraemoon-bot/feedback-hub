import type { Db } from "@feedback-hub/db";
import { createBoardSchema, createPostSchema, listPostsQuerySchema } from "@feedback-hub/shared";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { boardService } from "../services/boards";
import { postService } from "../services/posts";

export const boardRoutes = (db: Db) =>
  new Hono()
    .get("/", async (c) => c.json(await boardService(db).list()))
    .post("/", zValidator("json", createBoardSchema), async (c) =>
      c.json(await boardService(db).create(c.req.valid("json")), 201),
    )
    .get("/:slug/posts", zValidator("query", listPostsQuerySchema), async (c) =>
      c.json(await postService(db).listByBoard(c.req.param("slug"), c.req.valid("query"))),
    )
    .post("/:slug/posts", zValidator("json", createPostSchema), async (c) =>
      c.json(await postService(db).create(c.req.param("slug"), c.req.valid("json")), 201),
    );
