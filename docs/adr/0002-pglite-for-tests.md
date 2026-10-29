# 0002. テストと手元の開発は PGlite、本番は Postgres

- 状態: 採用
- 日付: 2026-10-29

## 背景
テストのたびに Postgres を立てると、遅く、CI や AI エージェントの作業環境での準備も重い。SQLite で代用すると方言の違いでバグを見逃す。

## 決定
- テストは PGlite（WebAssembly で動く Postgres）をメモリ上で使い、テストごとに独立した DB にする
- `DATABASE_URL` がなければ手元でも PGlite（ファイル保存）を使う。Postgres は `docker compose` で必要なときだけ
- 本番は Postgres

## 結果
- 準備なしで `pnpm test` が通る。AI エージェントも同じ手順で確かめられる
- PGlite の初期化は1秒前後かかるので、マイグレーション済みのひな形を複製して使う（`packages/db/src/testing.ts`）
