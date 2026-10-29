---
name: self-review
description: PR を出す前に、作った本人とは別の担当（reviewer・test-auditor サブエージェント）に確かめさせる。実装が終わって PR を作る直前に使う。
---

# self-review

作った本人の「できた」は自己申告。PR の前に、別の担当に確かめさせる。

1. `pnpm check` が通っていることを確かめる（通っていなければ先に直す）
2. **reviewer** サブエージェントに差分のレビューを頼む（Codex では `reviewer` エージェント）
3. テストを足した・変えたなら、**test-auditor** にも頼む（Codex では `test_auditor`）
4. `VERDICT: NG` の指摘は直す。直さないと判断したものは、理由を PR の「見てほしい点」に書く
5. 2〜4 は最大2回まで。それでも NG が残るなら、PR を出さずに人に相談する
