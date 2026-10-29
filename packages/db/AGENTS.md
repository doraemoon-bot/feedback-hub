# packages/db の決まり

- スキーマは `src/schema.ts`。変えたら `pnpm db:generate` でマイグレーションを作る（Skill: `db-migration`）
- `migrations/` の既存ファイルは**手で編集しない**（適用済みの環境と食い違う）。直すときは新しいマイグレーションを足す
- 列の削除・型の変更など、既存データに影響する変更は人の承認が必要
