# Progress — StartupsClub Web

The live status log. **Update this file at the end of every task** (humans and AI agents).
Keep entries short. Milestones are defined in `docs/ROADMAP.md`.

## Status board

| Milestone                     | Status      | Owner | Notes                                                              |
| ----------------------------- | ----------- | ----- | ------------------------------------------------------------------ |
| M0 Scaffold and tooling       | Not started | Uneeb | Documents written 11 Nov 2026; awaiting owner approval of `docs/`. |
| M1 Design foundation          | Not started |       | Blocked by: heading font decision.                                 |
| M2 Marketing site             | Not started |       |                                                                    |
| M3 App shell and auth screens | Not started |       |                                                                    |
| M4 Phase 1 screens            | Not started |       |                                                                    |
| M5 Phase 2 screens            | Not started |       |                                                                    |
| M6 Phase 3 screens            | Not started |       |                                                                    |
| M7 Tutors                     | Not started |       | Blocked by: scope decision.                                        |
| M8 Real API integration       | Not started | Uneeb | Needs backend.                                                     |
| M9 Hardening                  | Not started |       |                                                                    |

Status values: Not started · In progress · In review · Done · Blocked.

## Installed versions (fill in at scaffold)

| Package                       | Version |
| ----------------------------- | ------- |
| Next.js                       |         |
| React                         |         |
| Tailwind CSS                  |         |
| shadcn CLI                    |         |
| TanStack Query                |         |
| Axios                         |         |
| GSAP                          |         |
| Locomotive Scroll             |         |
| Playwright                    |         |
| Sentry SDK (`@sentry/nextjs`) |         |
| Node                          |         |

## Remaining fixtures

Run `grep -r "FIXTURE:" src` and note the count here per milestone.

## Session log (newest first)

Use this format:

```
### YYYY-MM-DD — <name or agent> — <task>
- Did:
- Verified (commands run, what was looked at in the browser):
- Not verified / known issues:
- Next:
- Questions for the owner:
```

### 2026-11-13 — Claude — Theme-aware logo

- `Logo` shows `logo-black.png` in light mode and `logo-white.png` in dark mode. The new `compactOnMobile` prop (used only by the site header, as the owner chose) shows `logo-icon-black.png` / `logo-icon-white.png` below `sm` (640px). The switching is done in CSS, so the server render is correct and nothing flashes. Also fixed the wrong 120×120 intrinsic size (the real files are 1099×154 and 2048×2048).
- Checks: format, lint, typecheck, build. On the production build I checked the header and footer at 1440 and 390 in light and dark: the expected image showed in each case and the console had no warnings.
- Known issue: the running dev server had not picked up the new Tailwind classes, so restart `npm run dev` if the logo looks wrong locally.

### 2026-11-13 — Claude — Grifter for marketing headings

- Grifter Bold (`src/app/fonts/grifterbold.otf`, added by the owner) loaded with `next/font/local` in the marketing layout only; `font-heading` reads it there and falls back to Inter everywhere else (D29).
- Heading letter-spacing set to 0 in the marketing area (letters touched with the old negative tracking). Footer wordmark resized (fontSize 140, viewBox height 142) so the letters no longer overlap.
- Checks: format, lint, typecheck, build, e2e. Looked at home, features, pricing and footer at 1440 and 390 in light and dark; computed fonts confirmed Grifter on marketing headings and Inter on body text and the 404 page.

### 2026-11-13 — Claude — Waitlist buttons hidden (temporary)

- Owner request: the waitlist backend is not ready, so every "Join waitlist" button is hidden (header, mobile menu, home hero, Features hero, Seasons, both plan cards, final CTA, footer). No notice replaces them.
- One switch: `waitlistVisible` in `src/config/site.ts` (re-exported as `showWaitlist` in `content/home.ts`). While false, /waitlist is also left out of the sitemap and llms.txt; the page itself still exists at its URL.
- e2e updated: no page links to /waitlist while hidden. Checks: format, lint, typecheck, build, e2e 17/17 pass. Looked at home (1440) and pricing and mobile menu (390), light mode only.

### 2026-11-12 — Claude — Page transitions

