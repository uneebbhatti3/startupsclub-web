import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type APIRequestContext } from "@playwright/test";

/**
 * SEO checks for the public marketing site. The page list comes from /sitemap.xml, so every
 * page added to `marketingRoutes` is covered automatically: one h1, a title and description that
 * are present and unique, and a canonical URL that matches the sitemap entry.
 *
 * @packageDocumentation
 */

// Pages set the share image explicitly (siteConfig.ogImage); its alt must not drift from the
// alt file used by the opengraph-image file convention.
const shareImageAlt = readFileSync(
  join(process.cwd(), "src/app/opengraph-image.alt.txt"),
  "utf8",
).trim();

async function getSitemapUrls(request: APIRequestContext): Promise<string[]> {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

test.describe("robots.txt and sitemap.xml", () => {
  test("robots.txt responds with rules", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");
    expect(await response.text()).toMatch(/User-Agent: \*/i);
  });

  test("sitemap.xml lists absolute URLs on the site origin", async ({ request }) => {
    const urls = await getSitemapUrls(request);
    expect(urls.length).toBeGreaterThan(0);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    for (const url of urls) {
      expect(() => new URL(url)).not.toThrow();
      if (siteUrl) {
        expect(new URL(url).origin).toBe(new URL(siteUrl).origin);
      }
    }
  });
});

test("marketing pages have one h1, unique title and description, and a correct canonical", async ({
  page,
  request,
}) => {
  const urls = await getSitemapUrls(request);
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const url of urls) {
    const { pathname } = new URL(url);
    const response = await page.goto(pathname);
    expect(response?.status(), pathname).toBe(200);

    await expect(page.locator("h1"), pathname).toHaveCount(1);

    const title = await page.title();
    expect(title.length, pathname).toBeGreaterThan(0);
    expect(title.length, `${pathname} title length`).toBeLessThanOrEqual(60);
    expect(titles.has(title), `${pathname} duplicate title`).toBe(false);
    titles.add(title);

    const description =
      (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
    expect(description.length, `${pathname} description length`).toBeGreaterThanOrEqual(120);
    expect(description.length, `${pathname} description length`).toBeLessThanOrEqual(160);
    expect(descriptions.has(description), `${pathname} duplicate description`).toBe(false);
    descriptions.add(description);

    await expect(page.locator('link[rel="canonical"]'), pathname).toHaveAttribute("href", url);

    for (const name of ["og:image", "twitter:image"]) {
      const image = page.locator(`meta[property="${name}"], meta[name="${name}"]`).first();
      await expect(image, `${pathname} ${name}`).toHaveAttribute("content", /^https?:\/\//);
    }
    await expect(
      page.locator('meta[property="og:image:alt"]').first(),
      `${pathname} og:image:alt matches opengraph-image.alt.txt`,
    ).toHaveAttribute("content", shareImageAlt);
  }
});

test("an unknown URL returns 404 with the not-found page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist-404-check");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Page not found");
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});
