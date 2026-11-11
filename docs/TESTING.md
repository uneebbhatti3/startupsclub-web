# Testing — StartupsClub Web

## 1. Principles

- Test what a user does, in a real browser. Playwright is the only test tool for now.
- No unit-test framework is installed. Adding one (for example Vitest) needs the owner's approval.
- "It compiles" is not a test. Use the browser.

## 2. Two uses of Playwright

| Use                          | Who                         | Purpose                                                                    |
| ---------------------------- | --------------------------- | -------------------------------------------------------------------------- |
| **Playwright MCP**           | The AI agent, interactively | Look at pages in real time while building: layout, themes, console errors. |
| **Playwright Test** (`e2e/`) | Everyone, and CI            | Repeatable smoke and flow tests that run on every pull request.            |

## 3. When the agent must look in the browser

After every change that alters what renders: new page, component, layout, spacing, colour,
animation. Do it with the dev server running:

1. Open the affected route.
2. Check **light and dark** mode.
3. Check **1440 px** and **390 px** widths.
4. Read the console: no errors, no hydration warnings.
5. Scroll and interact (menus, dialogs, forms) for the change in question.
6. Report what was seen and anything that could not be verified.

Skip this for docs, config and type-only changes.

## 4. Test layout

```
e2e/
  marketing/     one spec per marketing page (loads, headings, links, theme toggle)
  app/           flows per feature (standup, clubs, composer, ...)
  fixtures/      Playwright fixtures (for example a signed-in session helper)
playwright.config.ts
```

## 5. `playwright.config.ts` (to be created at scaffold, with approval)

- `testDir: "./e2e"`, `fullyParallel: true`, `forbidOnly: !!process.env.CI`,
  `retries: process.env.CI ? 1 : 0`, `reporter: "html"`.
- `use: { baseURL: "http://localhost:3000", trace: "on-first-retry", screenshot: "only-on-failure" }`.
- `projects`: desktop Chromium and a mobile viewport (390 px wide). More browsers later.
- `webServer`: build and start the production server in CI (`npm run build && npm run start`),
  `reuseExistingServer: !process.env.CI`.

## 6. What to test first

1. Every marketing page loads, has one `h1`, and header and footer links work.
2. Theme toggle switches between light and dark and persists on reload.
3. Auth screens: validation messages, links between login, signup and reset.
4. Dashboard shell renders and the sidebar navigates (on fixtures).
5. Standup create and tick-off flow (on fixtures).
6. Pro-gated action shows the upgrade prompt for a free user.

## 7. Accessibility checks (proposal)

Add `@axe-core/playwright` to run automated checks on key pages. **Needs approval** as a new
dependency. Automated checks catch only part of the problems; see `docs/ACCESSIBILITY.md`.

## 8. Rules

- Use accessible locators (`getByRole`, `getByLabel`, `getByText`) before CSS selectors.
- No fixed sleeps; use Playwright's auto-waiting and web-first assertions.
- Tests must be independent and runnable in any order.
- No test depends on a real backend until milestone M8; until then they run on fixtures.
- A failing test is never deleted or skipped to make CI pass without the owner's approval.

## 9. CI

The `End-to-end tests` job installs Chromium and runs `npx playwright test --pass-with-no-tests`
so the job passes while no tests exist yet. Remove `--pass-with-no-tests` once the first test is
merged. On failure the HTML report is uploaded as an artifact for 7 days.

## 10. Monitoring in tests

- The DSN is empty in tests and CI, so tests never send events to Sentry.
- Do not commit test pages or routes that throw deliberate errors. To check the Sentry setup, use a
  separate development Sentry project locally (`docs/MONITORING.md` section 10).
- Add a Playwright test for the error boundary UI (friendly message, a next step) once a route can
  be made to fail on fixtures.