- Did: `src/app/(marketing)/template.tsx` wraps each page in `<ViewTransition enter="page-enter" exit="page-exit" default="none">` with one wrapper `div`; the keyframes are in `marketing.css`; the header gets `view-transition-name: site-header` (D28).
- Verified (production build, Playwright): transitions fire on page-to-page navigation (header, CTA, mobile menu, `/#faq`) and not on in-page anchors; 2 snapshots per navigation (was 19 before the wrapper); about 440–600 ms end to end; no old/new overlap in mid-transition screenshots; reduced motion runs at 0 ms; mobile dark is fine. Frame timing in headless software-rendered Chromium: one long frame per navigation (about 100–167 ms with the transition, 67–83 ms without, since snapshot capture adds about 60–80 ms); all other frames are about 16 ms. e2e 17/17.
- Not verified: frame timing on real GPU hardware or in Safari and Firefox (the docs warn Safari may differ).

### 2026-11-12 — Claude — Waitlist replaces sign-up and log-in

- Did: installed shadcn `field`, `input`, `card`, `alert` (plus their `label`, `separator`; no new npm dependencies). New `/waitlist` page (`PageHero` and `waitlist-form.tsx`): name and email in a disabled fieldset with a "Sign-ups open soon" notice (`role="status"`, linked via `aria-describedby`), no submit handler. `authLinks` replaced by `waitlistLink`; every sign-up/log-in link now says "Join waitlist" and points to `/waitlist` (D26). `MarketingButton` gained an optional `onClick` so the mobile menu closes. `/waitlist` added to `marketingRoutes`. e2e `waitlist.spec.ts`.
- Verified (production build): format, lint, typecheck, build; e2e 16/16 (including the sitemap SEO spec for `/waitlist` and "no /login or /signup links" on all four pages); fields match `:disabled` and refuse typing; light and dark at 1440 and 390; the mobile menu closes after tapping "Join waitlist". The `/login` and `/signup` prefetch 404s are gone.
- Open: D27, where entries are stored. The form stays disabled until then.

### 2026-11-12 — Claude — Redesigned 404 page

- Did: `src/app/not-found.tsx` now has the logo, the hero's blue wash and dotted grid (tokens only, no marketing CSS, since it serves every route group), a large fading "404", the existing h1 and sentence, a "Go to the home page" button and links to Features, Pricing and FAQ.
- Verified (production build): HTTP 404, one h1, robots noindex, light and dark at 1440 and 390, fits one screen with no scrolling. e2e 10/10. The only console error is the expected 404 for the missing page itself.

### 2026-11-12 — Claude — Hero product video

- Did: `hero-video.tsx` plays `public/product-video.mp4` (1280×720, 66 s, 3.4 MB) in place of `DashboardMock` in the home hero: muted, looped, autoplays only while on screen, pause/play button (WCAG 2.2.2), first frame plus play button for reduced-motion visitors. `DashboardMock` is now unused but kept.
- Verified (production build): autoplay, pause and resume, a visitor's pause survives scrolling, off-screen pause, reduced motion, light and dark at 1440 and 390, no horizontal scroll. Lint and typecheck pass.
- Not verified / known issues: the video's own UI is light-themed, so it stays bright in dark mode. No captions or transcript (fine while it is silent and decorative; needed if a narrated version is used). No poster image; the first frame is used instead.

### 2026-11-12 — Claude — Features page, pricing page and comparison table

- Did: `features/marketing/lib/content/features.ts` (`featureGroups`: 6 groups, 24 features, `aiQuotaFootnote`) as the one source for `/features` and the table on `/pricing`. New components: `page-hero`, `feature-badges` (PlanBadge), `feature-group-nav` (sticky anchor nav), `feature-group-section` (existing mockups for 6 features, Lucide icons for the rest), `comparison-table` (semantic table; header row pinned from `md`; own sideways-scrolling region below `md`). `PricingTeaser` gained `showHeading`, `showFootnote`, `compareLink`. Header/footer "Features" and "Pricing" now go to the pages; home got "See all features" and "Compare all features". Both routes added to `marketingRoutes` (sitemap, llms.txt). Restored the home page `metadata` export and the Organization/WebSite JSON-LD in `(marketing)/layout.tsx` (both had been lost). Owner answers recorded as D21–D25. e2e: `features.spec.ts`, `pricing.spec.ts`.
- Verified: format:check, lint, typecheck, build (all routes static). e2e 10/10 on a production build, including the sitemap-driven SEO spec now covering `/features` and `/pricing`. Home HTML has title, description, canonical and JSON-LD. Playwright MCP on the production build: see the session report.
- Not verified / known issues: `/login` and `/signup` prefetches 404 (pages not built yet; existed before this change). The dev server on port 3000 served stale Tailwind CSS for a new class during this session (restart it if a class seems to have no effect).
- Questions for the owner: the "Compare" eyebrow and "Free and Pro, feature by feature" heading above the table, and the "01"–"06" eyebrows on the Features page, are draft copy.

