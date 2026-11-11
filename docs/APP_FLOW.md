# App Flow — StartupsClub Web

Screens, routes and navigation for the **app** (`src/app/(app)` and `src/app/(auth)`).
The marketing site is in `docs/LANDING_PAGE.md`. Routes below are **proposed** and need the
owner's approval before being built; features marked _later_ are not in the first build.

## 1. Global rules

1. Unauthenticated users can only see `(marketing)` and `(auth)` routes. Anything under `(app)`
   redirects to `/login` with a return path.
2. After login, a user who is not onboarded is redirected to `/onboarding` until it is complete.
3. Unverified users can enter the app but see a persistent "verify your email" banner and
   cannot post (standups, forum, composer).
4. API `401` → go to `/login`. API `403` for a Pro feature → show the upgrade prompt, not an error.
5. Every data screen has three explicit states: loading (skeleton), empty (explain what to do
   next) and error (message with retry).
6. All dates and "today" are shown in the user's own timezone.
7. Theme (light or dark) is available from the header or user menu everywhere.

8. Unexpected errors show a friendly error screen with a next step and the error event ID, and
   are reported to Sentry. Expected errors (validation, `401`, `403`, `404`) are shown in context and
   not reported (`docs/MONITORING.md`).

## 2. Route map

### Auth group `(auth)`

| Route              | Purpose                          |
| ------------------ | -------------------------------- |
| `/login`           | Email and password, or GitHub.   |
| `/signup`          | Create account.                  |
| `/verify-email`    | Pending verification and resend. |
| `/forgot-password` | Request a reset link.            |
| `/reset-password`  | Set a new password.              |
| `/onboarding`      | Multi-step profile setup.        |

### App group `(app)` — shell: shadcn dashboard sidebar + header

| Route                                        | Screen                                                                           | Phase |
| -------------------------------------------- | -------------------------------------------------------------------------------- | ----- |
| `/dashboard`                                 | Today's standup, streak, weekly score, club snapshot, notifications peek         | 1     |
| `/standup`                                   | Create or edit today's standup                                                   | 1     |
| `/standup/history`                           | Past standups by date range                                                      | 1     |
| `/ship-logs`                                 | Ship logs and GitHub suggestions                                                 | 2     |
| `/clubs`                                     | Browse clubs, join requests, season state                                        | 1     |
| `/clubs/[clubId]`                            | Club board, members, weekly report, chat entry                                   | 1     |
| `/clubs/[clubId]/manage`                     | Leader: join requests                                                            | 1     |
| `/leaderboard`                               | Season leaderboard                                                               | 1     |
| `/progress`                                  | My progress and weekly report                                                    | 1     |
| `/profile/[userId]`                          | Public profile and project                                                       | 1     |
| `/projects/[projectId]`                      | Project page and milestones                                                      | 1     |
| `/composer`                                  | Write, AI-draft, publish or schedule                                             | 2     |
| `/composer/scheduled`                        | Scheduled posts                                                                  | 2     |
| `/forum` and `/forum/[postId]`               | Forum                                                                            | 2     |
| `/network`                                   | Followers, following, feed                                                       | 2     |
| `/events` and `/events/[eventId]`            | Events and RSVP                                                                  | 2     |
| `/collaborators`                             | Collaborator board                                                               | 2     |
| `/messages` and `/messages/[conversationId]` | Chat                                                                             | 2     |
| `/rooms`                                     | Short rooms (definition open)                                                    | 2     |
| `/notifications`                             | Notification list and preferences                                                | 1     |
| `/ai/matches`                                | AI matching                                                                      | 3     |
| `/ai/assistant`                              | Knowledge assistant                                                              | 3     |
| `/settings`                                  | Account, notifications, integrations (GitHub, WhatsApp, LinkedIn), plan, privacy | 1     |
| `/billing`                                   | Plan, checkout, cancel                                                           | 1     |
| `/tutors`, `/sessions/[id]`                  | Tutors (scope undecided)                                                         | 4     |
| `/admin/*`                                   | Admin dashboard (ADMIN only; moderation also moderators)                         | 3     |

Phases follow the system design: accountability loop first, then community, then AI, then tutors.

## 3. Primary flows

### 3.1 First visit to first standup

Visitor on `/` → `/signup` → `/verify-email` (pending) → email link → `/onboarding`
(profile → project → GitHub optional → reminder time and timezone → consent) → starter club
placement → `/dashboard` (empty state prompts "Post your first standup") → `/standup` → submit →
`/dashboard` shows streak 1.

### 3.2 Daily loop

Reminder notification → `/standup` (yesterday's unfinished items offered) → post → tick items
through the day on `/dashboard` or `/standup` → optional ship log suggestion accepted on
`/ship-logs` → club board shows status.

### 3.3 Join a club

`/clubs` → pick a club → "Request to join" (only during the join window; otherwise show when the
next window opens) → pending state → leader approves on `/clubs/[id]/manage` → member sees the
club board.

### 3.4 Composer

`/composer` → write text → optionally attach a ship log → optionally "Write with AI" (shows
remaining quota) → choose targets (platform, LinkedIn) → Publish now, or (Pro) set a time per
target → confirmation → appears under `/composer/scheduled` if scheduled. Free users who choose
a time see the upgrade prompt.

### 3.5 Upgrade

Pro-gated screen or `/billing` → plan comparison → checkout (external payment page) → return to
`/billing` showing the new plan.

## 4. Navigation

- **Sidebar (app):** Dashboard, Standup, Clubs, Leaderboard, Progress, Ship logs, Composer,
  Forum, Network, Events, Collaborators, Messages, AI (matching, assistant), Settings.
  Items for later phases are hidden until built.
- **Header:** page title, search (later), notifications bell, theme toggle, user menu.
- **Marketing header:** logo, Features, Pricing, Community, Blog, About, Log in, Sign up.

## 5. Open questions for this document

- Final route names (confirm before building).
- Whether `/billing` is separate from `/settings`.
- Which Phase 2 screens the owner wants first.
