# Security Policy — StartupsClub Web

This repository is **public**. Treat everything committed here as visible to everyone.

## 1. Reporting a vulnerability

Please do **not** open a public issue for a security problem.

- Use GitHub's **private vulnerability reporting** (Security tab → "Report a vulnerability"), or
- email: `<security contact email — TO BE CONFIRMED BY THE OWNER>`.

Include steps to reproduce, the affected page or file, and the impact. We aim to acknowledge a
report within 5 working days. Please give us reasonable time to fix before disclosing.

Supported version: the code on `main`.

## 2. Scope of this repository

Frontend only. Server-side security (authentication internals, authorisation, rate limits,
database, queues, payments and webhooks) lives in the backend repository. The frontend must
still never weaken it.

## 3. Rules for contributors and AI agents

### Secrets and environment

1. Never commit secrets, keys, tokens or passwords. Only `.env.example` is committed.
2. This frontend has **no secrets**: every `NEXT_PUBLIC_*` variable is shipped to the browser.
   Never put a secret in a `NEXT_PUBLIC_*` variable.
3. AI agents must never read `.env*` files (enforced in `.claude/settings.json`).
4. The 21st.dev API key lives in the developer's shell environment, never in the repository.
5. Turn on **GitHub secret scanning and push protection** for this repository.

### Authentication and sessions

6. Sessions are httpOnly cookies set by the backend. Never store tokens or session data in
   `localStorage`, `sessionStorage` or JavaScript-readable cookies.
7. Do not implement your own cryptography or password handling.
8. Redirect rules and `401`/`403` handling are in `docs/APP_FLOW.md`.
9. "Forgot password" screens must never reveal whether an email exists.

### Input, output and XSS

10. Treat all API data as untrusted. React escapes by default; do not bypass it.
11. `dangerouslySetInnerHTML`, `innerHTML`, `eval` and `new Function` are forbidden without the
    owner's approval. If rich text is ever needed, sanitise with a vetted library first.
12. Validate form input with zod for UX; the server remains the authority.
13. Open external links with `rel="noopener noreferrer"`. Validate redirect targets
    (the post-login return path must be a relative path on this site).

### Requests and headers

14. All requests go through the Axios client with `withCredentials`; CORS and CSRF protection
    are enforced by the backend (SameSite cookies, allowed origins).
15. Configure security headers in `next.config` (proposal, needs approval): `Content-Security-Policy`,
    `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`,
    `X-Frame-Options` or `frame-ancestors`.
16. Production is HTTPS only (HSTS set by the host).

### Third parties and dependencies

17. No third-party scripts, trackers or embeds without approval (privacy and CSP impact).
    Sentry is the approved exception, configured only as `docs/MONITORING.md` says.
18. Add dependencies only with approval; prefer well-maintained, widely used packages.
19. Dependabot opens weekly update pull requests; run `npm audit` before releases.
20. Commit the lockfile; CI uses `npm ci`.

### Privacy

21. Do not log personal data (emails, standup content, messages) to the console or to analytics.
22. Standup visibility settings must be respected in the UI; private items are never rendered for
    other members. Risk scores from AI features are never shown to members.
23. AI-processing consent is collected at onboarding and must be clearly worded.

24. Never send personal data to Sentry: user context is the opaque user ID only; no emails,
    names, IP addresses, request bodies, cookies or standup, post or message text. Session Replay
    stays off unless the owner approves it with full masking.
25. `SENTRY_AUTH_TOKEN` is a secret: Vercel environment variables only. `.env.sentry-build-plugin`
    is git-ignored and must never be read by an AI agent or committed.
26. The Sentry DSN is public by design; do not treat it as a secret, but do not hard-code it.
27. The Privacy page and onboarding consent must disclose error and performance diagnostics.
28. If a Sentry token leaks, revoke it in Sentry immediately and create a new one.

## 4. Repository protections (settings)

See `docs/DEPLOYMENT.md` for the ruleset: no direct pushes, no force pushes, required checks,
owner approval, code owner review.

## 5. If a secret is leaked

1. Revoke or rotate it immediately at the provider.
2. Remove it from the code and from git history if needed (ask the owner).
3. Tell the owner and record the incident in `docs/DECISIONS.md` (no secret values).
