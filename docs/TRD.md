# Technical Requirements Document (TRD) — StartupsClub Web

## 1. Stack

| Area                       | Choice                                                                                         | Notes                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Framework                  | Next.js (latest stable at scaffold), App Router                                                | Frontend only. No Route Handlers that hold business logic.              |
| Language                   | TypeScript, `strict`                                                                           | No `any`.                                                               |
| UI                         | shadcn/ui on Tailwind CSS                                                                      | Tailwind version follows what `create-next-app` and shadcn generate.    |
| Fonts                      | Inter (Google Fonts, `next/font/google`); marketing headings use a different sans-serif (OPEN) | See `docs/DESIGN_SYSTEM.md`.                                            |
| Server state               | TanStack Query                                                                                 | Caching, loading and error states, mutations.                           |
| HTTP                       | Axios                                                                                          | One instance in `src/services/api-client.ts`.                           |
| Client state               | React state, context and URL state                                                             | **No Zustand.**                                                         |
| Theming                    | `next-themes`, shadcn dark mode (class strategy)                                               | Light and dark.                                                         |
| Icons                      | Lucide (`lucide-react`)                                                                        |                                                                         |
| Animation (marketing only) | GSAP and Locomotive Scroll                                                                     | Never in `(app)`.                                                       |
| Forms                      | react-hook-form, zod, `@hookform/resolvers`                                                    | Used by shadcn's Form component. **TO CONFIRM.**                        |
| Monitoring                 | Sentry (`@sentry/nextjs`)                                                                      | Errors, tracing, releases. Both repositories. See `docs/MONITORING.md`. |
| Quality                    | ESLint, Prettier, `prettier-plugin-tailwindcss`, `eslint-plugin-tsdoc`                         |                                                                         |
| Git hooks                  | Husky and lint-staged                                                                          | Local only; CI is the real gate.                                        |
| Testing                    | Playwright (`@playwright/test`)                                                                | Unit-test tool not chosen.                                              |
| CI                         | GitHub Actions                                                                                 | `.github/workflows/`.                                                   |
| Hosting                    | Vercel                                                                                         | See `docs/DEPLOYMENT.md`.                                               |
| Package manager            | npm                                                                                            | **TO CONFIRM** (chosen to match the `npx` commands in use).             |
| Node                       | 22 (`.nvmrc`)                                                                                  | The Taste skill needs Node 22 or newer.                                 |

"Latest" versions are resolved when the project is scaffolded. Record the actual versions in
`docs/PROGRESS.md` and do not upgrade major versions without approval.

## 2. Scaffolding commands (run once, by the owner or with approval)

```bash
npx create-next-app@latest startupsclub-web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npx shadcn@latest init
npm i axios @tanstack/react-query next-themes lucide-react gsap locomotive-scroll
npm i @sentry/nextjs               # then set up Sentry as docs/MONITORING.md says (wizard only with approval)
npm i -D husky lint-staged prettier prettier-plugin-tailwindcss eslint-plugin-tsdoc @playwright/test
npx husky init
npx playwright install chromium
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

Run them in the folder that already holds these documents so the files merge. The prompts of
`create-next-app` must be answered as above. Confirm each command with the owner first.

## 3. `package.json` scripts (required names)

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint . --max-warnings=0",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "typecheck": "tsc --noEmit",
  "test:e2e": "playwright test",
  "prepare": "husky"
}
```

CI and Husky call these exact names.

## 4. TypeScript

- `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitOverride": true`,
  `"forceConsistentCasingInFileNames": true`.
- Path alias `@/*` → `src/*`.
- Types for the API live in `src/types/` (shared) and `src/features/<feature>/types/` (per feature).

## 5. ESLint (rules added to the flat config generated by Next.js)

```js
// eslint.config.mjs — add to the generated config
{
  plugins: { tsdoc },
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/ban-ts-comment": ["error", { "ts-expect-error": "allow-with-description", "ts-ignore": true, "ts-nocheck": true }],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "tsdoc/syntax": "warn",
  },
}
```

