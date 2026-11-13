import { expect, test } from "@playwright/test";

import { featureGroups } from "../../src/features/marketing/lib/content/features";

/**
 * Features page (/features): loads, has exactly one h1, a section per feature group reachable
 * from the sticky group nav, and every feature from `featureGroups` as a card heading.
 *
 * @packageDocumentation
 */

test.describe("/features", () => {
  test("loads with one h1 and a section per group", async ({ page }) => {
    const response = await page.goto("/features");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);

    const nav = page.getByRole("navigation", { name: "Feature groups" });
    for (const group of featureGroups) {
      await expect(nav.getByRole("link", { name: group.name, exact: true })).toHaveAttribute(
        "href",
        `#${group.id}`,
      );
      await expect(page.locator(`section#${group.id} h2`)).toHaveText(group.name);
    }
  });

  test("shows every feature as a card heading", async ({ page }) => {
    await page.goto("/features");
    // Cards below the fold stay hidden until the scroll reveal plays, so check that each heading
    // is in the server-rendered page rather than on screen.
    for (const feature of featureGroups.flatMap((group) => group.features)) {
      await expect(
        page.getByRole("heading", {
          level: 3,
          name: feature.name,
          exact: true,
          includeHidden: true,
        }),
      ).toHaveCount(1);
    }
  });
});
