import { expect, test } from "@playwright/test";

const API = "http://localhost:8788";

test.beforeAll(async ({ request }) => {
  await request.post(`${API}/boards`, { data: { slug: "e2e", name: "E2E ボード" } });
});

test("要望を投稿して投票できる", async ({ page }) => {
  await page.goto("/b/e2e");
  await page.getByPlaceholder("タイトル").fill("E2E で書いた要望");
  await page.getByRole("button", { name: "投稿" }).click();
  await expect(page.getByRole("link", { name: "E2E で書いた要望" })).toBeVisible();

  await page.getByRole("button", { name: "E2E で書いた要望 に投票" }).click();
  await expect(page.getByRole("button", { name: "E2E で書いた要望 に投票" })).toHaveText("▲ 1");
});
