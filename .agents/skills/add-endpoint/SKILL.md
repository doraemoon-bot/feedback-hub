---
name: add-endpoint
description: API にエンドポイントを足し、画面から使えるようにするまでの手順。新しい API や、既存 API への項目追加を頼まれたときに使う。
---

# add-endpoint

順番どおりに進める（型が上から下へ伝わるので、途中で型チェックが道案内になる）。

1. `packages/shared/src/index.ts` に入力・出力の zod スキーマと型を足す
2. `apps/api/test/` に、期待する応答を書いたテストを足す（落ちることを確かめる）
3. `apps/api/src/repositories/` に DB アクセスを足す
4. `apps/api/src/services/` に業務ルールを足す（見つからない → `NotFoundError` など）
5. `apps/api/src/routes/` に追加し、`zValidator` で入力を検証する
6. 画面で使うなら `apps/web` から `api.<パス>.$get()` などで呼ぶ（`AppType` から型が付く）
7. README の API 表を更新する（実装とずれないように）
8. `pnpm check`。画面を変えたなら `pnpm e2e` も
