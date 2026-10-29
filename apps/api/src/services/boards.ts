import type { Db } from "@feedback-hub/db";
import type { CreateBoardInput } from "@feedback-hub/shared";
import { ConflictError, NotFoundError } from "../errors";
import { boardRepository } from "../repositories/boards";

export const boardService = (db: Db) => {
  const repo = boardRepository(db);
  return {
    list: () => repo.list(),
    get: async (slug: string) => {
      const board = await repo.findBySlug(slug);
      if (!board) throw new NotFoundError(`board ${slug} not found`);
      return board;
    },
    create: async (input: CreateBoardInput) => {
      if (await repo.findBySlug(input.slug)) throw new ConflictError(`board ${input.slug} exists`);
      return repo.create(input);
    },
  };
};
