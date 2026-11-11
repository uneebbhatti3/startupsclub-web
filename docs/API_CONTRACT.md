# API Contract — StartupsClub Web

The frontend's view of the NestJS API. **The backend repository is the source of truth.**
This file is derived from the StartupsClub System Design (11 Nov 2026). If the backend differs,
update this file and tell the owner. Request and response bodies are added per module when
that module is built; do not guess them.

## 1. Conventions

- **Base URL:** `NEXT_PUBLIC_API_BASE_URL` (for example `https://api.<domain>/api/v1`).
- **Auth routes:** better-auth is served by NestJS at `NEXT_PUBLIC_AUTH_BASE_URL` + `/api/auth/*`
  (outside `/api/v1`). The frontend calls them with Axios; it does not use the better-auth client.
  **Exact auth route names and payloads: TO CONFIRM with the backend.**
- **Session:** httpOnly cookie, `withCredentials: true`. No bearer tokens.
- **Success:** `{ "data": <payload>, "meta": { ... } }`
- **Error:** `{ "error": { "code": "STRING_CODE", "message": "Human readable", "details": { } } }`
- **Pagination:** cursor based, `?cursor=<opaque>&limit=<n>`; `meta` carries the next cursor.
  **Exact `meta` field names: TO CONFIRM.**
- **Validation:** request bodies are validated server-side; `details` carries field errors
  (**shape TO CONFIRM**).
- **Time:** ISO 8601 in UTC. Display in the user's timezone.
- **Access order on the server:** authenticated → role or capability → plan (free or paid) →
  ownership of the record. The UI mirrors this with `401`, `403` and upgrade prompts.
- **Roles:** global `ADMIN` / `MEMBER`; capabilities `isTutor`, `isModerator`; club role
  `LEADER` / `MEMBER`; plan `FREE` / `PAID` (Pro).

## 2. TypeScript envelope types (shared, in `src/types/api.ts`)

```ts
export type ApiMeta = { nextCursor?: string | null };
export type ApiSuccess<T> = { data: T; meta?: ApiMeta };
export type ApiErrorBody = {
  error: { code: string; message: string; details?: Record<string, unknown> };
};
```

Entity types are written from the backend's Prisma schema when each module starts. Ask the owner
for the schema or the response examples first.

## 3. Endpoints by feature

Phase column follows `docs/ROADMAP.md`. "WS" = WebSocket.

### 1. Authentication and accounts (Phase 1)

| Method and path   | Notes                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `/api/auth/*`     | better-auth routes: sign-up, sign-in (email, GitHub), sign-out, verify email, reset password, session. **TO CONFIRM.** |
| `GET /me`         | Current user.                                                                                                          |
| `PATCH /account`  | Update account.                                                                                                        |
| `DELETE /account` | Delete account.                                                                                                        |

### 2. Roles and access

| Method and path                       | Notes                                |
| ------------------------------------- | ------------------------------------ |
| `PATCH /admin/users/:id/role`         | Admin only.                          |
| `PATCH /admin/users/:id/capabilities` | Admin only; mark tutor or moderator. |

### 3. Onboarding

| Method and path             | Notes                      |
| --------------------------- | -------------------------- |
| `GET /onboarding/status`    | Used by the redirect rule. |
| `POST /onboarding/complete` |                            |

### 4. Profiles and project pages

| Method and path                 | Notes                    |
| ------------------------------- | ------------------------ |
| `GET /users/:id`                |                          |
| `PATCH /profile`                |                          |
| `POST /projects`                |                          |
| `PATCH /projects/:id`           |                          |
| `GET /users/:id/progress`       | Read-only progress view. |
| `POST /projects/:id/milestones` |                          |
| `PATCH /milestones/:id`         |                          |

### 5. Daily standup

| Method and path                   | Notes                               |
| --------------------------------- | ----------------------------------- |
| `POST /standups`                  | One per user per day.               |
| `PATCH /standups/:id`             | Editable until day end; tick items. |
| `GET /standups/today`             |                                     |
| `GET /standups?userId=&from=&to=` | History.                            |
| `GET /clubs/:id/standups?date=`   | Club view.                          |

### 6. Ship logs

| Method and path                          | Notes                     |
| ---------------------------------------- | ------------------------- |
| `POST /shiplogs`                         |                           |
| `GET /shiplogs?userId=`                  |                           |
| `GET /shiplogs/suggestions`              | GitHub-based suggestions. |
| `POST /shiplogs/suggestions/:id/accept`  |                           |
| `POST /shiplogs/suggestions/:id/dismiss` |                           |

### 7. Clubs

| Method and path                               | Notes                               |
| --------------------------------------------- | ----------------------------------- |
| `GET /clubs`                                  |                                     |
| `GET /clubs/:id`                              |                                     |
| `POST /clubs/:id/join-requests`               | Only during the season join window. |
| `PATCH /join-requests/:id`                    | Leader approves or rejects.         |
| `GET /clubs/:id/board`                        | Board for a date.                   |
| `POST /admin/clubs`, `PATCH /admin/clubs/:id` | Admin only.                         |

### 8. Seasons

| Method and path            | Notes       |
| -------------------------- | ----------- |
| `GET /seasons/current`     |             |
| `GET /seasons/:id/summary` |             |
| `POST /admin/seasons`      | Admin only. |

### 9. Streaks, milestones and progress

| Method and path                 | Notes           |
| ------------------------------- | --------------- |
| `GET /me/dashboard`             | Dashboard data. |
| `GET /users/:id/streak`         |                 |
| `GET /me/reports/weekly`        |                 |
| `GET /clubs/:id/reports/weekly` |                 |

