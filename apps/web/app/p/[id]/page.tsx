import { notFound } from "next/navigation";
import { api } from "../../../lib/api";
import { addComment } from "../../actions";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await api.posts[":id"].$get({ param: { id } });
  if (res.status !== 200) notFound();
  const post = await res.json();
  if (!("comments" in post)) notFound();
  return (
    <>
      <h1>{post.title}</h1>
      <p>
        票: {post.voteCount} / ステータス: {post.status}
      </p>
      <p>{post.body}</p>
      <h2>コメント</h2>
      <ul aria-label="コメント">
        {post.comments.map((c) => (
          <li key={c.id}>
            <b>{c.author}</b>: {c.body}
          </li>
        ))}
      </ul>
      <form action={addComment.bind(null, post.id)}>
        <input name="author" placeholder="名前" required />
        <input name="body" placeholder="コメント" required />
        <button type="submit">送信</button>
      </form>
    </>
  );
}
