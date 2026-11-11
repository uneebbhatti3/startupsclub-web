# CLAUDE.md

@AGENTS.md

## Claude Code specifics

- **Ask, do not guess.** Use `AskUserQuestion` for every ambiguity, however small. Group related
  questions into one call. Do not continue past an unanswered question.
- **Never read `.env*`** (only `.env.example`). The deny rules in `.claude/settings.json` back
  this up; do not try to work around them (no `cat`, `grep`, `type`, scripts or MCP tools that
  read those files).
- **Plan first for anything non-trivial.** For a new page, feature or refactor, state the plan
  (files to touch, which documents apply) and get approval before editing. If the plan needs
  structure that `docs/ARCHITECTURE.md` does not describe, that is a question, not a plan.
- **Use the tools in this order for UI work:**
  1. Read `docs/DESIGN_SYSTEM.md` and the relevant page spec (`docs/APP_FLOW.md` or
     `docs/LANDING_PAGE.md`).
  2. Shadcn MCP to find components or blocks. 21st.dev MCP for marketing components. Taste skill
     for marketing design direction only.
  3. Implement.
  4. Playwright MCP to look at the result (see `AGENTS.md` section 6).
- **Taste skill scope.** Use it for `src/app/(marketing)` only. It does not override the design
  system, the colour palette, the fonts or the Notion-inspired direction.
- **Keep context small.** Read the specific documents for the task, not all of `docs/`.
- **Finish properly.** Run the checks in `AGENTS.md` section 8, update `docs/PROGRESS.md`,
  and summarise what changed and what you could not verify.
- **Git.** Never commit or push unless the user asks. When asked, commit only on a
  `dev/<name>` branch. Never use `--no-verify`.
- **Commit message attribution** follows the instructions the harness provides; do not add
  extra attribution of your own.
- **Monitoring.** Sentry is the approved error tracker. Follow `docs/MONITORING.md`: report only
  unexpected errors, never include personal data in error messages or Sentry context, never read
  `.env.sentry-build-plugin`, and ask before touching Sentry configuration or running its wizard.
