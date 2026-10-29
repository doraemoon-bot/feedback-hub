import { cookies } from "next/headers";

const COOKIE = "voter_id";

/** 投票者 ID（ログインの代わり）。なければ作って cookie に入れる */
export async function voterId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE)?.value;
  if (existing) return existing;
  const id = crypto.randomUUID();
  store.set(COOKIE, id, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
  return id;
}
