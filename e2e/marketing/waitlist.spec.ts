import { expect, test } from "@playwright/test";

/**
 * Waitlist (/waitlist) and the pre-launch calls to action: the page loads with one h1, the name
 * and email fields are labelled and enabled, submitting keeps the entry out of the URL, and while
 * the waitlist is hidden no page links to /login, /signup or /waitlist.
 *
 * @packageDocumentation
 */

test.describe("/waitlist", () => {
  test("loads with one h1 and an enabled, labelled form", async ({ page }) => {
    const response = await page.goto("/waitlist");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);

    const name = page.getByLabel("Name");
    const email = page.getByLabel("Email");
    await expect(name).toBeEnabled();
    await expect(email).toBeEnabled();
    await expect(email).toHaveAttribute("type", "email");
    await expect(page.getByRole("button", { name: "Join waitlist" })).toBeEnabled();
  });

  test("submitting never puts the name or email in the URL", async ({ page }) => {
    await page.goto("/waitlist");
    await page.getByLabel("Name").fill("Test Person");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByRole("button", { name: "Join waitlist" }).click();
    await expect(page).toHaveURL(/\/waitlist$/);
  });
});

// While `waitlistVisible` is false (src/config/site.ts), no page links to /waitlist.
test("the header has no log-in and no waitlist button while it is hidden", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header").first();
  await expect(header.getByRole("link", { name: "Join waitlist" })).toHaveCount(0);
  await expect(header.getByRole("link", { name: "Log in" })).toHaveCount(0);
});

for (const path of ["/", "/features", "/pricing", "/waitlist"]) {
  test(`${path} has no links to /login, /signup or /waitlist`, async ({ page }) => {
    await page.goto(path);
    await expect(
      page.locator('a[href^="/login"], a[href^="/signup"], a[href^="/waitlist"]'),
    ).toHaveCount(0);
  });
}
