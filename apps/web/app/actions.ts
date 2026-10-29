"use server";

import { revalidatePath } from "next/cache";
import { api } from "../lib/api";
import { voterId } from "../lib/voter";

export async function vote(postId: number, slug: string) {
  await api.posts[":id"].votes.$post({
    param: { id: String(postId) },
    header: { "x-voter-id": await voterId() },
  });
  revalidatePath(`/b/${slug}`);
}

export async function createPost(slug: string, form: FormData) {
  await api.boards[":slug"].posts.$post({
    param: { slug },
    json: { title: String(form.get("title") ?? ""), body: String(form.get("body") ?? "") },
  });
  revalidatePath(`/b/${slug}`);
}

export async function addComment(postId: number, form: FormData) {
  await api.posts[":id"].comments.$post({
    param: { id: String(postId) },
    json: { author: String(form.get("author") ?? ""), body: String(form.get("body") ?? "") },
  });
  revalidatePath(`/p/${postId}`);
}
