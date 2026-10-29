# feedback-hub

顧客からの要望を集めて、投票と優先順位付けをする小さな SaaS。

> これは [ai-dev-tutorial](https://github.com/doraemoon-bot) の題材リポジトリ。AI エージェント（Claude Code / Codex）のハーネスとループを組み込み済みで、段階タグ（`stage-0`〜）でその組み立てを追体験できる。

AI エージェント（Claude Code / Codex）と一緒に開発するための仕組み（ハーネス・ループ・CI/CD）の全体像は [docs/harness.md](docs/harness.md)。

## 構成

```
apps/
  api/        Hono の API（routes → services → repositories の3層）
  web/        Next.js（App Router）の画面。API は hono/client の型付きクライアントで呼ぶ
packages/
  db/         Drizzle ORM のスキーマとマイグレーション。Postgres か PGlite につなぐ
  shared/     API と画面で共有する zod スキーマと型
e2e/          Playwright の E2E テスト
```

## 始め方

Node.js 22.12 以上と pnpm が必要。

```bash
pnpm install
cp .env.example .env
pnpm db:seed
pnpm dev
```

- 画面: http://localhost:3000 / API: http://localhost:8787
- DB は、`DATABASE_URL` がなければ PGlite（`.data/` にファイル保存）を使う。Postgres を使うなら `docker compose up -d` して `.env` の `DATABASE_URL` を有効にする

## 確かめる

| コマンド | 内容 |
|---|---|
| `pnpm check` | lint（Biome）・型チェック・テストをまとめて |
| `pnpm test` | API のテスト（Vitest。DB はテストごとにメモリ上の PGlite） |
| `pnpm e2e` | 画面の E2E（Playwright。専用ポートと使い捨ての DB で起動する） |
| `pnpm db:generate` | スキーマの変更からマイグレーションを作る |

## API

| メソッド | パス | 内容 |
|---|---|---|
| GET | `/boards` | ボード一覧 |
| POST | `/boards` | ボードを作る |
| GET | `/boards/:slug` | ボードの詳細（投稿数つき） |
| GET | `/boards/:slug/posts?sort=top\|new&status=` | 投稿一覧 |
| POST | `/boards/:slug/posts` | 投稿する |
| GET | `/posts/:id` | 投稿の詳細（コメント付き） |
| POST / DELETE | `/posts/:id/votes` | 投票する / 取り消す（ヘッダ `x-voter-id`） |
| PATCH | `/posts/:id/status` | ステータスを変える（ヘッダ `authorization: Bearer <ADMIN_TOKEN>`） |
| POST | `/posts/:id/comments` | コメントする |
