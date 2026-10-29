import type { Db } from "@feedback-hub/db";
import { postRepository } from "../repositories/posts";
import { voteRepository } from "../repositories/votes";
import { postService } from "./posts";

/** 投票。1人1投稿1票。posts.vote_count を votes と同時に更新する */
export const voteService = (db: Db) => {
  const votes = voteRepository(db);
  const posts = postRepository(db);
  const postsService = postService(db);
  return {
    vote: async (postId: number, voterId: string) => {
      await postsService.get(postId);
      const added = await votes.add(postId, voterId);
      if (added) await posts.addToVoteCount(postId, 1);
      return postsService.get(postId);
    },
    unvote: async (postId: number, voterId: string) => {
      await postsService.get(postId);
      await votes.remove(postId, voterId);
      await posts.addToVoteCount(postId, -1);
      return postsService.get(postId);
    },
  };
};
