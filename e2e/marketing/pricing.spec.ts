import { expect, test } from "@playwright/test";

import { featureGroups } from "../../src/features/marketing/lib/content/features";

/**
 * Pricing page (/pricing): loads, has exactly one h1, and the comparison table has the three
 * column headers, a row for every feature in `featureGroups`, and "Not included" under Free for
 * a Pro-only feature.
 *
 * @packageDocumentation
 */

test.describe("/pricing", () => {
  test("loads with one h1", async ({ page }) => {
    const response = await page.goto("/pricing");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("comparison table has Feature, Free and Pro column headers", async ({ page }) => {
    await page.goto("/pricing");
    const table = page.locator("#compare table");
    await expect(table.locator('thead th[scope="col"]')).toHaveText(["Feature", "Free", "Pro"]);
  });

  test("comparison table has a row for every feature", async ({ page }) => {
    await page.goto("/pricing");
    const rowHeaders = page.locator('#compare th[scope="row"]');
    const features = featureGroups.flatMap((group) => group.features);
    await expect(rowHeaders).toHaveCount(features.length);
    for (const feature of features) {
      await expect(
        page.locator('#compare th[scope="row"]', { hasText: feature.name }).first(),
      ).toBeAttached();
    }
  });

  test("a Pro-only row shows Not included under Free and Included under Pro", async ({ page }) => {
    await page.goto("/pricing");
    const row = page.locator("#compare tr", {
      has: page.locator('th[scope="row"]', { hasText: "AI Standup Coach" }),
    });
    const cells = row.locator("td");
    await expect(cells.nth(0)).toHaveText("Not included");
    await expect(cells.nth(1)).toHaveText("Included");
  });
});
