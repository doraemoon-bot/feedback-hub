import type { Db } from "@feedback-hub/db";
import { createCommentSchema, updateStatusSchema } from "@feedback-hub/shared";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { ForbiddenError } from "../errors";
import { postService } from "../services/posts";
import { voteService } from "../services/votes";

const idParam = zValidator("param", z.object({ id: z.coerce.number().int().positive() }));
const voterHeader = zValidator("header", z.object({ "x-voter-id": z.string().min(1).max(64) }));

export const postRoutes = (db: Db, adminToken: string) =>
  new Hono()
    .get("/:id", idParam, async (c) =>
      c.json(await postService(db).detail(c.req.valid("param").id)),
    )
    .post("/:id/votes", idParam, voterHeader, async (c) =>
      c.json(
        await voteService(db).vote(c.req.valid("param").id, c.req.valid("header")["x-voter-id"]),
      ),
    )
    .delete("/:id/votes", idParam, voterHeader, async (c) =>
      c.json(
        await voteService(db).unvote(c.req.valid("param").id, c.req.valid("header")["x-voter-id"]),
      ),
    )
    .patch("/:id/status", idParam, zValidator("json", updateStatusSchema), async (c) => {
      if (c.req.header("authorization") !== `Bearer ${adminToken}`)
        throw new ForbiddenError("admin only");
      return c.json(
        await postService(db).updateStatus(c.req.valid("param").id, c.req.valid("json").status),
      );
    })
    .post("/:id/comments", idParam, zValidator("json", createCommentSchema), async (c) =>
      c.json(await postService(db).addComment(c.req.valid("param").id, c.req.valid("json")), 201),
    );
