import { expect, test } from "@playwright/test";

/**
 * Waitlist (/waitlist) and the pre-launch calls to action: the page loads with one h1, the name
 * and email fields are labelled and enabled, submitting keeps the entry out of the URL, the header
 * offers "Join waitlist", the sitemap lists /waitlist, and no page links to /login or /signup.
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

  test("role is required, and Other reveals a required role field", async ({ page }) => {
    await page.goto("/waitlist");
    const role = page.getByRole("combobox", { name: "Role" });
    await page.getByLabel("Name").fill("Test Person");
    await page.getByLabel("Email").fill("test@example.com");

    // Submitting with no role keeps the user on the form with the role field focused.
    await page.getByRole("button", { name: "Join waitlist" }).click();
    await expect(role).toBeFocused();

    await role.click();
    await page.getByRole("option", { name: "Other" }).click();
    await expect(role).toHaveText(/Other/);
    const otherRole = page.getByRole("textbox", { name: "Your role" });
    await expect(otherRole).toBeVisible();
    await expect(otherRole).toHaveAttribute("required", "");

    // Choosing another role removes the free-text field again.
    await role.click();
    await page.getByRole("option", { name: "Founder" }).click();
    await expect(otherRole).toHaveCount(0);
  });

  test("submitting never puts the name or email in the URL", async ({ page }) => {
    await page.goto("/waitlist");
    await page.getByLabel("Name").fill("Test Person");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByRole("combobox", { name: "Role" }).click();
    await page.getByRole("option", { name: "Developer" }).click();
    await page.getByRole("button", { name: "Join waitlist" }).click();
    await expect(page).toHaveURL(/\/waitlist$/);
  });
});

test("the header offers Join waitlist and no log-in", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header").first();
  await expect(header.getByRole("link", { name: "Join waitlist" }).first()).toHaveAttribute(
    "href",
    "/waitlist",
  );
  await expect(header.getByRole("link", { name: "Log in" })).toHaveCount(0);
});

test("sitemap.xml lists /waitlist", async ({ request }) => {
  const body = await (await request.get("/sitemap.xml")).text();
  expect(body).toContain("/waitlist</loc>");
});

for (const path of ["/", "/features", "/pricing", "/waitlist"]) {
  test(`${path} has no links to /login or /signup`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('a[href^="/login"], a[href^="/signup"]')).toHaveCount(0);
  });
}
