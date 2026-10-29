import { api } from "../lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const boards = await (await api.boards.$get()).json();
  return (
    <>
      <h1>ボード</h1>
      <ul>
        {boards.map((b) => (
          <li key={b.id}>
            <a href={`/b/${b.slug}`}>{b.name}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
