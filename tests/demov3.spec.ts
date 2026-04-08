import { test, expect } from "@playwright/test";

const STUDIO_URL = "http://localhost:3011";

test.describe("DemoV3 Knowledge Graph", () => {
  test("studio loads and DemoV3 composition exists", async ({ page }) => {
    await page.goto(STUDIO_URL, { waitUntil: "networkidle" });
    const html = await page.content();
    expect(html).toContain("Remotion Studio");
  });

  test("knowledge graph HTML loads with vis-network", async ({ page }) => {
    const staticBase = await page.goto(STUDIO_URL).then(async () => {
      return page.evaluate(() => (window as any).remotion_staticBase);
    });
    const kgUrl = `${STUDIO_URL}${staticBase}/aos_kg_v3.html`;
    await page.goto(kgUrl, { waitUntil: "networkidle" });

    // Graph container exists
    const container = page.locator("#graph-container");
    await expect(container).toBeVisible();

    // Nodes rendered (vis-network creates canvas)
    const canvas = page.locator("#graph-container canvas");
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Details panel exists but hidden initially
    const details = page.locator("#details");
    await expect(details).toBeHidden();
  });

  test("postMessage triggers node selection and modal", async ({ page }) => {
    const staticBase = await page.goto(STUDIO_URL).then(async () => {
      return page.evaluate(() => (window as any).remotion_staticBase);
    });
    const kgUrl = `${STUDIO_URL}${staticBase}/aos_kg_v3.html`;
    await page.goto(kgUrl, { waitUntil: "networkidle" });

    // Wait for network to stabilize
    await page.waitForTimeout(3000);

    // Send selectNode message
    await page.evaluate(() => {
      window.postMessage({ type: "selectNode", nodeId: "meridian" }, "*");
    });
    await page.waitForTimeout(500);

    // Details panel should be visible with Meridian info
    const details = page.locator("#details");
    await expect(details).toBeVisible();
    const title = page.locator("#detail-title");
    await expect(title).toHaveText("Meridian");

    // Send clear message
    await page.evaluate(() => {
      window.postMessage({ type: "clear" }, "*");
    });
    await page.waitForTimeout(300);
    await expect(details).toBeHidden();
  });

  test("postMessage cycles through all click targets", async ({ page }) => {
    const staticBase = await page.goto(STUDIO_URL).then(async () => {
      return page.evaluate(() => (window as any).remotion_staticBase);
    });
    const kgUrl = `${STUDIO_URL}${staticBase}/aos_kg_v3.html`;
    await page.goto(kgUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);

    const nodes = ["meridian", "contract", "engagement", "owner"];
    const expectedLabels = ["Meridian", "MSA-2024-017", "4 Active", "Sarah Chen"];

    for (let i = 0; i < nodes.length; i++) {
      await page.evaluate((id) => {
        window.postMessage({ type: "selectNode", nodeId: id }, "*");
      }, nodes[i]);
      await page.waitForTimeout(400);

      const details = page.locator("#details");
      await expect(details).toBeVisible();
      const title = page.locator("#detail-title");
      await expect(title).toHaveText(expectedLabels[i]);
    }

    // Clear at end
    await page.evaluate(() => {
      window.postMessage({ type: "clear" }, "*");
    });
    await page.waitForTimeout(300);
    await expect(page.locator("#details")).toBeHidden();
  });
});
