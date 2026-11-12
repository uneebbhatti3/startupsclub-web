# State and Data — StartupsClub Web

How data moves through the frontend. Decided by the owner (11 Nov 2026):

- **TanStack Query + Axios.** No Zustand.
- **No mock server and no MSW.** Until the backend exists, data is **hard-coded** in the code.
- The frontend talks **only to the NestJS API**, including for authentication
  (no better-auth client library).

## 1. Three kinds of state

| Kind        | Tool                                           | Examples                                        |
| ----------- | ---------------------------------------------- | ----------------------------------------------- |
| Server data | TanStack Query                                 | standups, clubs, notifications, profile         |
| UI state    | `useState` / `useReducer`, context when needed | open dialogs, selected tab, composer draft text |
| URL state   | `useSearchParams`                              | filters, date, pagination cursor                |

Theme is handled by `next-themes`. Session information is server data (`useSession` hook in
`features/auth/hooks/`).

## 2. The layer pattern (hooks call services, services own the data)

Each feature has `hooks/` and `services/`. Components call hooks; hooks call services; only
services touch Axios or hard-coded data. Components never import a service, a fixture or Axios.

`features/standup/services/standup-service.ts`

```ts
import { todayStandupFixture } from "@/features/standup/services/standup-fixtures";
import type { Standup } from "@/features/standup/types/standup";

/**
 * API calls for the daily standup feature.
 *
 * @packageDocumentation
 */

export const standupService = {
  // FIXTURE: replace with `apiClient.get<Standup | null>("/standups/today")` when the backend is ready.
  getToday: async (): Promise<Standup | null> => todayStandupFixture,
};
```

`features/standup/hooks/use-today-standup.ts`

```ts
import { useQuery } from "@tanstack/react-query";

import { standupKeys } from "@/features/standup/lib/query-keys";
import { standupService } from "@/features/standup/services/standup-service";
import type { Standup } from "@/features/standup/types/standup";

/**
 * Query hook for today's standup of the signed-in member.
 *
 * @packageDocumentation
 */

export function useTodayStandup() {
  return useQuery<Standup | null>({
    queryKey: standupKeys.today(),
    queryFn: standupService.getToday,
  });
}
```

Switching to the API later changes only the body of the service function. The hook and every
component stay as they are.

## 3. Hard-coded data (fixtures)

- Live inside the feature's `services/`: in the service file, or in a sibling
  `<name>-fixtures.ts` imported only by that service.
- Typed with the feature's types, so the data can never drift from the shape components expect.
- Every hard-coded value is preceded by a `// FIXTURE:` comment saying which endpoint will replace
  it. `grep -r "FIXTURE:" src` lists the remaining work.
- Realistic, varied content: different names, lengths, empty and long cases. No lorem ipsum in the
  app. No real personal data.
- Write them to match `docs/API_CONTRACT.md`. If the contract does not define a shape, ask.
- Mutations while on hard-coded data: the service simulates success after a short delay and the
  hook updates the Query cache (`queryClient.setQueryData`) so the UI behaves as it will with the
  API. Mark with `FIXTURE:`.
- Marketing page content (pricing, FAQ, blog, changelog) is static content, not fixtures. It lives
  in `features/marketing/lib/content/` and is not replaced by API calls (TO CONFIRM).
- Hard-coded data are removed in milestone M8 (see `docs/ROADMAP.md`).

## 4. Query keys

A key factory per feature in `features/<feature>/lib/query-keys.ts`:

```ts
export const standupKeys = {
  all: ["standups"] as const,
  today: () => [...standupKeys.all, "today"] as const,
  list: (params: { from: string; to: string }) => [...standupKeys.all, "list", params] as const,
};
```

Invalidate with the narrowest key that is correct.

## 5. Query client (`lib/query-client.ts`) and providers

- `lib/query-client.ts` creates the `QueryClient`; `components/providers/query-provider.tsx` mounts it.
- `staleTime`: 30 s for most data; 0 for data that must be fresh (today's standup).
- `retry`: 1, and never for `4xx` errors.
- `refetchOnWindowFocus`: on.
- Mutations invalidate affected keys on success.
- Error reporting: one global `onError` on the `QueryCache` and `MutationCache`, defined here,
  reports unexpected failures (`5xx`, network, malformed response) to Sentry and ignores expected
  `4xx` errors, using `ApiError.status`. Components do not report errors themselves
  (`docs/MONITORING.md`).
- Changes to defaults need approval.

## 6. Axios client (`services/api-client.ts`)

- `baseURL` from `NEXT_PUBLIC_API_BASE_URL`; `withCredentials: true`.
- Success shape `{ data, meta }`; failure shape `{ error: { code, message, details } }`.
  The response interceptor returns `data` (and `meta` where needed) and throws a typed `ApiError`
  (class in `lib/api-error.ts`).
- Cursor pagination: `?cursor=&limit=`; use `useInfiniteQuery` for lists.
- Authentication endpoints are under `NEXT_PUBLIC_AUTH_BASE_URL` + `/api/auth/*`
  (see `docs/API_CONTRACT.md`).
- Timeouts, request IDs and retry policy: ask before changing.
- Tracing: the API origin is the only entry in Sentry's `tracePropagationTargets`; the backend
  must allow the `sentry-trace` and `baggage` request headers in CORS.

## 7. Mutations and optimistic updates

- Use `useMutation`. Optimistic updates only for low-risk, reversible actions: ticking a standup
  item, marking a notification read, following a member. Roll back on error and show a message.
- Never optimistic for payments, publishing and scheduling posts, or destructive actions.

## 8. Time

- The API stores UTC. Display in the user's timezone (from their profile).
- "Today" for standups is the user's local day. Never derive it from the browser's UTC date.

## 9. Auth and session

- Session is an httpOnly cookie set by the backend. The frontend never reads or stores a token.
- `features/auth/hooks/` exposes `useSession`, `useSignIn`, `useSignUp`, `useSignOut`; the calls to
  `/api/auth/*` live in `features/auth/services/`.
- Until the backend exists, the auth service returns a fixed signed-in user; mark it `FIXTURE:` and
  keep one switch in one place so the login flow can still be previewed.

## 10. Do not

- No Zustand, Redux, MobX, Jotai, SWR, MSW, json-server, or mock Next.js route handlers.
- No data fetching in `useEffect`. No `axios` imports outside the `services/` folders.
- No storing server data in component state or context.
