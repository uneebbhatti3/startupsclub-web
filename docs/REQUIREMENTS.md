# Requirements — StartupsClub Web

Scope: the **frontend**. Backend behaviour is only listed where the UI depends on it.
IDs are stable; reference them in pull requests. Priority: M = must, S = should, C = could.

## 1. Functional requirements

### Authentication and onboarding

| ID        | Requirement                                                                                     | P   |
| --------- | ----------------------------------------------------------------------------------------------- | --- |
| FR-AUTH-1 | Sign up with email and password; show email-verification pending state.                         | M   |
| FR-AUTH-2 | Sign in with email and password, and with GitHub.                                               | M   |
| FR-AUTH-3 | Forgot and reset password. The UI never reveals whether an email exists.                        | M   |
| FR-AUTH-4 | Unverified users can sign in but see a banner and cannot post.                                  | M   |
| FR-AUTH-5 | Sign out; account deletion with confirmation.                                                   | M   |
| FR-ONB-1  | Redirect to onboarding until the user is onboarded; steps are resumable.                        | M   |
| FR-ONB-2  | Steps: profile basics, project, connect GitHub (optional), reminder time and timezone, consent. | M   |

### Accountability core

| ID       | Requirement                                                                      | P   |
| -------- | -------------------------------------------------------------------------------- | --- |
| FR-STD-1 | Create today's standup (items, optional blockers); one per day.                  | M   |
| FR-STD-2 | Edit today's standup; tick items done through the day.                           | M   |
| FR-STD-3 | Offer yesterday's unfinished items as the starting list.                         | S   |
| FR-STD-4 | Standup history with date range.                                                 | M   |
| FR-STD-5 | Per-item visibility control; status always visible to the club (design pending). | S   |
| FR-SHP-1 | List, create ship logs; review GitHub suggestions: accept, edit, dismiss.        | M   |
| FR-CLB-1 | Browse clubs; request to join; show season join-window state.                    | M   |
| FR-CLB-2 | Club board for a date: each member's status, items done, ship logs.              | M   |
| FR-CLB-3 | Leader view: approve or reject join requests.                                    | M   |
| FR-SSN-1 | Show current season, countdown and summary.                                      | S   |
| FR-PRG-1 | Dashboard: today's standup, streak, weekly progress, club snapshot.              | M   |
| FR-PRG-2 | Weekly progress report for the member and for the club.                          | S   |
| FR-PRG-3 | Leaderboard (top 10, viewer's club, most improved).                              | S   |
| FR-WA-1  | Link WhatsApp number with a verification code.                                   | C   |

### Community

| ID       | Requirement                                                                          | P   |
| -------- | ------------------------------------------------------------------------------------ | --- |
| FR-FRM-1 | Forum: list, view, create, edit, delete posts; comments; reactions; report.          | M   |
| FR-FRM-2 | Search posts.                                                                        | S   |
| FR-NET-1 | Follow and unfollow; followers and following lists; following feed.                  | S   |
| FR-EVT-1 | Events list and detail; RSVP and cancel RSVP.                                        | S   |
| FR-COL-1 | Collaborator board: browse, filter by type and skills, post, respond.                | S   |
| FR-CHT-1 | Conversations list and message thread with typing and presence.                      | S   |
| FR-CMP-1 | Composer: write a post, attach a ship log, choose platform and/or LinkedIn targets.  | M   |
| FR-CMP-2 | Composer: publish now, or schedule each target separately (Pro).                     | M   |
| FR-CMP-3 | Composer: AI draft from a topic and optional ship log; show remaining monthly quota. | S   |
| FR-CMP-4 | Composer: scheduled list; reschedule or cancel a target.                             | S   |
| FR-CMP-5 | Connect LinkedIn account.                                                            | S   |

### Profiles, plans, notifications

| ID       | Requirement                                                                   | P   |
| -------- | ----------------------------------------------------------------------------- | --- |
| FR-PRF-1 | Public profile and project page with milestones and read-only progress.       | M   |
| FR-PRF-2 | Edit own profile and projects; add and complete milestones.                   | M   |
| FR-PLN-1 | Pricing and plan comparison; checkout redirect; cancel; current subscription. | M   |
| FR-PLN-2 | Pro-gated features show a clear upgrade prompt, never a broken state.         | M   |
| FR-NTF-1 | Notification list, mark read, mark all read; preferences.                     | M   |

### AI features (Pro unless noted)

| ID      | Requirement                                                                         | P   |
| ------- | ----------------------------------------------------------------------------------- | --- |
| FR-AI-1 | Standup coach: show private feedback under a standup; weekly summary.               | S   |
| FR-AI-2 | Matching: recommended clubs and people; dismiss.                                    | S   |
| FR-AI-3 | Knowledge assistant: ask a question, see answer with source links; semantic search. | S   |
| FR-AI-4 | Moderation (Both): moderators see flagged reports in the admin queue.               | S   |

### Admin

| ID       | Requirement                                                 | P   |
| -------- | ----------------------------------------------------------- | --- |
| FR-ADM-1 | Admin dashboard shell, user role and capability management. | S   |
| FR-ADM-2 | Manage clubs, seasons, events; moderation queue; analytics. | S   |

### Marketing site

| ID       | Requirement                                                       | P   |
| -------- | ----------------------------------------------------------------- | --- |
| FR-MKT-1 | Multi-page public site as listed in `docs/LANDING_PAGE.md`.       | M   |
| FR-MKT-2 | Light and dark mode on every page.                                | M   |
| FR-MKT-3 | GSAP animations and smooth scrolling that respect reduced-motion. | M   |

## 2. Non-functional requirements

| ID     | Requirement                                                                                                                       |
| ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| NFR-1  | Responsive from 360 px upward; usable on mobile.                                                                                  |
| NFR-2  | WCAG 2.1 AA (see `docs/ACCESSIBILITY.md`).                                                                                        |
| NFR-3  | Light and dark themes with no flash on load.                                                                                      |
| NFR-4  | Marketing pages: Lighthouse performance 90+ on mobile target (to be measured, not assumed).                                       |
| NFR-5  | API responses within 2 s are a backend target; the UI must show loading, empty and error states for every request.                |
| NFR-6  | Strict TypeScript; no `any`; formatting and lint clean in CI.                                                                     |
| NFR-7  | No secrets in the repository; HTTPS only in production.                                                                           |
| NFR-8  | Modular code: one feature folder per product feature.                                                                             |
| NFR-9  | Every route has at least one Playwright smoke test (target; see `docs/TESTING.md`).                                               |
| NFR-10 | Latest two versions of Chrome, Edge, Firefox, Safari (to confirm).                                                                |
| NFR-11 | Unexpected errors and performance traces are reported to Sentry with release and environment tags; expected `4xx` errors are not. |
| NFR-12 | No personal data in error reports: user context is the opaque user ID only; Session Replay off unless approved.                   |
| NFR-13 | Error screens are friendly, offer a next step and show the error event ID.                                                        |
| NFR-14 | Source maps are uploaded to Sentry and are not served publicly.                                                                   |

## 3. Out of scope for the frontend repository

Server logic, database, authentication internals, AI model calls, queues, WhatsApp and payment
webhooks. These belong to the backend repository.
