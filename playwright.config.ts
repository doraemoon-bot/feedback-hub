import { defineConfig } from "@playwright/test";

const API = "http://localhost:8788";

// E2E は専用のポートと、使い捨ての DB（.data/e2e）で API と画面を立ち上げる
export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:3001" },
  webServer: [
    {
      command: "rm -rf .data/e2e && pnpm --filter @feedback-hub/api start",
      url: `${API}/health`,
      env: { API_PORT: "8788", PGLITE_DIR: ".data/e2e", ADMIN_TOKEN: "e2e-admin" },
      reuseExistingServer: false,
    },
    {
      command:
        "pnpm --filter @feedback-hub/web build && pnpm --filter @feedback-hub/web exec next start --port 3001",
      url: "http://localhost:3001",
      env: { API_URL: API },
      reuseExistingServer: false,
      timeout: 180_000,
    },
  ],
});
