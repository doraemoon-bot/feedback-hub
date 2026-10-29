import { notFound } from "next/navigation";
import { api } from "../../../lib/api";
import { createPost, vote } from "../../actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ sort?: string }> };

export default async function BoardPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sort = (await searchParams).sort === "new" ? "new" : "top";
  const res = await api.boards[":slug"].posts.$get({ param: { slug }, query: { sort } });
  if (res.status === 404) notFound();
  const posts = await res.json();
  if (!Array.isArray(posts)) notFound();
  return (
    <>
      <h1>{slug}</h1>
      <nav>
        並び順: <a href={`/b/${slug}?sort=top`}>人気</a> / <a href={`/b/${slug}?sort=new`}>新着</a>
      </nav>
      <ul aria-label="投稿">
        {posts.map((p) => (
          <li key={p.id}>
            <form action={vote.bind(null, p.id, slug)} style={{ display: "inline" }}>
              <button type="submit" aria-label={`${p.title} に投票`}>
                ▲ {p.voteCount}
              </button>
            </form>{" "}
            <a href={`/p/${p.id}`}>{p.title}</a> <small>[{p.status}]</small>
          </li>
        ))}
      </ul>
      <h2>要望を書く</h2>
      <form action={createPost.bind(null, slug)}>
        <input name="title" placeholder="タイトル" required minLength={3} />
        <textarea name="body" placeholder="詳しく（任意）" />
        <button type="submit">投稿</button>
      </form>
    </>
  );
}
