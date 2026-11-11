# Contributing — StartupsClub Web

Everyone (including AI agents) follows this workflow. A plain-language walkthrough for team
members who are new to Git is in `docs/TEAM_GUIDE.md`.

## Branch flow

```
dev/<name>  --pull request-->  integration  --pull request-->  main
```

| Branch        | Rule                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `main`        | Production. Protected. Only `integration` may be merged in, by pull request, approved by the owner.                    |
| `integration` | Shared staging. Protected. Only `dev/<name>` branches may be merged in, by pull request.                               |
| `dev/<name>`  | Your working branch, for example `dev/uneeb`, `dev/hadia`, `dev/ahtisham`. Lowercase letters, digits and hyphens only. |

Never commit directly to `main` or `integration`. A local Husky hook, the branch-policy GitHub
Action and the repository ruleset each block it.

## Step by step

1. **Update:** `git switch integration && git pull`
2. **Branch:** `git switch -c dev/<your-name>` (or `git switch dev/<your-name>` and merge in the latest `integration`).
3. **Work.** Read `AGENTS.md` and the documents for your task first.
4. **Check locally:** `npm run format:check`, `npm run lint`, `npm run typecheck`.
5. **Commit** small, focused changes with imperative messages. Husky formats and lints staged files.
6. **Push:** `git push -u origin dev/<your-name>` (Husky runs the type check).
7. **Open a pull request into `integration`.** Fill in the template, add screenshots for UI.
8. **Wait for checks** (Branch policy, Format/lint/types, Build, End-to-end tests) and review.
9. **Fix feedback** by pushing more commits to the same branch.
10. The owner merges. Delete the merged branch or keep updating it from `integration`.

## Code rules (summary)

- Formatting by Prettier. ESLint and TypeScript must pass with no warnings.
- **No `any`.** No `@ts-ignore`.
- TSDoc `@packageDocumentation` block after the imports of every file.
- Use design tokens, not raw colours. Never pure black (`#0A0A0A` is the darkest colour).
- Follow `docs/ARCHITECTURE.md`; do not invent structure. Ask when unsure.
- Details: `docs/FRONTEND_GUIDELINES.md`.

- Do not put personal data in error messages or logs. Unexpected errors are reported through the
  documented Sentry pattern (`docs/MONITORING.md`), not with scattered calls.

## Pull request expectations

- One coherent change per pull request; keep them small enough to review in 15 minutes.
- Link the requirement or feature (`docs/REQUIREMENTS.md` IDs).
- Update `docs/PROGRESS.md`. Record decisions in `docs/DECISIONS.md`.
- Never include `.env` files, secrets or generated build output.

## Hooks and checks

| Where                 | What runs                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| Pre-commit (Husky)    | Blocks commits on `main`/`integration` or badly named branches; lint-staged (Prettier + ESLint). |
| Pre-push (Husky)      | `npm run typecheck`.                                                                             |
| Pull request (GitHub) | Branch policy, Format/lint/types, Build, End-to-end tests.                                       |

Hooks can be bypassed locally with `--no-verify`. **Do not.** The GitHub checks cannot be bypassed
and will fail the pull request anyway.

## AI agents

AI agents work under the same rules. They must ask when anything is unclear, never read `.env*`,
and never create architecture. See `AGENTS.md` and `CLAUDE.md`.
