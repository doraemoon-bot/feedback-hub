# Routine: 毎朝の仕分け（常時稼働型・任せるレベル「報告のみ」）

Claude Code の Routines（Anthropic のクラウドで、決まった時刻に Claude Code を動かす機能）で、毎朝 Issue を仕分ける。
手元の PC が閉じていても動く。サブスクリプション（Max）の利用枠を使う。

## 設定のしかた（人が1回だけ）

1. 手元の Claude Code で `/web-setup` を済ませ、このリポジトリをクラウドから clone できるようにする
2. このリポジトリで Claude Code を起動し、`/schedule` で次の内容の Routine を作る（claude.ai/code/routines からでも作れる）
   - 名前: feedback-hub 毎朝の仕分け
   - 頻度: 平日の毎朝 9:00
   - リポジトリ: doraemoon-bot/feedback-hub
   - プロンプト: 下の「プロンプト」をそのまま
3. 作ったら一度手で実行して、Issue に推奨のコメントと risk ラベルが付くことを確かめる

## プロンプト

```
Skill triage の手順で、triage ラベルの付いた Issue を仕分けて。
- 判定は docs/loops/triage-rules.md に従う。迷ったら needs-human
- agent:ready / agent:report-only は推奨としてコメントに書くだけで、ラベルは付けない（人が付ける）
- コードは変えない。ブランチも PR も作らない
- 最後に、仕分けた件数・判定ごとの Issue 番号・人が今日見るべきものを報告する
```

## 上限と止め方

- 1回に扱うのは最大10件（Skill に書いてある）。Routine の実行回数はプランの1日の上限に従う
- 止める: claude.ai/code/routines で一時停止か削除
