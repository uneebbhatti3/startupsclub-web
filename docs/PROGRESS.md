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

### 2026-11-19 — Claude — Lint error in `use-mobile.ts`

- Cause: the shadcn `useIsMobile` hook called `setState` directly inside an effect (`react-hooks/set-state-in-effect`), which failed `npm run lint` and the pre-commit hook.
- Did: rewrote it with `useSyncExternalStore` subscribed to the `(max-width: 767px)` media query. Server snapshot is `false`, matching the old first render. Same export, so `sidebar.tsx` is unchanged.
- Verified: `npm run lint` and `npm run typecheck` pass; Prettier clean on the file.
- Not verified: no visual pass (behaviour unchanged: the sidebar switches to its sheet below 768px).
- Next: none.

### 2026-11-18 — Claude — Waitlist count reverts on reload (bug fix)

- Cause: `/waitlist` reads the count from a 5-minute server cache that is also prerendered at build (D35). A signup refreshed the count only in the browser, so a reload showed the old cached number.
- Did (D44): `cacheTag("waitlist-count")` in `waitlist-count-cache.ts`; new Server Action `expireWaitlistCount` (`updateTag`) in `waitlist-count-actions.ts`, called by `useJoinWaitlist` after a successful signup.
- Verified: typecheck, ESLint, build. Against a local mock API (count 4, +1 per POST): load 4 → submit 5 → reload 5 (server HTML has 5) → submit 6 → reload 6. e2e `waitlist.spec.ts` 12/12 and `cta.spec.ts` pass when the API is unreachable at build time.
- Not verified / known issues: not tested against the Render API (needs a deploy). With an API reachable at build time (for example the local backend on :8000), the three count e2e tests fail because the real count is baked in and the browser mocks are not used (known since D35, not caused by this fix). Signups made outside this site show within 5 minutes.
- Next: none.

### 2026-11-18 — Claude — Join waitlist back in the header; /waitlist public

