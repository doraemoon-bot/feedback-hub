# ループの一覧と台帳

このリポジトリで動いているループと、それぞれの約束ごと。**ループを足すときは、この台帳に1行足す PR を出す**（責任者・上限・止め方が決まっていないループは動かさない）。

## 4つのタイプと、このリポジトリでの実装

| タイプ | きっかけ | 止まる条件 | このリポジトリでの実装 |
|---|---|---|---|
| 対話型 | 人のプロンプト | AI が完了 or 追加の情報が必要と判断 | ふだんの Claude Code / Codex のセッション。GitHub では `@claude` メンション（`.github/workflows/claude.yml`） |
| 目標達成型 | 人のプロンプト | 完了条件を満たす or 上限 | `/goal`（[ひな形](goal-templates.md)）＋ 止まる前の検証 Hook |
| 時間起動型 | 一定の間隔 | 人が止める or 作業が終わる | `/loop 10m /babysit-pr <番号>` |
| 常時稼働型 | 予定・イベント | 各タスクは完了で終わり、仕組みは動き続ける | 毎朝の仕分け（Routine）→ ラベルで実装（GitHub Actions）→ Codex の自動レビュー → 人がマージ |

## 常時稼働型の流れ

```
Issue（triage） ─毎朝の Routine─▶ 推奨をコメント（＋ risk ラベル）／ needs-human
                                      │
                    人が推奨を見て agent:ready / agent:report-only を付ける
                                      │
              ラベルが付いたら GitHub Actions（agent-implement）
                                      ▼
                     Claude Code が work-issue の手順で PR（または報告）
                                      ▼
            CI（check・e2e・secrets）＋ Codex の自動レビュー ＋（必要なら）@claude
                                      ▼
                         人がマージ（agent:auto-merge で低リスクだけ自動）
```

## 任せるレベル

| レベル | ラベル | エージェントがすること | 人がすること |
|---|---|---|---|
| 1. 報告のみ | `agent:report-only` | 調べて Issue に報告 | 直す |
| 2. 検証付きの修正案 | `agent:ready` | テストを通した PR と証拠 | レビューしてマージ |
| 3. 自動反映 | `agent:ready` ＋ `agent:auto-merge`（`risk:low` だけ） | PR。検証を通れば自動でマージ | 例外のときだけ対応 |

レベル 3 は、リポジトリ変数 `AUTO_MERGE_ENABLED` を `true` にしたときだけ動く（既定は止まっている）。

## 台帳

| ループ | タイプ | 責任者 | 任せるレベル | 上限 | 完了の証拠 | 止まる条件 | 止まった理由の記録先 | 戻し方 | 実行履歴 |
|---|---|---|---|---|---|---|---|---|---|
| 毎朝の仕分け | 常時稼働（Routine） | @doraemoon-bot | 1 | 1回10件、1日の実行回数はプランの上限 | Issue の推奨コメントと risk・needs-human ラベル | 10件扱った / 仕分け待ちがない | Routine の実行記録 | ラベルとコメントを手で戻す | claude.ai/code/routines |
| Issue の実装 | 常時稼働（Actions） | @doraemoon-bot | 2（3は低リスクのみ） | 1件30分・40ターン、同じ Issue は同時に1本 | PR の本文（証拠）・CI | PR を出した / needs-human / 上限 | Issue の作業記録コメント、Actions の実行記録 | PR を閉じる・ブランチを消す（マージ前は main に影響なし） | Actions の `agent-implement` |
| 自動マージ | 常時稼働（Actions） | @doraemoon-bot | 3 | `risk:low` かつ docs・md だけの変更 | 必須チェックの通過 | 条件に合わない PR は何もしない | Actions の実行記録 | `git revert` で取り消す PR | Actions の `agent-auto-merge` |
| PR の見張り | 時間起動（/loop） | 起動した人 | 2 | 10分ごと、最大7日 | CI が通り、未対応の指摘がない | 上の状態 / 同じ失敗を2回直せない | PR のコメント | push した修正を revert | セッションの履歴 |
| Issue を1件片付ける | 目標達成（/goal） | 起動した人 | 2 | 30ターン、Stop の Hook は最大3回 | pnpm check・VERDICT・PR の URL | 条件を満たす / needs-human / 上限 | Issue の作業記録コメント | PR を閉じる | セッションの履歴 |

## 止まった理由の書き方

ループが止まったら、理由を必ず記録に残す（後で LEARNINGS.md の材料になる）: `完了` / `上限（ターン・時間）` / `人の判断が必要` / `失敗が続いた` / `人が止めた`。
