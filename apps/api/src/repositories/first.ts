/** insert ... returning() などで「必ず1行返る」結果から、その1行を取り出す */
export function first<T>(rows: T[]): T {
  const row = rows[0];
  if (row === undefined) throw new Error("expected one row");
  return row;
}
