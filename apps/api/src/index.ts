import { createDb } from "@feedback-hub/db";
import { serve } from "@hono/node-server";
import { createApp } from "./app";

const port = Number(process.env.API_PORT ?? 8787);
const app = createApp({
  db: await createDb(),
  adminToken: process.env.ADMIN_TOKEN ?? "dev-admin-token",
});
serve({ fetch: app.fetch, port }, () => console.log(`api: http://localhost:${port}`));
