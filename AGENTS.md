# AGENTS.md

feedback-hub（要望の投稿・投票 SaaS）のリポジトリ。人とコーディングエージェント（Claude Code / Codex）の両方が読む、チーム共通のルール。
ここには**毎回必要なことだけ**を書く。詳しい手順は Skills（`.agents/skills/`）、設計の理由は `docs/adr/`、各アプリの決まりは各ディレクトリの `AGENTS.md` にある。

## 構成

- `apps/api` — Hono の API。routes → services → repositories の3層（`apps/api/AGENTS.md`）
- `apps/web` — Next.js の画面。API は `hono/client` の型付きクライアントで呼ぶ（`apps/web/AGENTS.md`）
- `packages/db` — Drizzle のスキーマとマイグレーション（`packages/db/AGENTS.md`）
- `packages/shared` — API と画面で共有する zod スキーマと型。入力の形はここで1回だけ定義する

## コマンド

- 全部まとめて確かめる: `pnpm check`（lint・型チェック・テスト）
- テストだけ: `pnpm test` ／ E2E: `pnpm e2e`（遅いので画面を変えたときだけ）
- 整形: `pnpm format`
- 依存パッケージの追加（`pnpm add`）は**人が行う**。必要なら理由を書いて人に頼む

## 進め方

- 変更は **テストから**。バグはまず再現するテストを書いて落ちるのを確かめてから直す（Skill: `tdd-fix`）
- 既存のテストを消す・弱める・`skip` にするのは禁止。仕様が変わってテストを直すときは、PR に理由を書く
- 1つの変更は1つの目的に絞る。ついでの整形やリファクタリングを混ぜない
- 迷ったら勝手に決めない。仕様の矛盾・仕様にない判断・影響が広い変更は、選択肢と推奨を添えて人に聞く

## 完了の定義（証拠を出す）

「できました」は証拠とセットで報告する。

- `pnpm check` が通った出力（最後の数行）
- 足した・直したテストの名前
- 変えなかったこと（触っていないが関係しそうな場所）と、人に見てほしい点

## 人の承認が必要な操作

main へのマージ、本番に関わる設定、依存の追加、DB スキーマの変更、ファイルやブランチの削除、外部への送信（Issue・PR へのコメント以外）。
