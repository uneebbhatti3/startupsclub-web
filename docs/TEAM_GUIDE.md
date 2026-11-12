# Team Guide — Working on the frontend (plain language)

For Hadia and Ahtisham, and anyone new to Git or to this project. The formal rules are in
`CONTRIBUTING.md`; this is the same thing, step by step.

## The big idea

Nobody edits the real project directly. Everyone works on **their own copy line** (a "branch"),
then asks Uneeb to merge it. This keeps the project safe, so one mistake cannot break it for
everyone.

```
Your branch: dev/hadia   ──►  integration (shared testing line)  ──►  main (the real product)
```

- Your branch is always named `dev/` and your name in lowercase: `dev/hadia`, `dev/ahtisham`.
- You can only send your work into `integration`, and only by a **pull request** (a request that
  says "please review and merge my work").
- Only Uneeb sends `integration` into `main`.

## One-time setup

1. Install **Node.js 22**, **Git**, and **VS Code**.
2. Clone the project: `git clone <repository-url>` and open the folder.
3. Run `npm install`. This also sets up the automatic checks (Husky).
4. Copy `.env.example` to `.env.local` and ask Uneeb for any missing values.
5. Run `npm run dev` and open `http://localhost:3000`.

## Your daily routine

1. **Get the latest work**
   ```
   git switch integration
   git pull
   ```
2. **Go to your branch** (first time: create it)
   ```
   git switch -c dev/your-name        # first time only
   git switch dev/your-name           # every other time
   git merge integration              # bring in everyone's latest work
   ```
3. **Do your task.** Read the page spec in `docs/` first (for example `docs/APP_FLOW.md`).
4. **Check your work before saving it**
   ```
   npm run format
   npm run lint
   npm run typecheck
   ```
5. **Save it (commit)**
   ```
   git add .
   git commit -m "Add standup form"
   ```
6. **Send it to GitHub**
   ```
   git push -u origin dev/your-name
   ```
7. **Open a pull request** on GitHub: from `dev/your-name` into `integration`. Fill in the
   template. Add screenshots (light and dark mode).
8. **Wait for the green ticks.** If a check is red, click it, read the message, fix it, commit and
   push again. The pull request updates by itself.
9. Uneeb reviews and merges. Then start again from step 1.

## Rules you must follow

- Never work on `main` or `integration` directly. The computer will stop you; do not try to get around it.
- **Never use the type `any`** in TypeScript. Ask if you do not know the right type.
- Put the short description comment at the top of every file, right after the imports.
- Use colours from the design system. Never type colours by hand, and never use pure black.
- Do not install new packages without asking.
- Never open, copy or share `.env` files.
- Errors are tracked automatically in Sentry. Never remove the error-reporting code, and never put
  real user data (names, emails, standup text) into an error message.
- If you are not sure about anything, **ask Uneeb before you build it**. Guessing causes rework.

## When something goes wrong

| Problem                                 | What to do                                                                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| "Commit blocked: do not commit to main" | You are on the wrong branch. Run `git switch dev/your-name`. If you already changed files, `git stash`, switch, then `git stash pop`. |
| "Branch does not match dev/<name>"      | Rename it: `git branch -m dev/your-name`.                                                                                             |
| Prettier or ESLint failed on commit     | Read the message, fix the lines, run `npm run format`, commit again.                                                                  |
| Type check failed on push               | Run `npm run typecheck`, fix the errors, commit, push again.                                                                          |
| A pull request check is red             | Open it on GitHub, read the error, fix it locally, push again.                                                                        |
| Merge conflict                          | Do not guess. Ask Uneeb to sit with you for the first one.                                                                            |
| I committed a secret                    | Tell Uneeb immediately. The secret must be replaced.                                                                                  |

## Working with the AI assistant (Claude Code)

The assistant reads `AGENTS.md` and `CLAUDE.md` automatically. It will **stop and ask you
questions** when something is unclear. Answer them; do not tell it to "just decide". It looks at
the running site in a browser to check its work. It will not touch `.env` files.

## Where do I put my code?

We use a **feature-based** layout: everything for one feature (for example the daily standup)
lives together in `src/features/standup/`.

```
src/features/standup/
  components/   the screens and widgets
  hooks/        code that asks for data (TanStack Query)
  services/     the calls to the API (hard-coded data for now)
  types/        TypeScript types
  lib/          small helpers for this feature only
```

- Pages in `src/app/` are thin: they only put feature components together.
- Components never call the API. They use a hook; the hook uses a service.
- Start inside your feature. Move code to the shared folders (`src/components/shared`,
  `src/lib`, `src/hooks`, `src/types`) only when a **second** feature needs it. Ask first.
- Do not import another feature's `services/` or `lib/` folder.
- Landing-site code goes in `src/features/marketing/`.
- The full table "Where does this code go?" is in `docs/ARCHITECTURE.md` section 5.

## Where to find things

| I want to know...             | Open                                       |
| ----------------------------- | ------------------------------------------ |
| What we are building          | `docs/PRD.md`                              |
| What screens exist            | `docs/APP_FLOW.md`, `docs/LANDING_PAGE.md` |
| How to style things           | `docs/DESIGN_SYSTEM.md`                    |
| Where files go                | `docs/ARCHITECTURE.md`                     |
| How data works for now        | `docs/STATE_AND_DATA.md`                   |
| What is done and what is next | `docs/PROGRESS.md`                         |
