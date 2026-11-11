# Monitoring and Error Tracking — StartupsClub Web

Owner decision (11 Nov 2026): **Sentry on both the backend and the frontend.** This file covers
the frontend and lists what the backend repository must match so one error can be followed from
the browser to the API.

> The owner chose the tool but not which Sentry features to switch on. Every feature setting below
> is a **proposed default, TO CONFIRM** (see `docs/DECISIONS.md`, C17–C24). Do not enable a feature
> that is marked OFF without approval.

## 1. What we monitor and why

| Signal                 | Why it matters for StartupsClub                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| Unhandled errors       | A broken standup form or composer silently loses a member's daily check-in.                      |
| Performance traces     | Slow dashboard or club board loads hurt the daily habit loop.                                    |
| Releases               | Know which deploy introduced a problem; mark regressions.                                        |
| Alerts                 | The team is small; problems must reach the owner without anyone watching a dashboard.            |
| Backend scheduled jobs | Standup reminders, season changes and weekly reports run as jobs; a silent failure is invisible. |

## 2. Sentry structure

- One Sentry **organisation**, two **projects**: the web project (platform Next.js) and the API
  project (platform NestJS). Names proposed: `startupsclub-web`, `startupsclub-api` (**TO CONFIRM**).
- Environments: `production` (`main`), `staging` (`integration`), `preview` (pull-request
  deployments). `development` (local) sends **nothing**: the DSN is empty locally and in CI.
- Release name: the Git commit SHA. Vercel provides it as `VERCEL_GIT_COMMIT_SHA`; the Sentry
  Next.js plugin should pick it up (verify at setup).

## 3. Feature settings (proposed defaults — TO CONFIRM)

| Feature                             | Setting                                                                                 | Reason                                                                                                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Error tracking                      | **ON** (client, server, edge)                                                           | Core purpose.                                                                                                                                                   |
| Source maps                         | **ON** for production and staging builds, deleted from the deployed bundle after upload | Readable stack traces without publishing source maps.                                                                                                           |
| Performance tracing                 | **ON**, `tracesSampleRate` 0.1 in production, 1.0 elsewhere                             | Keeps within the free quota; raise later if needed.                                                                                                             |
| Distributed tracing                 | **ON**, to the API origin only                                                          | Follow one request from browser to NestJS (section 7).                                                                                                          |
| Session Replay                      | **OFF**                                                                                 | Replays could capture standups, private items and messages. Revisit only with full masking and owner approval.                                                  |
| Logs (`enableLogs`)                 | **OFF**                                                                                 | Avoids personal data in logs and quota use.                                                                                                                     |
| User feedback widget                | **OFF**                                                                                 | Needs theming and accessibility work; decide later.                                                                                                             |
| `sendDefaultPii`                    | **false**                                                                               | No IP addresses, cookies or request headers by default.                                                                                                         |
| Profiling                           | **OFF**                                                                                 | Not needed yet.                                                                                                                                                 |
| Tunnel route (`/monitoring-tunnel`) | **ON**                                                                                  | Ad blockers (common among developers, our audience) block `sentry.io`; the tunnel sends events through our own domain. Costs a few Vercel function invocations. |
| Uptime monitor                      | **ON** for the production home page and the app login page                              | Detect outages before users do.                                                                                                                                 |
| Cron monitors                       | **Backend repository**                                                                  | Reminder, season and report jobs belong to the NestJS BullMQ setup.                                                                                             |
| Alerts                              | New issue, regression, and error spike, by **email to the owner**                       | Slack or other channels can be added later.                                                                                                                     |

## 4. Files (created at scaffold, with approval)

Follow Sentry's current Next.js App Router setup. Locations follow the Next.js `src/` convention;
check Sentry's documentation when creating them.

| File                        | Purpose                                                                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `instrumentation-client.ts` | Browser `Sentry.init`; exports `onRouterTransitionStart` for navigation traces.                                                               |
| `sentry.server.config.ts`   | Node.js server init.                                                                                                                          |
| `sentry.edge.config.ts`     | Edge runtime init (keep minimal).                                                                                                             |
| `instrumentation.ts`        | `register()` loads the server or edge config; exports `onRequestError = Sentry.captureRequestError`. This is the step people most often miss. |
| `app/global-error.tsx`      | Root error boundary; reports the error and shows a friendly screen.                                                                           |
| `app/**/error.tsx`          | Error boundary per route group (`(marketing)`, `(auth)`, `(app)`).                                                                            |
| `next.config.ts`            | Wrapped with `withSentryConfig` (org, project, tunnel route, source-map settings).                                                            |

### The setup wizard

`npx @sentry/wizard@latest -i nextjs` can create these files, but it changes several files at once.
If it is used (owner approval first):

1. Run it on a `dev/<name>` branch and review **every** change in the diff.
2. Delete the example page and example API route it adds.
3. It creates `.env.sentry-build-plugin` holding the auth token. That file is git-ignored and
   **must never be read by an AI agent or committed** (it is in the deny list in
   `.claude/settings.json`).
4. Apply this repository's conventions to the generated files: strict types, no `any`, TSDoc
   `@packageDocumentation` after imports.

## 5. Configuration rules (all `Sentry.init` calls)

```ts
// Shape only. Values come from environment variables and the table in section 3.
{
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,          // empty => Sentry does nothing
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  tracesSampleRate: /* 0.1 in production, 1.0 elsewhere */,
  sendDefaultPii: false,
  tracePropagationTargets: [/* the API origin only */],
  ignoreErrors: [/* ResizeObserver loop, cancelled requests, browser-extension noise */],
  denyUrls: [/* browser extension URLs */],
  beforeSend(event) { /* scrub per section 6 */ return event; },
}
```