### 10. WhatsApp check-in bot

| Method and path                      | Notes                                     |
| ------------------------------------ | ----------------------------------------- |
| `POST /integrations/whatsapp/link`   | Sends a code.                             |
| `POST /integrations/whatsapp/verify` |                                           |
| `POST /webhooks/whatsapp`            | Backend only; not called by the frontend. |

### 11. Global forum

| Method and path                                                                        | Notes |
| -------------------------------------------------------------------------------------- | ----- |
| `GET /posts`, `POST /posts`, `GET /posts/:id`, `PATCH /posts/:id`, `DELETE /posts/:id` |       |
| `POST /comments`, `POST /reactions`, `POST /reports`                                   |       |
| `GET /search?q=`                                                                       |       |

### 12. Short rooms (definition open)

| Method and path                                                                        | Notes |
| -------------------------------------------------------------------------------------- | ----- |
| `POST /rooms`, `GET /rooms?status=live`, `POST /rooms/:id/join`, `POST /rooms/:id/end` |       |

### 13. Member network

| Method and path                                        | Notes |
| ------------------------------------------------------ | ----- |
| `POST /users/:id/follow`, `DELETE /users/:id/follow`   |       |
| `GET /users/:id/followers`, `GET /users/:id/following` |       |
| `GET /feed/following`                                  |       |

### 14. Events

| Method and path                                    | Notes       |
| -------------------------------------------------- | ----------- |
| `GET /events`, `GET /events/:id`                   |             |
| `POST /events/:id/rsvp`, `DELETE /events/:id/rsvp` |             |
| `POST /admin/events`                               | Admin only. |

### 15. Collaborator board

| Method and path                                                  | Notes                   |
| ---------------------------------------------------------------- | ----------------------- |
| `GET /collab?type=&skills=`, `POST /collab`, `PATCH /collab/:id` |                         |
| `POST /collab/:id/respond`                                       | Opens a direct message. |

### 16. Real-time chat

| Method and path                                                        | Notes                           |
| ---------------------------------------------------------------------- | ------------------------------- |
| `GET /conversations`, `GET /conversations/:id/messages?cursor=`        | REST.                           |
| WS events: `message:send`, `message:new`, `typing`, `presence`, `read` | Socket.IO, same session cookie. |

### 17. Tutors, classrooms, sessions (scope undecided)

| Method and path                                                   | Notes |
| ----------------------------------------------------------------- | ----- |
| `GET /tutors`, `GET /tutors/:id`, `PUT /tutors/me/availability`   |       |
| `POST /sessions`, `PATCH /sessions/:id`, `GET /sessions/:id/join` |       |
| `POST /classrooms`, `POST /classrooms/:id/enroll`                 |       |

### 18. Notifications

| Method and path                                                                       | Notes |
| ------------------------------------------------------------------------------------- | ----- |
| `GET /notifications`, `PATCH /notifications/:id/read`, `POST /notifications/read-all` |       |
| `GET /notification-preferences`, `PUT /notification-preferences`                      |       |

### 19. Subscriptions and payments

| Method and path                                                                       | Notes                                                       |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `GET /plans`                                                                          | Pricing content (hard-coded on the marketing site for now). |
| `POST /subscriptions/checkout`, `POST /subscriptions/cancel`, `GET /subscriptions/me` |                                                             |
| `GET /payments`                                                                       |                                                             |
| `POST /webhooks/payments`                                                             | Backend only.                                               |

### 20. Admin dashboard

All under `/admin/*`, guarded by the ADMIN role; the moderation queue is also open to
moderators. Analytics: active members, standup completion rate, average streak, club activity,
churn, revenue. **Endpoint list TO CONFIRM.**

### 22. AI Standup Coach (Pro)

| Method and path                                        | Notes |
| ------------------------------------------------------ | ----- |
| `GET /standups/:id/feedback`, `GET /me/reports/weekly` |       |

### 23. AI matching (Pro)

| Method and path                                                          | Notes |
| ------------------------------------------------------------------------ | ----- |
| `GET /matches/clubs`, `GET /matches/people`, `POST /matches/:id/dismiss` |       |

### 24. AI knowledge assistant (Pro)

| Method and path                                  | Notes |
| ------------------------------------------------ | ----- |
| `POST /assistant/ask`, `GET /search/semantic?q=` |       |

### 25. AI moderation

| Method and path                                  | Notes             |
| ------------------------------------------------ | ----------------- |
| `GET /admin/reports`, `PATCH /admin/reports/:id` | Moderation queue. |

### 28. Post composer and LinkedIn scheduling

| Method and path                                               | Notes                                |
| ------------------------------------------------------------- | ------------------------------------ |
| `POST /composer/drafts`, `PATCH /composer/drafts/:id`         |                                      |
| `POST /composer/drafts/:id/publish`                           | Targets with optional times.         |
| `GET /composer/scheduled`                                     |                                      |
| `PATCH /composer/targets/:id`, `DELETE /composer/targets/:id` | Reschedule, cancel.                  |
| `POST /composer/ai-draft`                                     | Counts against the monthly AI quota. |
| `POST /integrations/linkedin/connect`                         |                                      |

Features 21 (public site), 26 (disengagement prediction) and 27 (AI safeguards) have no
frontend-called endpoints in the current design.

## 4. Change process

1. Backend changes an endpoint → the backend owner updates this file in the same week.
2. Frontend needs a new endpoint → open a pull request that adds it here with "REQUESTED" and
   ask the owner. Do not code against an endpoint that is not listed.
