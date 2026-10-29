# apps/web の決まり

- API は `lib/api.ts` の型付きクライアント（`hono/client`）だけで呼ぶ。`fetch` で URL を組み立てない
- DB（`@feedback-hub/db`）を直接 import しない。データは必ず API から取る
- 書き込みは Server Actions（`app/actions.ts`）で行い、終わったら `revalidatePath` する
- 画面の変更は E2E（`e2e/`）で確かめる。ボタンやリンクは role と名前で取れるようにする（`aria-label` など）
