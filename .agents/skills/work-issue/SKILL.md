---
name: work-issue
description: GitHub の Issue を1件、完了条件を満たす PR にするまでの手順。Issue 番号を渡されて「実装して」「直して」と頼まれたとき、/goal や GitHub Actions のループから使う。
---

# work-issue

1. `gh issue view <番号> --comments` で Issue とこれまでのコメント（前回の作業記録・人の回答）を読む
2. 任せてよいか確かめる（`docs/loops/triage-rules.md`）
   - 完了条件がない・あいまい、DB スキーマ変更が必要、範囲が広い → **実装せずに止まる**（下の「止まり方」）
   - ラベルが `agent:report-only` なら、調べて報告するだけ（手順 3〜6 はしない）
3. ブランチを切る: `git switch -c agent/issue-<番号>`
4. 完了条件を1つずつテストにしてから実装する（バグなら Skill `tdd-fix`、API の追加なら `add-endpoint`）
5. `pnpm check` を通し、Skill `self-review` で別の担当に確かめさせる
6. コミットして push し、`gh pr create` で PR を出す。本文は Skill `pr-evidence` の形で、`Closes #<番号>` を入れる
7. Issue に作業記録をコメントする（形は `docs/loops/state.md`）

## 止まり方

迷ったら勝手に決めない。Issue に「人への質問」の形でコメントし、`needs-human` ラベルを付けて終える:

`gh issue comment <番号> --body-file <ファイル>` → `gh issue edit <番号> --add-label needs-human --remove-label agent:ready`

## やらないこと

- main への push、マージ、依存の追加、既存テストの削除・書き換え（Hook でも止まる）
- 完了条件にないついでの改善