- Did (D43): header (desktop and mobile menu) shows "Join waitlist" → `/waitlist` for signed-out visitors, "Dashboard" when signed in; `/waitlist` page restored with the server-cached count, redirect removed, route listed in the sitemap and llms.txt; `waitlist.spec.ts` restored and `cta.spec.ts` updated.
- Verified: typecheck; ESLint clean on changed files; e2e `cta.spec.ts`, `waitlist.spec.ts`, `seo.spec.ts` 22/22 (production build on :3100). Looked at the header at 1440 (light), `/waitlist` at 1440 (light, 200) and the mobile menu at 390 (dark). Console: only the refused count request (local API not running; the count stays hidden as designed).
- Not verified / known issues: the waitlist count against the real API (needs a deploy). The home page and plans still say "Get started" → `/signup` (owner's choice: header only).
- Next: none from this task.

### 2026-11-18 — Claude — Dashboard: start standup, activity graph, Suspense skeletons

- Did (D42): standup card has History, inline "Start standup" form and "Add item" row; weekly score replaced by a full-width 26-week activity graph; per-card `<Suspense>` with skeleton fallbacks (`useSuspenseQuery` + `select`) and a `catchError` boundary with Retry; standup card height follows its content; month labels skip months with under 3 week columns so they never overlap.
- Verified: typecheck; `npm run build` passes; ESLint and Prettier clean on `features/dashboard`. Production server on :3100 with a faked `get-session`: skeletons render for all five cards, then data; empty submit shows "Add at least one item."; posting 2 items + blocker shows "0 of 2 done"; adding an item gives "0 of 3"; ticking gives "1 of 3" and today's square/active-day count updates; History links to `/standup/history`; graph fills the card (1048 of 1096 px) at 1440 and fits at 390 with no horizontal scroll; light and dark checked. Console: only 404s from prefetching unbuilt routes.
- Not verified / known issues: the error boundary and Retry were not triggered in the browser (fixture never fails). Posted standups and added items are lost on refresh until the API exists. At desktop width the area under a short standup card is empty (the right column is taller). Sentry reporting in the boundary waits for `@sentry/nextjs`. Restart `npm run dev` if `/dashboard` 500s (stale module).
- Next: `/standup` and `/standup/history` pages; confirm the dashboard and standup bodies with the backend.

### 2026-11-18 — Claude — Dashboard page

- Did (D41): `/dashboard` moved into `src/app/(app)/` with a sign-in guard; new `features/dashboard` (types, `FIXTURE:` service, `useDashboard`, `useToggleStandupItem`, cards, skeleton, error with retry). Standup card ticks items and has "Plan with Coach" (Pro) → `/pricing`. Header shows the section name. Added shadcn `progress`; deleted unused block demos.
- Verified: typecheck, `npm run build` (passes, `/dashboard` built), ESLint/Prettier clean on new and changed files. Production server on :3100 with a faked `get-session`: light and dark at 1440, dark at 390 (no horizontal scroll); ticking changes "2 of 4 done" to "3 of 4"; "Plan with Coach" links to `/pricing`; signed-out session redirects to `/login`. Console: only 404s from prefetching unbuilt sidebar routes.
- Not verified / known issues: empty states (no standup, no club, no notifications) and the load-error state were not seen in the browser (fixture always returns data). Ticks are lost on refresh until the API exists. The already-running dev server on :3000 served a stale `config/navigation.ts` (500, `appNavTitle is not a function`); restart `npm run dev`. Repo-wide lint still fails on `hooks/use-mobile.ts` (shadcn). The standup card leaves empty space under its content at desktop width (it spans two rows).
- Next: `/standup` page; confirm the `GET /me/dashboard` body with the backend.

### 2026-11-18 — Claude — App sidebar links

- Did (D40): replaced the demo sidebar links with Dashboard, Standups, Clubs, Ship logs, Forum and Coach (`/coach`), plus Settings, from new `src/config/navigation.ts` (Next `Link`, active item from the URL). Other screens will be tabs inside these pages (owner to group them). Removed Quick Create, Inbox, Documents, Get Help, Search. User menu reads the session through new `src/app/dashboard/dashboard-sidebar.tsx` (placeholder while loading, retry on error, "Log in" when signed out), menu links to `/settings`, `/billing`, `/notifications`, working Log out.
- Verified: typecheck passes; ESLint and Prettier clean on the changed files. With a faked `get-session`, `/dashboard` at 1440 (light and dark) and 390 (dark, sheet open): every link's `href` checked, Dashboard marked active, user menu items checked. Fixed a hydration error from `SidebarMenuSkeleton`'s random width. Re-checked the trimmed list at 1440.
- Not verified / known issues: not tried with a real session or a real log out. Repo-wide `npm run lint` still fails on 2 errors in shadcn block files not touched here (`chart-area-interactive.tsx`, `hooks/use-mobile.ts`), and `format:check` flags other uncommitted block files (e.g. `dashboard/page.tsx`). `/dashboard` is outside an `(app)` group and has no auth guard. Header title still says "Documents" (block demo).
- Next: owner groups the remaining screens as tabs (update `docs/APP_FLOW.md` route map and section 4); auth guard for the app area.

### 2026-11-18 — Claude — Dashboard button for signed-in visitors

- Did (D39): `SiteHeader` takes `isSignedIn` and shows "Dashboard" (`dashboardLink` in `home.ts`, → `/dashboard`) instead of "Log in"/"Sign up" on desktop and in the mobile menu; new `src/app/(marketing)/marketing-header.tsx` reads `useSession` and is used by the marketing layout. New e2e test in `cta.spec.ts` (fakes `get-session`).
- Verified: lint, typecheck, build; e2e `cta.spec.ts` 7/7 (dev server on :3000). With a faked session: `/pricing` header at 1440 shows only "Dashboard"; mobile menu at 390 shows "Dashboard" and no Log in/Sign up. 0 console errors.
- Not verified / known issues: not tried with a real signed-in session. `/dashboard` 404s until it is built (owner's choice). Signed-in visitors briefly see "Log in"/"Sign up" before the session check finishes, and every marketing page load calls `get-session` (slow when the Render API is asleep, but it never blocks the page).
- Next: build `(app)/dashboard`.
- Questions for the owner: none.

### 2026-11-18 — Claude — Log in / Sign up replace the waitlist buttons

- Did (D38): header shows "Log in" (text link) and "Sign up" (shine button), also in the mobile menu; hero, Features hero, Seasons, both plan cards, final CTA and footer say "Get started" → `/signup` (footer adds "Log in"); `home.ts` has `getStartedLink`, `logInLink`, `signUpLink` instead of `waitlistLink`/`showWaitlist`; `PageHero` prop renamed `withGetStarted`; `/waitlist` page deleted and redirected 308 to `/signup`; removed from `site.ts` (and `waitlistVisible`); `lastModified` of `/`, `/features`, `/pricing` set to 2026-11-18. New e2e `cta.spec.ts` replaces `waitlist.spec.ts`.
- Verified: Prettier on changed files, lint, typecheck, build (no `/waitlist` route). e2e `e2e/marketing` 16/16 (run against the dev server on :3000): header links, "Get started" → `/signup` and no waitlist links on `/`, `/features`, `/pricing`, `/waitlist` redirect, sitemap. Looked at `/` light 1440 (header, hero) and dark 390 with the mobile menu open; no horizontal scroll; 0 console warnings.
- Not verified / known issues: the rest of the e2e suite was not run. `features/waitlist` is now dead code (kept on purpose). Prettier also converted some untouched marketing files from CRLF to LF on disk (git normalises line endings, so they show no diff).
- Next: decide whether to delete `features/waitlist` and the backend waitlist endpoints.
- Questions for the owner: none.

### 2026-11-18 — Claude — Onboarding (/onboarding)

- Did (D37): `features/onboarding` (types, content, `FIXTURE:` service, hooks: wizard state, live handle check, actions; components: wizard shell with Back/dots/Skip, seven steps, finish screen, skeleton, load error); `/onboarding` page (noindex) and `onboarding-screen.tsx` composing it with `auth`. Auth: `signOut` service, `useSignOut`, `useRequireSession`, `SwitchAccountButton`; verification and new GitHub accounts now land on `/onboarding`. Added shadcn textarea, checkbox, radio-group, toggle, skeleton (no new dependencies). `GitHubMark` moved to `components/shared/`.
- Verified: Prettier on changed files, lint, typecheck, build (`/onboarding` static). Playwright on the dev server: signed out → redirected to `/login` (real `get-session`); with a faked session (route mock in the test browser only) walked every step at 1440 light: handle prefilled and available, URL fills "Launch Pilot", GitHub connect, situation + skills, focus seeds 3 tasks, own task added, untick updates "Lock in 3 tasks", Finish disabled until consent, "Day 1" screen; focus moves to each step heading. 390 dark: taken-handle error, focus step; no horizontal scroll; 0 console errors.
- Not verified / known issues: not tried with a real new account (verification email, GitHub `newUserCallbackURL`). Nothing is saved: all onboarding data is fixture-only and lost on refresh. Returning users are not yet redirected to `/onboarding` when incomplete (needs `GET /onboarding/status`). No e2e specs. `npm run format:check` still fails on older CRLF files not touched here.
- Next: backend onboarding endpoints and profile fields; then replace the `FIXTURE:` services and add the onboarding redirect rule (FR-ONB-1).
- Questions for the owner: confirm the TO CONFIRM items in D37 (handle rules, limits, consent wording).

### 2026-11-17 — Claude — Auth connected to better-auth (/login, /signup, /verify-email)

- Did (D36): `authClient` in `src/services/api-client.ts` (better-auth `{ code, message }` errors become `ApiError`); `features/auth` types, `auth-service.ts`, hooks (`useSession`, `useSignIn`, `useSignUp`, `useGithubSignIn`, `useResendVerification`, `useRedirectIfSignedIn`), `lib/auth-config.ts` and `lib/pending-verification.ts` (`sessionStorage`); login and signup forms now submit (useFormHandler, pending states, error alerts, 8–128 character passwords), shared `GithubSignInButton`, `GithubErrorAlert` for `/login?error=…`; new noindex `/verify-email` page with resend. Updated `API_CONTRACT.md` and `STATE_AND_DATA.md`.
- Verified: format (changed files), lint, typecheck, build (`/login`, `/signup`, `/verify-email` static). Playwright on the dev server at :3000: /login wrong-password flow shows an error alert; /login?error=access_denied shows the GitHub message; /verify-email without and with a saved address (light 1440, dark 390); /signup dark 390; no horizontal scroll; 0 console warnings or errors. A direct browser call to the local API (:8000) returned 401 `{ message, code }` with CORS working.
- Not verified / known issues: from the app, the sign-in request never reached the API ("could not reach the server"), because `NEXT_PUBLIC_AUTH_BASE_URL` was not defined when `next dev` started (confirmed in the browser bundle: the API URL is inlined, the auth URL is not; `.env.local` not read, by rule). Follow-up: a fault before sending (such as a missing base URL) is now `CLIENT_ERROR` and logged to the console in development, instead of the misleading "could not reach the server". So real sign-up, sign-in, verification link and GitHub round trip are untested. Production cookies across `startupsclub.one` and the API host are still open (D18, backend AUTH.md section 6). No e2e specs added.
- Next: set `NEXT_PUBLIC_AUTH_BASE_URL=http://localhost:8000`, restart `next dev` and test the full flows; sign-out, password reset and the `(app)` route guard when the app area is built.
- Questions for the owner: none.

### 2026-11-17 — Claude — Waitlist count shows on load (bug fix)

- Cause: the API is on Render, which sleeps when idle; on the live site the count request took 8–38 s, and `WaitlistCount` renders nothing while loading. By the time someone submitted, the API was awake, so the count only seemed to appear after a submit. It also refetched on window focus and after 30 s.
- Did (D35): new `waitlist-count-cache.ts` (`"use cache"`, 5 min on success, 1 min on failure, 20 s timeout); `getWaitlistCount` takes an optional `timeout`; `/waitlist` page passes `initialCount` to `WaitlistCount`; `useWaitlistCount` is disabled when a server count exists and never refetches by itself; `useJoinWaitlist` refreshes the count with `fetchQuery` after a signup. `STATE_AND_DATA.md` notes the exception.
- Verified: lint, typecheck, build (with a local mock API on :8000: `/waitlist` revalidate 5m; with the API down: 1m and the build still passes). Against the mock: the count (42) is in the server HTML; no count request on load; submitting sent one POST and one GET and the count became 43; a focus event caused no refetch; 0 console warnings. e2e `waitlist.spec.ts` + `seo.spec.ts` 20/20 with the API down (browser fallback path).
- Not verified / known issues: not tested against the real Render API (a production deploy is needed). The e2e tests cover only the browser fallback, because Playwright cannot mock the server-side fetch; a build made while the API is reachable bakes in a real count. Right after a deploy, the first count may be missing for up to a minute if Render was asleep during the build (then the browser fetch shows it once the API answers).
- Next: consider keeping the Render service awake (paid instance or a scheduled ping) so the cache refresh is fast too.
- Questions for the owner: none.

### 2026-11-17 — Claude — SEO metadata for /login and /signup

- Did: owner-approved titles and descriptions (D34) in a new `authRoutes` list in `src/config/site.ts` with `getAuthRoute()`; both pages use `createPageMetadata(getAuthRoute(...))` (canonical, Open Graph, Twitter, share image). New `listedPublicRoutes` feeds `sitemap.ts` and `llms.txt/route.ts`, so both pages are listed (llms.txt under "## Optional").
- Verified: lint, typecheck, build; e2e `seo.spec.ts` and `waitlist.spec.ts` 20/20 (the SEO spec now covers /login and /signup through the sitemap: one h1, title ≤ 60, description 120–160, unique, canonical, og:image alt); checked the rendered sitemap, llms.txt, title, description, canonical, og and twitter tags on both pages.
- Not verified / known issues: listed in the sitemap while both forms still do nothing (owner's choice).
- Next: none for SEO.
- Questions for the owner: none.

### 2026-11-17 — Claude — Sign-up screen (/signup)

- Did: `auth-page.tsx` became the shared `auth-shell.tsx` (title, description, form and a link to the other auth page as props); the GitHub mark moved to `github-mark.tsx`; new `signup-form.tsx` (name, email, password with `autoComplete="new-password"`, "Create account") and `src/app/(auth)/signup/page.tsx` (title "Sign up", canonical `/signup`). `/login` and `/signup` now link to each other (D33).
- Verified: lint, typecheck, build (`/login` and `/signup` static), Prettier on changed files; production server: /signup at light 1440 and dark 390, /login at dark 390; Enter and the button keep the URL clean; the cross-links navigate; one h1; no horizontal scroll; 0 console errors.
- Not verified / known issues: e2e suite not run; no e2e specs for /login or /signup. Same preload warnings as /login (Grifter font, a CSS chunk).
- Next: connect both forms to `features/auth` hooks and services once `/api/auth/*` is confirmed; `/verify-email` and `/reset-password` (noindex per D4).
- Questions for the owner: none.

### 2026-11-17 — Claude — Log-in screen (/login), pre-launch

- Did: `src/features/auth/components/auth-page.tsx` (adapted 21st.dev auth-page, D33) and `src/app/(auth)/login/page.tsx` (metadata "Log in", canonical `/login`). Server component, no new dependencies, `button.tsx`/`input.tsx` untouched.
- Verified: lint, typecheck, build (`/login` static); Prettier on the new files; production server at 1440 and 390 in light and dark: no horizontal scroll, 0 console errors.
- Not verified / known issues: `npm run format:check` reports 52 files that already failed before this change (likely CRLF line endings from `core.autocrlf=true`). Two console warnings on /login: the marketing-only Grifter font and a CSS chunk are preloaded but unused. e2e suite not run; no e2e spec for /login yet. No `(auth)` `error.tsx` yet (MONITORING.md).
- Next: wire to `features/auth` hooks and services once the `/api/auth/*` routes are confirmed; `/signup`, `/verify-email`, `/reset-password` (noindex per D4).
- Questions for the owner: none.
- Update (owner): removed the "Log-in opens at launch" notice and the disabled state. The form moved to `login-form.tsx` (client) and blocks submit; verified that Enter and the button keep the URL clean, 0 console errors, light 1440 and dark 390.

### 2026-11-15 — Claude — Waitlist count on /waitlist

- Did: installed the shadcn Avatar component; added `getWaitlistCount` (service), `useWaitlistCount` (query hook), `WaitlistCount` (AvatarGroup + "N+ people waiting", number formatted as 1,234) above the form; a successful signup refetches the count (D32). Three e2e tests added.
- Verified: lint, typecheck, Prettier on changed files; waitlist e2e 16/16 with a mocked API; looked at /waitlist with a mocked count in light 1440 and dark 390 (no console warnings, no horizontal scroll).
- Not verified / known issues: not run against the real backend (needs CORS and `NEXT_PUBLIC_API_BASE_URL`). The avatar images load from github.com.
- Next: replace the example avatars when real images exist.
- Questions for the owner: none.

### 2026-11-15 — Claude — Custom domain www.startupsclub.one

- Did: recorded the new production URL `https://www.startupsclub.one` in `docs/DECISIONS.md` (D14 updated, D18 narrowed to the API hostname and cookie domain) and `docs/DEPLOYMENT.md`. No code change: the site URL comes only from `NEXT_PUBLIC_SITE_URL` (D1), so canonical URLs, Open Graph, JSON-LD, sitemap.xml, robots.txt and llms.txt follow it.
- Verified: searched the repository; the old URL appears only in docs (and in the dated history below, left as it was).
- Not verified / known issues: Vercel's Production `NEXT_PUBLIC_SITE_URL` must be changed to `https://www.startupsclub.one` and the site redeployed; the domain set-up in Vercel (apex redirect to www) and Google Search Console were not checked.
- Next: the backend's CORS origin list needs `https://www.startupsclub.one`.
- Questions for the owner: the API hostname (D18).

### 2026-11-14 — Claude — Waitlist form connected to the API

- Installed `axios` and `@tanstack/react-query` (owner's request). Added `services/api-client.ts`, `lib/api-error.ts`, `types/api-types.ts`, `lib/query-client.ts` and `QueryProvider` (root layout) (D31).
- New feature `features/waitlist`: `types/waitlist-types.ts`, `services/waitlist-service.ts` (`joinWaitlist`, POST /waitlist), `hooks/use-join-waitlist.ts` (useMutation, onSuccess/onError), `hooks/use-waitlist-form.ts` (`useFormHandler<WaitlistFormData>`), `components/waitlist-form.tsx` and `lib/waitlist-content.ts` (moved from `features/marketing`). Field renamed `otherRole` -> `roleOther` to match the API DTO. Inputs carry the API's length limits.
- `.env.example` and CI: API port 4000 -> 8000. D27 closed.
- e2e: 6 new form tests mock the API in the browser (success and request body, Other, 409, 400 field error, network failure, pending state). Checks: lint, typecheck, build, e2e 23/23 (last full run 21 + the 2 fixed tests rerun). Looked at success and error states at 1440 and 390, light and dark.
- **Not verified against the real backend**: it has no CORS yet (owner is adding it), so a browser on :3000 cannot call :8000 until then.

### 2026-11-14 — Claude — Generic form hook

- Did: completed `useFormHandler<T>` in `src/hooks/use-form-handler.tsx` (returns `formData`, `setFormData`, `onChange`, `onFileChange`). Recorded D30; updated the forms line in `docs/FRONTEND_GUIDELINES.md`. Its types (`FieldElement`, `UseFormHandlerResult`) live in `src/types/form-types.ts` (owner request).
- Verified: lint and typecheck pass; the new file passes Prettier.
- Not verified / known issues: `format:check` reports 56 other files that were already unformatted before this change. Not used by any form yet, so not checked in a browser.
- Next: switch the waitlist form to the hook if wanted; decide on validation.

### 2026-11-13 — Claude — Theme-aware logo

- `Logo` shows `logo-black.png` in light mode and `logo-white.png` in dark mode. The new `compactOnMobile` prop (used only by the site header, as the owner chose) shows `logo-icon-black.png` / `logo-icon-white.png` below `sm` (640px). The switching is done in CSS, so the server render is correct and nothing flashes. Also fixed the wrong 120×120 intrinsic size (the real files are 1099×154 and 2048×2048).
- Checks: format, lint, typecheck, build. On the production build I checked the header and footer at 1440 and 390 in light and dark: the expected image showed in each case and the console had no warnings.
- Known issue: the running dev server had not picked up the new Tailwind classes, so restart `npm run dev` if the logo looks wrong locally.

### 2026-11-14 — Claude — Waitlist role field

- Added shadcn Select (`src/components/ui/select.tsx`, via the shadcn CLI). The waitlist form now has a required Role select (Founder, Developer, Other); choosing Other shows a required "Your role" text field, which is removed again for any other choice. Submitted as `role` and `otherRole`; still not stored or sent (D27). Copy in `content/waitlist.ts` (labels and the "e.g. Designer" placeholder drafted by Claude).
- e2e: role required, Other reveals the field and hides it again; the URL test now picks a role so the submit really goes through. Looked at /waitlist at 1440 (light) and 390 (dark), mouse and keyboard; no console errors.

### 2026-11-14 — Claude — Waitlist buttons shown again

- Owner request: `waitlistVisible` in `src/config/site.ts` set back to `true`. Every "Join waitlist" button is back (header, mobile menu, home hero, Features hero, Seasons, both plan cards, final CTA, footer), and /waitlist is listed in the sitemap and llms.txt again. Entries are still not stored (D27).
- e2e restored to expect the header button, plus a check that the sitemap lists /waitlist.

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
- Update (same day): production URL https://www.startupsclub.one recorded (D14) and deployment notes updated; a production build with that URL verified locally. The live site still serves the old template until this work reaches `main`.
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