`--max-warnings=0` turns warnings into failures in CI. `src/components/ui/**` (shadcn generated)
may be excluded from the TSDoc rule. "TSDoc block after imports" is a review rule: ESLint cannot
check position, so reviewers and the AGENTS.md rule enforce it.

## 6. Environment variables

| Name                             | Public?         | Purpose                                                                        |
| -------------------------------- | --------------- | ------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL`       | Yes             | NestJS REST base, including `/api/v1`.                                         |
| `NEXT_PUBLIC_AUTH_BASE_URL`      | Yes             | Origin that serves `/api/auth/*`.                                              |
| `NEXT_PUBLIC_SITE_URL`           | Yes             | Absolute URL of the site.                                                      |
| `NEXT_PUBLIC_SENTRY_DSN`         | Yes             | Sentry DSN (public by design). Empty locally and in CI.                        |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | Yes             | `production`, `staging` or `preview`.                                          |
| `SENTRY_ORG`, `SENTRY_PROJECT`   | No (not secret) | Build-time identifiers for source-map upload.                                  |
| `SENTRY_AUTH_TOKEN`              | **No, secret**  | Source-map upload. Vercel environment variables only. Never in the repository. |
| `TWENTY_FIRST_API_KEY`           | **No**          | Developer's shell only, for the 21st.dev MCP. Never in the repo.               |

Validate required variables at startup in `src/lib/env.ts` (zod) and fail loudly.

## 7. API client

- Axios instance with `baseURL = NEXT_PUBLIC_API_BASE_URL`, `withCredentials: true`
  (cookie sessions across `app.` and `api.` subdomains).
- Response interceptor unwraps `{ data, meta }` and converts `{ error }` into a typed `ApiError`
  (`code`, `message`, `details`, `status`).
- `401` triggers a session refresh check and a redirect to `/login`; `403` is surfaced to the UI.
- No tokens in `localStorage` or in JavaScript. Auth is by httpOnly cookie only.
- Auth calls go to `NEXT_PUBLIC_AUTH_BASE_URL` + `/api/auth/*` **through the same Axios layer**.
  The better-auth client library is not used.
- Details: `docs/STATE_AND_DATA.md` and `docs/API_CONTRACT.md`.

## 8. Rendering strategy (to confirm)

- Marketing pages: static rendering. Pricing is hard-coded for now.
- App pages: client components with TanStack Query. Server-side prefetching is not used unless
  the owner approves it.

## 9. Performance and quality targets

- Marketing: measure with Lighthouse; target 90+ on mobile once content is final.
- Images through `next/image`; fonts through `next/font` (no layout shift).
- GSAP and Locomotive Scroll loaded only in the marketing route group, dynamically.
- Bundle: no library over 50 KB gzipped without approval.

## 10. CI and branch rules

- Flow: `dev/<name>` → PR → `integration` → PR → `main`. Owner approves.
- Required checks on both protected branches: **Branch policy**, **Format, lint and types**,
  **Build**, **End-to-end tests**.
- Repository rulesets (public repository) block direct pushes, force pushes and deletion of
  `main` and `integration`. See `docs/DEPLOYMENT.md` for the settings.

## 11. Browser support (to confirm)

Latest two versions of Chrome, Edge, Firefox and Safari; mobile Safari and Chrome.

## 12. Monitoring

- Sentry on the frontend and the backend (decided by the owner, 11 Nov 2026). Full rules,
  feature settings, files and privacy limits: `docs/MONITORING.md`.
- `next.config.ts` is wrapped with `withSentryConfig` (organisation, project, tunnel route,
  source maps uploaded then deleted from the deployed bundle).
- Frontend CI never sends events or uploads source maps (empty DSN, no token). Source maps are
  uploaded by the Vercel production and staging builds only.
- Backend CORS must allow the `sentry-trace` and `baggage` headers for distributed tracing.