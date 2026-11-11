# Frontend Guidelines — StartupsClub Web

Day-to-day coding rules. Structure is in `docs/ARCHITECTURE.md`; look and feel in
`docs/DESIGN_SYSTEM.md`. If a rule here is unclear, ask.

## 1. TypeScript

- **No `any`.** Not as a type, not as `as any`, not in generics. Use a specific type, a generic,
  or `unknown` and narrow it. ESLint fails the build on `any`.
- No `@ts-ignore` or `@ts-nocheck`. `@ts-expect-error` only with a description and approval.
- `import type { X }` for type-only imports.
- Model API data with explicit types in the feature's `types/` folder; do not use `Record<string, unknown>` as a
  shortcut for a known shape.
- Non-null assertions (`!`) need a comment explaining why they are safe; prefer a guard.
- Prefer `type` for object shapes and unions; `interface` only when extending.
- Exported functions have explicit return types.
- Use discriminated unions for states (`{ status: "loading" } | { status: "error"; error: ApiError }`).

## 2. File header (TSDoc)

Directly **after the imports** of every `.ts` and `.tsx` file (shadcn-generated files excepted):

```ts
/**
 * One or two sentences: what this file is for and where it is used.
 *
 * @packageDocumentation
 */
```

For exported components, hooks and functions also add a short TSDoc with `@param` and
`@returns` when the meaning is not obvious. Use valid TSDoc syntax (`eslint-plugin-tsdoc`).

## 3. Naming

| Thing             | Convention                                | Example                              |
| ----------------- | ----------------------------------------- | ------------------------------------ |
| Files and folders | kebab-case                                | `club-board.tsx`, `ship-logs/`       |
| React components  | PascalCase export                         | `ClubBoard`                          |
| Hooks             | `use` + camelCase                         | `useTodayStandup`                    |
| Hook files        | `use-*.ts` in the feature's `hooks/`      | `use-today-standup.ts`               |
| Service files     | `<name>-service.ts` in `services/`        | `standup-service.ts`                 |
| Type files        | named after the concept, in `types/`      | `standup.ts`                         |
| Feature helpers   | `lib/query-keys.ts`, `lib/schemas.ts`     | `features/standup/lib/query-keys.ts` |
| Types             | PascalCase                                | `StandupItem`                        |
| Constants         | `SCREAMING_SNAKE_CASE` for true constants | `MAX_CLUB_SIZE`                      |
| Query keys        | arrays, factory per feature               | `standupKeys.today()`                |
| Test files        | `*.spec.ts` in `e2e/`                     | `standup.spec.ts`                    |

One main component per file. Named exports (no default exports) except where Next.js requires
a default (`page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`).

## 4. Components

- Server component by default. Add `"use client"` only when needed (state, effects, event
  handlers, browser APIs, TanStack Query hooks, GSAP). Keep client components small and low in
  the tree.
- Props are typed with a named `type XProps`. Destructure in the signature.
- Compose with shadcn primitives. Do not rebuild a button, input or dialog by hand.
- Use `cn()` for conditional classes; never string-concatenate class names.
- No inline styles except for dynamic values that Tailwind cannot express.
- Do not hard-code colours, radii or font sizes. Use tokens and the Tailwind theme.
- Keep components under about 150 lines; split by responsibility.
- Every interactive element is keyboard reachable and has an accessible name
  (`docs/ACCESSIBILITY.md`).

## 5. Styling

- Tailwind utility classes; Prettier sorts them (`prettier-plugin-tailwindcss`).
- Use design tokens (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`).
  Do not use raw hex values or Tailwind palette colours (`bg-blue-500`) in components.
- Mobile first: base classes for mobile, `md:` and `lg:` for larger screens.
- Dark mode via the `dark` class and tokens; do not write separate `dark:` colour overrides
  unless a token cannot express it.
- Never pure black. The darkest colour is `#0A0A0A` (token `--background` in dark mode).

## 6. Data and state

- Server data: TanStack Query hooks in the feature's `hooks/`, calling its `services/`. Never `useEffect` + `fetch` for data.
- UI state: `useState`/`useReducer`; share with context only when two distant components need
  the same state. URL state (search params) for filters and tabs that should be shareable.
- Forms: react-hook-form with zod schemas (TO CONFIRM). Validate on the client for UX, but the
  server is the authority.
- No Zustand, no Redux, no global singletons.
- Rules and examples: `docs/STATE_AND_DATA.md`.

## 7. Error and loading handling

- Each query shows loading (skeleton), empty and error UI.
- Surface `ApiError.message` to users in plain language; log details only in development.
- Do not swallow errors with empty `catch` blocks.

- Unexpected errors go to Sentry through error boundaries and the global Query handler, not
  through ad-hoc `captureException` calls in components. Expected errors (`400`, `401`, `403`,
  `404`) are shown in the UI and not reported. Rules: `docs/MONITORING.md`.
- Never put personal data (standup or post text, names, emails, messages) into an `Error`
  message, a log line or Sentry context. Use opaque IDs.
- Error screens show a friendly message, a next step and the Sentry event ID.

## 8. Imports

Order: React/Next → third-party → `@/` internal → relative → type imports last in each group.
Prettier does not reorder imports; follow this by hand or ask before adding an import-sort plugin.

## 9. Git and commits

- Branch: `dev/<name>`. Small, focused commits; imperative messages ("Add standup form").
- Husky runs lint-staged on commit and `tsc` on push. Never use `--no-verify`.
- One pull request = one coherent change, with screenshots for UI.

## 10. Do not

- Do not add a dependency, folder, layer or pattern that the documents do not describe without asking.
- Do not import a service or Axios into a component, import another feature's `services/` or `lib/`,
  or create barrel `index.ts` files (`docs/ARCHITECTURE.md` section 4).
- Do not create empty feature sub-folders; add `hooks/`, `services/`, `types/` or `lib/` only when needed.
- Do not copy code from the web without checking its licence and fit.
- Do not leave `console.log`, commented-out code, or `TODO` without an owner and a reason.
- Do not use `dangerouslySetInnerHTML`, `eval`, or inline event strings.