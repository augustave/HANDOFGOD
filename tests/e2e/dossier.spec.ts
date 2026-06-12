import { expect, test } from "@playwright/test";

test("desktop dossier smoke flow", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "desktop project only");
  await page.goto("/");
  await page.getByRole("button", { name: /skip_boot/i }).click();
  await expect(page.getByRole("heading", { name: /the hand\s+of god/i })).toBeVisible();

  await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
  await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
  await page.getByLabel("Search dossier commands").fill("operate");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByText("OPERATE", { exact: true }).first()).toBeVisible();

  await page.getByLabel("Open share card composer").click();
  await expect(page.getByRole("dialog", { name: "Share dossier fragment" })).toBeVisible();
});

test("mobile command dock fits and expands", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile", "mobile project only");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /the hand\s+of god/i })).toBeVisible();

  await page.getByLabel("Open command dock").click({ force: true });
  await expect(page.getByRole("button", { name: "BRIEF", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "BRIEF", exact: true }).click({ force: true });
  await expect(page.getByText("BRIEF", { exact: true }).last()).toBeVisible();
});
