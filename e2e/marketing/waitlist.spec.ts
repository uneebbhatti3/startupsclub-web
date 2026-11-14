import { expect, test, type Page, type Route } from "@playwright/test";

/**
 * Waitlist (/waitlist) and the pre-launch calls to action. The form tests mock
 * `POST <NEXT_PUBLIC_API_BASE_URL>/waitlist` in the browser, so they need no running backend:
 * success shows a confirmation, the request body matches the API's DTO (`roleOther` only for
 * "Other"), API errors show a message and mark fields, and nothing reaches the page URL.
 * Also: the header offers "Join waitlist", the sitemap lists /waitlist, and no page links to
 * /login or /signup.
 *
 * @packageDocumentation
 */

type MockResponse = { status: number; body: unknown } | "abort";

/** Mocks the waitlist endpoint (any API origin) and records the JSON bodies sent to it. */
async function mockWaitlistApi(page: Page, response: MockResponse, delayMs = 0) {
  const sent: unknown[] = [];
  await page.route(
    (url) => url.pathname.endsWith("/api/v1/waitlist"),
    async (route: Route) => {
      const request = route.request();
      // The API is on another origin, so the browser enforces CORS on the mocked response too.
      const cors = {
        "Access-Control-Allow-Origin": new URL(page.url()).origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Allow-Methods": "POST",
      };
      if (request.method() === "OPTIONS") {
        await route.fulfill({ status: 204, headers: cors });
        return;
      }
      sent.push(request.postDataJSON());
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      if (response === "abort") {
        await route.abort("connectionrefused");
        return;
      }
      await route.fulfill({
        status: response.status,
        headers: cors,
        contentType: "application/json",
        body: JSON.stringify(response.body),
      });
    },
  );
  return sent;
}

const savedEntry = {
  data: {
    id: "cm3k1x2y30000abcd1234efgh",
    name: "Test Person",
    email: "test@example.com",
    role: "developer",
    roleOther: null,
    createdAt: "2026-11-14T16:20:00.000Z",
  },
};

async function fillForm(page: Page, role: "Founder" | "Developer" | "Other") {
  await page.getByLabel("Name").fill("Test Person");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByRole("combobox", { name: "Role" }).click();
  await page.getByRole("option", { name: role }).click();
}

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

  test("a successful signup sends the DTO and shows a confirmation", async ({ page }) => {
    await page.goto("/waitlist");
    const sent = await mockWaitlistApi(page, { status: 201, body: savedEntry }, 300);
    await fillForm(page, "Developer");
    await page.getByRole("button", { name: "Join waitlist" }).click();

    // While the request is in flight the button is disabled.
    await expect(page.getByRole("button", { name: "Joining…" })).toBeDisabled();

    await expect(page.getByRole("status")).toContainText("You're on the list");
    await expect(page.getByRole("status")).toContainText("test@example.com");
    await expect(page).toHaveURL(/\/waitlist$/);
    expect(sent).toEqual([{ name: "Test Person", email: "test@example.com", role: "developer" }]);
  });

  test("Other sends roleOther", async ({ page }) => {
    await page.goto("/waitlist");
    const sent = await mockWaitlistApi(page, { status: 201, body: savedEntry });
    await fillForm(page, "Other");
    await page.getByRole("textbox", { name: "Your role" }).fill("Designer");
    await page.getByRole("button", { name: "Join waitlist" }).click();

    await expect(page.getByRole("status")).toBeVisible();
    expect(sent).toEqual([
      { name: "Test Person", email: "test@example.com", role: "other", roleOther: "Designer" },
    ]);
  });

  test("an email already on the list shows a message and keeps the form", async ({ page }) => {
    await page.goto("/waitlist");
    await mockWaitlistApi(page, {
      status: 409,
      body: {
        error: { code: "WAITLIST_EMAIL_EXISTS", message: "Already in the waitlist", details: [] },
      },
    });
    await fillForm(page, "Founder");
    await page.getByRole("button", { name: "Join waitlist" }).click();

    // Next.js also renders an empty role="alert" route announcer, so match by text.
    await expect(
      page.getByRole("alert").filter({ hasText: "This email is already on the waitlist." }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toHaveValue("test@example.com");
    await expect(page.getByRole("button", { name: "Join waitlist" })).toBeEnabled();
  });

  test("a validation error marks the rejected field", async ({ page }) => {
    await page.goto("/waitlist");
    await mockWaitlistApi(page, {
      status: 400,
      body: {
        error: {
          code: "VALIDATION_FAILED",
          message: "Request validation failed",
          details: [{ field: "email", messages: ["email must be an email"] }],
        },
      },
    });
    await fillForm(page, "Founder");
    await page.getByRole("button", { name: "Join waitlist" }).click();

    await expect(page.getByText("Please check the highlighted fields.")).toBeVisible();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByLabel("Email")).toHaveAttribute("aria-invalid", "true");
  });

  test("an unreachable server shows a connection message", async ({ page }) => {
    await page.goto("/waitlist");
    await mockWaitlistApi(page, "abort");
    await fillForm(page, "Founder");
    await page.getByRole("button", { name: "Join waitlist" }).click();

    await expect(
      page.getByRole("alert").filter({ hasText: "We could not reach the server." }),
    ).toBeVisible();
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