- A missing or empty DSN disables Sentry. Never hard-code the DSN.
- Do not change sample rates, integrations or scrubbing without approval.

## 6. Privacy: what must never reach Sentry

StartupsClub holds standups, private items, messages and AI coaching. Treat telemetry as a
privacy surface.

1. **User context:** `Sentry.setUser({ id })` with the opaque user ID **only**. Never email, name,
   handle, IP address or plan details beyond a `FREE`/`PAID` tag. Clear it on sign-out.
2. **No content in error messages.** Do not build an `Error` message from standup text, post text,
   chat messages, names or emails.
3. **Scrub in `beforeSend`:** remove request bodies, cookies and `Authorization` headers; strip
   query strings that may carry tokens (verification and reset links); drop breadcrumbs that
   contain form values.
4. **No Session Replay** unless the owner approves with `maskAllText` and `blockAllMedia` and a
   written privacy review.
5. **Auth routes:** never attach bodies of `/api/auth/*` requests to events.
6. **Disclosure:** the Privacy page and the onboarding consent text must say that error and
   performance diagnostics are collected by Sentry. Wording must come from the owner.
7. **Public repository:** the DSN is public by design and may appear in the browser. The
   **auth token** (`SENTRY_AUTH_TOKEN`) is a secret: it exists only in Vercel (and GitHub, if CI
   ever uploads source maps), never in a committed file.

## 7. Connecting frontend and backend

- **Distributed tracing:** the browser SDK adds the `sentry-trace` and `baggage` headers to
  requests whose URL matches `tracePropagationTargets`. Set it to the API origin only.
- **Backend CORS must allow both headers** (`sentry-trace`, `baggage`) in its allowed request
  headers, and no proxy or gateway may strip them. Without this, browser calls to the API fail
  CORS preflight once tracing is on. Tell the backend owner (the same person: Uneeb).
- Axios uses XHR, which the Sentry browser SDK instruments, so no extra Axios code is needed.
- **Same release and environment names** in both projects so issues can be compared.

### Backend alignment checklist (for the NestJS repository)

- Separate Sentry project; DSN in the server environment.
- Initialise Sentry **before** the Nest application is created (first import in `main.ts`).
- Global exception filter that reports unexpected errors (5xx) and ignores expected ones
  (validation, 401, 403, 404).
- `sendDefaultPii: false`; scrub request bodies; user context is the user ID only.
- Instrument Prisma and queue jobs; add **cron monitors** for reminder, season and weekly-report jobs.
- Release = commit SHA; environments `production`, `staging`.
- CORS allows `sentry-trace` and `baggage`.

## 8. What the frontend reports, and what it does not

| Report as an issue                                                    | Do not report as an issue (breadcrumb at most)           |
| --------------------------------------------------------------------- | -------------------------------------------------------- |
| Rendering errors caught by error boundaries                           | Validation errors (`400`, `422`) and form mistakes       |
| Unexpected API failures: `5xx`, network failures, malformed responses | `401` (redirect to login), `403` (upgrade prompt), `404` |
| Failed mutations that were not handled by the UI                      | Cancelled requests and navigation aborts                 |
| Unhandled promise rejections                                          | Expected `429` rate limits (show a message)              |

Implementation rules:

- Capture with `Sentry.captureException(error)` inside error boundaries and in one global handler
  on the TanStack Query `QueryCache` and `MutationCache` (`onError`, defined in `lib/query-client.ts`), which applies the table above
  to `ApiError.status`. Do not scatter `captureException` calls through components.
- Add small tags: `route_group` (`marketing`, `auth`, `app`), `feature` (folder name), `plan`
  (`FREE` or `PAID`). No free text.
- Never swallow an error silently. Either handle it in the UI **and** apply the table above, or
  let it reach the boundary.
- Error screens are friendly, tell the user what to do next and show the **event ID** so a user can
  quote it when asking for help.

## 9. Environment variables

| Name                             | Public?    | Purpose                                                           |
| -------------------------------- | ---------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SENTRY_DSN`         | Yes        | Where events are sent. Empty locally and in CI.                   |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | Yes        | `production`, `staging` or `preview`, set per Vercel environment. |
| `SENTRY_ORG`                     | No\*       | Organisation slug, build time only. \*Not secret.                 |
| `SENTRY_PROJECT`                 | No\*       | Project slug, build time only. \*Not secret.                      |
| `SENTRY_AUTH_TOKEN`              | **Secret** | Source-map upload at build time. Vercel environment only.         |

## 10. Local development and testing

- Locally and in CI the DSN is empty, so no events are sent and tests never create noise.
- To verify the setup, create a **separate development Sentry project**, put its DSN in
  `.env.local`, trigger a deliberate test error, confirm it appears with a readable stack trace,
  then remove the test code before committing. Do not leave test pages or routes in the repository.
- Check three things after the first production deploy: the release appears, source maps resolved
  (stack traces show real file names), and the environment tag is correct.

## 11. Operating routine

- Owner reviews new issues at least weekly, assigns or resolves them, and silences known noise
  with `ignoreErrors` (through a pull request, not in the Sentry UI only).
- Every release: confirm no new unresolved issues for 24 hours; mark the issue fixed in the pull
  request that fixes it.
- Watch the quota. If volume rises, lower `tracesSampleRate` first, then add sampling for noisy
  errors. Turn on spend protection so a spike cannot create a surprise bill.

## 12. Open questions

See `docs/DECISIONS.md` (O13–O16): Sentry plan and quota, alert destinations beyond email, whether
a user feedback widget is wanted, and the wording for the privacy disclosure.