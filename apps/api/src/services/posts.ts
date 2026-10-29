import type { Db } from "@feedback-hub/db";
import type {
  CreateCommentInput,
  CreatePostInput,
  ListPostsQuery,
  PostStatus,
} from "@feedback-hub/shared";
import { NotFoundError } from "../errors";
import { postRepository } from "../repositories/posts";
import { boardService } from "./boards";

export const postService = (db: Db) => {
  const repo = postRepository(db);
  const boards = boardService(db);
  const get = async (id: number) => {
    const post = await repo.find(id);
    if (!post) throw new NotFoundError(`post ${id} not found`);
    return post;
  };
  return {
    get,
    listByBoard: async (slug: string, q: ListPostsQuery) =>
      repo.listByBoard((await boards.get(slug)).id, q),
    create: async (slug: string, input: CreatePostInput) =>
      repo.create((await boards.get(slug)).id, input),
    detail: async (id: number) => ({ ...(await get(id)), comments: await repo.listComments(id) }),
    updateStatus: async (id: number, status: PostStatus) => {
      const post = await repo.updateStatus(id, status);
      if (!post) throw new NotFoundError(`post ${id} not found`);
      return post;
    },
    addComment: async (id: number, input: CreateCommentInput) => {
      await get(id);
      return repo.addComment(id, input.author, input.body);
    },
  };
};