### 2026-11-12 — Claude — Dark mode near-black surfaces, pricing cards, mobile menu, footer

- Did: dark neutrals set to `docs/DESIGN_SYSTEM.md` values (`--background` `#0A0A0A`, card/popover `#111111`, muted/secondary `#1A1A1A`, border/input `#262626`, muted-foreground `#A3A3A3`); "How it works" and "Pricing" bands use `dark:bg-background`. Pricing cards get `.mk-plan` / `.mk-plan-featured` (surface gradient, top highlight, layered shadow, blue wash and halo on Pro, hover lift via `translate` so it does not clash with GSAP's `transform`), a divider and tinted check icons. Mobile menu is absolute and slides/fades out from under the bar (`inert` when closed). Footer has the dotted pattern and a full-width SVG wordmark.
- Verified: in the browser at 1440 and 390, light and dark: every section is `#0A0A0A` or transparent in dark, no wide mid-grey surfaces; hover lift works; menu no longer moves the page; wordmark spans edge to edge with no horizontal scroll. No console errors or warnings. Typecheck and lint pass.
- Not verified / known issues: light-mode neutrals are still shadcn defaults.

### 2026-11-12 — Claude — Theme provider and blue tokens

- Did: mounted `ThemeProvider` in the root layout (toggle was inert; D20). Set the blue tokens in `globals.css` from `docs/DESIGN_SYSTEM.md` section 2: `--primary` `#0076DE`, new `--primary-text` (`#0076DE` / `#4DA3FF`) mapped to `text-primary-text`, `--accent` (`#EAF3FC` / `#0F1B2D`), `--ring` (`#0076DE` / `#4DA3FF`); sidebar tokens follow them. shadcn `link` button variant uses `text-primary-text`.
- Verified: typecheck passes; home page viewed in light and dark at 1440 and 390, toggle switches and persists across reload, no console errors or warnings.
- Not verified / known issues: neutral tokens are still shadcn's defaults, close to but not exactly the table (for example muted-foreground). The derived blue values still need owner confirmation. `marketing.css` uses `rgb(0 0 0 / 0.9)` in a dark shadow, against the no-pure-black rule.

### 2026-11-12 — Claude — Deploy only after merge (GitHub Actions → Vercel)

- Did: `vercel.json` turns off Vercel's Git deployments; new `Deploy to Vercel` job in `ci.yml` deploys `integration` to Preview and `main` to Production after all checks pass on the merged commit; workflow cancellation limited to pull requests so a deploy is never cut off. ESLint now ignores the skill copy in `.claude/` (CI lint errors) and the hook passes `--no-warn-ignored`. D19 added; `docs/DEPLOYMENT.md` updated.
- Verified: Prettier clean on the changed files. The workflow itself has not run yet.
- Not verified / known issues: the deploy job needs the three secrets before it can succeed; untested whether CLI deployments carry Git commit metadata to Vercel (Sentry release naming relies on `VERCEL_GIT_COMMIT_SHA`).
- Next: owner adds `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` as GitHub Actions secrets.

### 2026-11-12 — Claude — Site-wide SEO foundation

- Did: `src/config/{env,site}.ts`, `src/lib/seo.ts` (`createPageMetadata`, JSON-LD); root metadata and viewport; moved home page to `(marketing)` (metadata only, body unchanged); `(marketing)/layout.tsx` with Organization and WebSite JSON-LD; `robots.ts`, `sitemap.ts`, `not-found.tsx`, `llms.txt/route.ts`, `opengraph-image.alt.txt`; `format`, `format:check` and `typecheck` scripts; `playwright.config.ts` and `e2e/marketing/seo.spec.ts`; `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in `.env.example`. Decisions D1–D17 in `docs/DECISIONS.md`.
- Verified: typecheck passes; ESLint clean on `src`, `e2e` and the Playwright config; Prettier clean on the changed files; `next build` succeeds with every route static; e2e 4/4 passed. Fetched robots.txt, sitemap.xml and llms.txt on the production build; unknown URL returns 404. The production variant (`VERCEL_ENV=production`) shows index/follow, googlebot directives, Allow/Disallow, Host and Sitemap, and a consistent noindex on the 404 page. Home head checked: canonical, Open Graph, Twitter and JSON-LD URLs are all absolute on the site origin. Not-found page viewed in light and dark at 1440 and 390 (dark by adding the `.dark` class, since there is no theme provider yet).
- Not verified / known issues: link previews on LinkedIn, WhatsApp and X (needs a deployed site); Google Rich Results test; the local `.env` lacks `NEXT_PUBLIC_SITE_URL`, so builds fail until it is added. `globals.css` still has shadcn's default neutral tokens, not `docs/DESIGN_SYSTEM.md` (the 404 button renders near-black, not `#0076DE`). Repository-wide `format:check` and `lint` fail on pre-existing files (D17). The Geist fonts in the root layout trigger unused-preload console warnings. The home page body is still the Create Next App template, with broken `/next.svg` and `/vercel.svg` images.
- Next: add icons, then `manifest.ts` (D16); add `(app)`/`(auth)` layouts with noindex per D4 when those groups are built; add each new marketing page to `marketingRoutes`.
- Questions for the owner: D15–D18; restore the lost C/O decision entries.
- Update (same day): production URL https://startupsclub.vercel.app recorded (D14) and deployment notes updated; a production build with that URL verified locally. The live site still serves the old template until this work reaches `main`.
- Update (same day): pre-commit hook now (1) checks formatting on staged files and auto-fixes with Prettier, (2) runs ESLint on staged files, which rejects explicit `any`, `as any` and `@ts-ignore` (rules pinned in `eslint.config.mjs`), (3) runs the whole-project typecheck, which rejects implicit `any`. Each step was verified with temporary files; a full `git commit` run was not, because this branch (`integration`) is blocked by the branch rule.
- Update (same day): whole repository formatted with Prettier, including `.agents/` and `.claude/` (owner request). Exceptions and reasons in `docs/DECISIONS.md` D17. Verified: format:check, lint, typecheck and build pass; all 153 JS files and all JSON in the skill still parse; the skill template markers are intact. Pre-commit hook tested end to end in a throwaway repository: formatting auto-fixed and committed, explicit `any` blocked by ESLint, implicit `any` blocked by the type check. Found: `.claude/settings.json` (the `.env` deny rules that `CLAUDE.md` refers to) does not exist.

### 2026-11-12 — Claude (feature-based architecture)

- Did: rewrote `docs/ARCHITECTURE.md` sections 3–6 and 8, `docs/STATE_AND_DATA.md`, and updated `AGENTS.md`, `FRONTEND_GUIDELINES`, `TRD`, `DESIGN_SYSTEM`, `LANDING_PAGE`, `MONITORING`, `TEAM_GUIDE` and `DECISIONS` to the owner's structure.
- Verified: no remaining references to the old `hooks.ts`, `api.ts`, `fixtures.ts`, `lib/api-client.ts`, `providers/`, `config/` or `components/marketing` paths.
- Not verified: nothing built; placements C25–C31 are proposals.
- Next: owner confirms C25–C31.
- Questions for the owner: see `docs/DECISIONS.md` C25–C31.

### 2026-11-11 — Claude (Sentry added)

- Did: added `docs/MONITORING.md` and updated the other documents, `.env.example`, CI and Claude settings for Sentry on both repositories.
- Verified: files parse; cross-references resolve. Nothing run; no project exists yet.
- Not verified: exact Sentry file locations and options at setup time; Sentry plan and quota.
- Next: owner answers C17–C24 and O13–O16 in `docs/DECISIONS.md`.
- Questions for the owner: see those entries.

### 2026-11-11 — Claude (documentation set)

- Did: wrote the project documents, tooling configuration, CI workflows and templates.
- Verified: contrast ratios computed for the blue and neutral tokens; endpoints extracted from the system design.
- Not verified: nothing has been run; no Next.js project exists yet; GitHub ruleset options for the plan not checked.
- Next: owner reviews and approves `docs/`; answer open questions in `docs/DECISIONS.md`; then M0 scaffold.
- Questions for the owner: see `docs/DECISIONS.md` (sections "To confirm" and "Open").
