## What does this change?

<!-- One or two sentences. What and why, not how. -->

## Related documents / feature

<!-- Example: docs/APP_FLOW.md "Daily standup"; PRD feature 5. -->

## Screenshots (for UI changes)

<!-- Light and dark mode, desktop and mobile. Delete this section if nothing visual changed. -->

## Checklist

- [ ] Branch is `dev/<name>` and this PR targets `integration` (or `integration` → `main`)
- [ ] `npm run format:check`, `npm run lint`, `npm run typecheck` pass locally
- [ ] No `any`, no `@ts-ignore`, no hard-coded colours
- [ ] TSDoc `@packageDocumentation` block after the imports in every new file
- [ ] Looked at the result in a browser in light and dark mode (Playwright or manually)
- [ ] No `.env*` file or secret is included
- [ ] No personal data in error messages, logs or Sentry context; error handling follows `docs/MONITORING.md`
- [ ] `docs/PROGRESS.md` updated; `docs/DECISIONS.md` updated if a decision was made
- [ ] Anything unclear was asked about, not assumed

## Questions for the reviewer

<!-- Optional. -->
