import { expect, test } from "@playwright/test";

/**
 * Calls to action on the marketing site: the header offers "Join waitlist" (D43) or "Dashboard"
 * when signed in (D39), and every "Get started" button in the page content opens /signup (D38).
 * The waitlist page itself is covered by `waitlist.spec.ts`.
 *
 * @packageDocumentation
 */

test("the header offers Join waitlist instead of Log in and Sign up", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header").first();
  await expect(header.getByRole("link", { name: "Join waitlist" }).first()).toHaveAttribute(
    "href",
    "/waitlist",
  );
  await expect(header.getByRole("link", { name: "Log in" })).toHaveCount(0);
  await expect(header.getByRole("link", { name: "Sign up" })).toHaveCount(0);
});

test("a signed-in visitor sees Dashboard instead of Join waitlist", async ({ page }) => {
  // Fakes better-auth's session answer in the browser, so no backend or account is needed.
  await page.route("**/api/auth/get-session", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": new URL(page.url() || "http://localhost:3000").origin,
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        session: { id: "s1", userId: "u1", expiresAt: "2026-12-31T00:00:00.000Z" },
        user: {
          id: "u1",
          name: "Test Person",
          email: "test@example.com",
          emailVerified: true,
          image: null,
          createdAt: "2026-11-18T00:00:00.000Z",
          updatedAt: "2026-11-18T00:00:00.000Z",
        },
      }),
    }),
  );
  await page.goto("/");
  const header = page.locator("header").first();
  await expect(header.getByRole("link", { name: "Dashboard" }).first()).toHaveAttribute(
    "href",
    "/dashboard",
  );
  await expect(header.getByRole("link", { name: "Join waitlist" })).toHaveCount(0);
});

for (const path of ["/", "/features", "/pricing"]) {
  test(`${path} has Get started buttons to /signup`, async ({ page }) => {
    await page.goto(path);
    const getStarted = page.locator("main").getByRole("link", { name: "Get started" });
    await expect(getStarted.first()).toHaveAttribute("href", "/signup");
  });
}

test("sitemap.xml lists /signup and /waitlist", async ({ request }) => {
  const body = await (await request.get("/sitemap.xml")).text();
  expect(body).toContain("/signup</loc>");
  expect(body).toContain("/waitlist</loc>");
});
