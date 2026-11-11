# StartupsClub — Web (frontend)

An AI-powered accountability and community platform for startup founders and developers.
Members post a daily standup, log what they shipped, belong to a small club, and compete in
six-week seasons. This repository is the **Next.js frontend**; the NestJS API lives in a separate
repository.

> Final year project of Uneeb Bhatti, Hadia Abid and M. Ahtisham Shahid, with the aim of becoming a
> real startup. Supervisor: Aamiq Anayat.

## Tech stack

Next.js (App Router) · TypeScript (strict, no `any`) · shadcn/ui · Tailwind CSS · Inter ·
TanStack Query · Axios · next-themes (light/dark) · GSAP and Locomotive Scroll (marketing only) ·
Playwright · Sentry · Husky · Prettier · ESLint · GitHub Actions · Vercel.

## Quick start

```bash
git clone <repository-url>
cd startupsclub-web
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. Full setup (Node 22, MCP servers, Playwright, Taste skill):
`docs/ENVIRONMENT.md`.

## Scripts

`npm run dev` · `build` · `start` · `lint` · `format` · `format:check` · `typecheck` · `test:e2e`

## Branch workflow

```
dev/<name>  →  pull request  →  integration  →  pull request  →  main
```

No direct commits to `main` or `integration`. See `CONTRIBUTING.md` (and `docs/TEAM_GUIDE.md` for a
plain-language walkthrough).

## Documentation

| File                          | What it covers                                          |
| ----------------------------- | ------------------------------------------------------- |
| `AGENTS.md`, `CLAUDE.md`      | Rules for AI coding agents (the single source of truth) |
| `docs/PRD.md`                 | Product requirements                                    |
| `docs/REQUIREMENTS.md`        | Functional and non-functional requirements              |
| `docs/USER_STORIES.md`        | User stories with acceptance criteria                   |
| `docs/APP_FLOW.md`            | Routes, screens and flows of the app                    |
| `docs/LANDING_PAGE.md`        | Marketing site spec                                     |
| `docs/DESIGN_SYSTEM.md`       | Tokens, typography, components, buttons, theming        |
| `docs/ACCESSIBILITY.md`       | WCAG 2.1 AA rules and checks                            |
| `docs/TRD.md`                 | Stack, scripts, ESLint/TypeScript rules, CI             |
| `docs/ARCHITECTURE.md`        | Folder structure, layering, data flow                   |
| `docs/FRONTEND_GUIDELINES.md` | Day-to-day coding rules                                 |
| `docs/STATE_AND_DATA.md`      | TanStack Query, Axios, fixtures                         |
| `docs/API_CONTRACT.md`        | The NestJS API as the frontend sees it                  |
| `docs/TESTING.md`             | Playwright tests and browser checks                     |
| `docs/ENVIRONMENT.md`         | Setup, env variables, MCP servers                       |
| `docs/DEPLOYMENT.md`          | Vercel, GitHub ruleset, release and rollback            |
| `docs/MONITORING.md`          | Sentry: error tracking, tracing, privacy rules, alerts  |
| `docs/ROADMAP.md`             | Milestones                                              |
| `docs/PROGRESS.md`            | Live status log                                         |
| `docs/DECISIONS.md`           | Decisions, items to confirm, open questions             |
| `docs/TEAM_GUIDE.md`          | Plain-language guide for teammates                      |
| `SECURITY.md`                 | Security policy and rules                               |

## Licence

To be decided by the owner.
