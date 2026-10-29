# 0003. API は routes / services / repositories の3層、投票数は非正規化

- 状態: 採用
- 日付: 2026-10-29

## 決定
- routes は HTTP だけ、services は業務ルールだけ、repositories は DB アクセスだけを持つ
- 一覧を人気順に並べるため、`posts.vote_count` に投票数を持つ（毎回 votes を数えない）

## 結果
- 業務ルールのテストを HTTP 越しに書いても、どこを直せばよいかが層で分かる
- `vote_count` と votes の件数がずれる危険がある。**両方を同じ処理で更新する**ことを決まりにし、テストで確かめる
