# Deployment and Repository Settings — StartupsClub Web

## 1. Environments

| Environment | Branch        | Host                              | Purpose                                        |
| ----------- | ------------- | --------------------------------- | ---------------------------------------------- |
| Local       | `dev/<name>`  | Developer machine (`npm run dev`) | Development.                                   |
| Staging     | `integration` | Vercel Preview deployment         | Shared testing after a pull request is merged. |
| Production  | `main`        | Vercel Production deployment      | Live site.                                     |

Pull requests and `dev/*` branches are **not** deployed. Code deploys only after a pull request
is merged into `integration` or `main` and every CI check passes on the merged commit
(`docs/DECISIONS.md` D19). The deployment URL appears in the workflow run's summary and on the
repository's Environments page.

Domains: the frontend and the API must share a parent domain so the session cookie works
(for example `app.<domain>` and `api.<domain>`). The site is currently live at
`https://startupsclub.vercel.app` (`docs/DECISIONS.md` D14). `vercel.app` cannot share cookies
with another host, so a custom domain is still needed before login works (D18).

## 2. Vercel setup

1. Import the GitHub repository into Vercel. Production branch: `main`.
2. Framework preset: Next.js. Build command `npm run build`. Install command `npm ci`.
3. Node version: 22.
4. Environment variables (Project Settings): `NEXT_PUBLIC_API_BASE_URL`,
   `NEXT_PUBLIC_AUTH_BASE_URL`, `NEXT_PUBLIC_SITE_URL`, per environment. No secrets.
   `NEXT_PUBLIC_SITE_URL` is **required in every environment** (the build fails without it):
   Production `https://startupsclub.vercel.app`; Preview can use the same value, because
   previews are always `noindex` and blocked in robots.txt (`VERCEL_ENV` is not `production`).
   Optional: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Production only).
5. **Deployments come from GitHub Actions, not from Vercel's Git integration.** `vercel.json`
   sets `git.deploymentEnabled: false`, and the `Deploy to Vercel` job in
   `.github/workflows/ci.yml` runs `vercel deploy` (Preview) for `integration` and
   `vercel deploy --prod` for `main`, after `Format, lint and types`, `Build` and
   `End-to-end tests` pass. One-time setup:
   - Vercel → Account Settings → Tokens: create a token scoped to the team that owns the project.
   - Get the IDs: run `npx vercel link` locally once, then read `orgId` and `projectId` from
     `.vercel/project.json` (git-ignored), or copy them from Project Settings → General.
   - GitHub → Settings → Secrets and variables → Actions: add `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
     `VERCEL_PROJECT_ID`.
   - GitHub creates the `preview` and `production` environments on the first run. Optional: add
     a required reviewer to `production` for a manual approval before each production deploy.
6. **Plan note:** Vercel's free (Hobby) plan is limited to personal, non-commercial use. A
   commercial startup will need a paid plan. Confirm before launching with real customers.

## 3. GitHub ruleset (public repository)

Settings → Rules → Rulesets → New branch ruleset. Create two rulesets (or one targeting both):

**Ruleset "Protect main" and "Protect integration"** — target branches `main` and `integration`:

- Restrict deletions.
- Block force pushes.
- Require a pull request before merging:
  - Required approvals: 1 (the owner). Require review from Code Owners (`.github/CODEOWNERS`).
  - Dismiss stale approvals on new commits. Require conversation resolution.
- Require status checks to pass, branches up to date before merging. Required checks:
  - `Branch policy`
  - `Format, lint and types`
  - `Build`
  - `End-to-end tests`
- Block direct pushes (implied by the pull-request requirement; no bypass list, or the owner
  only if the owner accepts the risk).
- Limit merge methods to squash or merge commit (owner's choice).

**Branch naming:** if the plan allows "Restrict branch names" in the ruleset, allow only
`main`, `integration` and `dev/*`. Otherwise the `Branch policy` Action covers pull requests, and
a local Husky hook covers commits. **Check what your plan allows.**

Also enable: secret scanning and push protection, Dependabot alerts, private vulnerability reporting.

Important: the checks (`Branch policy`, `Format, lint and types`, `Build`, `End-to-end tests`) only
appear in the ruleset's list after they have run once on a pull request.

## 4. Release flow

1. Work merged into `integration` through pull requests; staging verified.
2. Owner opens a pull request `integration` → `main`.
3. All checks pass; owner approves and merges.
4. CI runs again on the merged commit; when every check passes, the `Deploy to Vercel` job
   deploys `main` to production. If a check fails, nothing is deployed.
5. Smoke test production (Playwright MCP or manual): marketing pages, login, dashboard.
6. Check Sentry: the new release appears, source maps resolved, and no new unresolved issues
   appear for 24 hours (`docs/MONITORING.md`).
7. Record the release in `docs/PROGRESS.md` (and the changelog page when it exists).

## 5. Rollback

Vercel keeps previous deployments. Promote the last good deployment from the Vercel dashboard
(instant rollback), then fix forward through a normal pull request. Do not rewrite `main`.

## 6. Pre-deployment checklist

- [ ] CI is green on `main`
- [ ] Environment variables set for production, none secret
- [ ] API base URL points to production and CORS on the backend allows this origin
- [ ] Cookies work across the two subdomains (login works end to end)
- [ ] Marketing pages pass a Lighthouse and accessibility spot check
- [ ] Security headers configured and verified
- [ ] 404 and error pages tested
- [ ] All `FIXTURE:` markers resolved (after milestone M8)
- [ ] Sentry: DSN and environment variables set per Vercel environment, `SENTRY_AUTH_TOKEN` set
      (Vercel only), source maps upload and are deleted from the bundle, uptime monitors and alerts
      active, backend CORS allows `sentry-trace` and `baggage`
- [ ] Privacy page and onboarding consent mention error and performance diagnostics
