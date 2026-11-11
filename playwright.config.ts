import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the end-to-end tests in `e2e/`. Tests run against a production
 * build (`next build` then `next start`) so metadata, robots, sitemap and 404 behaviour match
 * what is deployed.
 *
 * @packageDocumentation
 */

// Override with PLAYWRIGHT_PORT when 3000 is already taken by a dev server.
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3000);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npm run start -- -p ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
