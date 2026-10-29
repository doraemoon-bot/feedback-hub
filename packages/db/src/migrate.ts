import { createDb } from "./client";

await createDb();
console.log("マイグレーション完了");
process.exit(0);
