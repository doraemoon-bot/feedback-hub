import { z } from "zod";

/** 投稿のステータス。順番は「進み具合」の順 */
export const POST_STATUSES = ["open", "planned", "in_progress", "done", "declined"] as const;
export const postStatusSchema = z.enum(POST_STATUSES);
export type PostStatus = z.infer<typeof postStatusSchema>;

export const boardSlugSchema = z
  .string()
  .min(2)
  .max(40)
  .regex(/^[a-z0-9-]+$/, "英小文字・数字・ハイフンのみ");

export const createBoardSchema = z.object({
  slug: boardSlugSchema,
  name: z.string().min(1).max(80),
});
export type CreateBoardInput = z.infer<typeof createBoardSchema>;

export const createPostSchema = z.object({
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().max(5000).default(""),
});
export type CreatePostInput = z.infer<typeof createPostSchema>;

export const listPostsQuerySchema = z.object({
  sort: z.enum(["top", "new"]).default("top"),
  status: postStatusSchema.optional(),
});
export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;

export const updateStatusSchema = z.object({ status: postStatusSchema });

export const createCommentSchema = z.object({
  author: z.string().trim().min(1).max(40),
  body: z.string().trim().min(1).max(2000),
});
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export type Board = { id: number; slug: string; name: string; createdAt: string };
export type Post = {
  id: number;
  boardId: number;
  title: string;
  body: string;
  status: PostStatus;
  voteCount: number;
  createdAt: string;
};
export type Comment = {
  id: number;
  postId: number;
  author: string;
  body: string;
  createdAt: string;
};
export type PostDetail = Post & { comments: Comment[] };
