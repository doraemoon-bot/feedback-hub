# apps/api の決まり

- 3層を守る: `routes`（HTTP: 検証・ステータスコード）→ `services`（業務ルール）→ `repositories`（DB アクセス）
  - routes から repositories や DB を直接呼ばない。services は HTTP を知らない（`c` や `Response` を受け取らない）
- 入力の検証は `@feedback-hub/shared` の zod スキーマを `zValidator` で使う。スキーマを routes に直接書かない
- エラーは `src/errors.ts` の例外を services で投げる。HTTP ステータスへの変換は `app.ts` の `onError` だけが行う
- `posts.vote_count` は votes と**必ず同時に**更新する（非正規化している。ADR 0003）
- テストは `test/` に、`setup()`（`test/helpers.ts`）でアプリと空の DB を作って書く。DB をモックしない

## Code Review Rules

- `posts.vote_count` を変える処理は、votes の追加・削除が**実際に起きたときだけ**数を動かしているかを確かめる（数と実際の票がずれるバグを防ぐ）
- routes に業務ルール（if 文での判定など）が入っていたら、services へ移すよう指摘する
- 管理操作（ステータス変更など）に権限チェックがあるかを確かめる
