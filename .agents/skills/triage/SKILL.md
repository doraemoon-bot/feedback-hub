---
name: triage
description: triage ラベルの付いた Issue を、仕分け基準に沿って agent:ready / agent:report-only / needs-human に振り分けて報告する。毎朝の Routine や、手で仕分けるときに使う。
---

# triage

1. `gh issue list --label triage --state open --json number,title,body,labels` で仕分け待ちを取る
2. 1件ずつ `docs/loops/triage-rules.md` で判定する（判定に迷ったら `needs-human`）
3. Issue に仕分けのコメントを書き、ラベルを付け替える（`triage` を外し、判定とリスクのラベルを付ける）
   - `needs-human` なら、足りない情報を質問として書く
4. 最後に一覧で報告する: 件数、判定ごとの Issue、人が今日見るべきもの
5. 1回に扱うのは最大10件。コードは変えない
