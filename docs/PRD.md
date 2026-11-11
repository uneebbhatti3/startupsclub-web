# Product Requirements Document (PRD) — StartupsClub

Status: v1, 11 Nov 2026. Source: the StartupsClub System Design and the FYP proposal.
This PRD describes the whole product. The frontend's share is in `docs/ROADMAP.md`.

## 1. Summary

StartupsClub is a web platform that helps startup founders and independent developers make
consistent progress. Members post a **daily standup**, log what they **shipped**, belong to a small
**club** that sees their progress, and compete in six-week **seasons**. AI features coach,
match and protect the community. A free plan and a paid (Pro) plan exist.

It is also the final year project of a three-person team (Uneeb Bhatti, Hadia Abid,
M. Ahtisham Shahid), designed so it can become a real startup after graduation. Lahore is the
first market.

## 2. Problem

Founder and developer communities run on WhatsApp, Discord and Telegram groups. Those tools
are built for conversation, not progress: members are anonymous, useful posts are buried, there is
no record of what each person is building, and nothing holds anyone to the goals they announce.
Groups go quiet and projects are abandoned before a first release. Lack of consistency and
accountability, more than lack of ideas, is a common reason early projects fail.

## 3. Users

| User                                   | Needs                                                                 |
| -------------------------------------- | --------------------------------------------------------------------- |
| Early-stage founder                    | Structure, peer feedback and accountability while building a product. |
| Developer / indie builder              | Stay consistent on side projects; find collaborators.                 |
| University student or final-year group | A serious peer group beyond class chat.                               |
| Club leader                            | See who is active, approve members, support the club.                 |
| Admin / moderator                      | Run clubs and seasons, moderate content, read analytics.              |
| Tutor (scope undecided)                | Run classrooms and one-to-one sessions.                               |

## 4. Goals and success measures

- A deployed, production-ready web app (Next.js frontend, NestJS API, PostgreSQL, AI layer).
- A pilot of at least **30 real users** in Lahore before the final defence.
- **Standup completion rate of at least 60%** among active pilot users.
- Evaluated AI components: matching relevance, moderation accuracy, disengagement prediction accuracy.
- Complete project documentation as per the FYP template.

- Errors and performance monitored with Sentry on both the backend and the frontend, with no
  personal data in telemetry (`docs/MONITORING.md`).

## 5. Product principles

1. Consistency over volume. The product rewards showing up and finishing, never raw quantity.
2. Real identity and real progress. Verified profiles; ship logs come from real activity.
3. Small groups. A club has at most 20 members.
4. Nothing is posted on a member's behalf without their confirmation.
5. AI for personal benefit is Pro. Background AI that protects the community is free.

## 6. Features

Numbering matches the system design. "Plan": Free, Pro, Both, or Admin.

### Platform foundation

| #   | Feature                     | Plan | Summary                                                                                             |
| --- | --------------------------- | ---- | --------------------------------------------------------------------------------------------------- |
| 1   | Authentication and accounts | Both | Email and password with verification; GitHub sign-in; cookie sessions.                              |
| 2   | Roles and access            | Both | Global ADMIN or MEMBER; tutor and moderator capabilities; club LEADER or MEMBER; plan FREE or PAID. |
| 3   | Onboarding                  | Both | Profile basics, project, optional GitHub, reminder time and timezone, privacy consent.              |
| 4   | Profiles and project pages  | Both | Verified identity, project page, milestones, read-only progress history.                            |

### Accountability core

| #   | Feature                       | Plan | Summary                                                                                                |
| --- | ----------------------------- | ---- | ------------------------------------------------------------------------------------------------------ |
| 5   | Daily standup                 | Both | One per user per day, editable until day end; items ticked off through the day; blockers.              |
| 6   | Ship logs                     | Both | Permanent record of what shipped; GitHub suggests entries, the member confirms.                        |
| 7   | Clubs                         | Both | Groups of up to 20; one club per member per season; leader approves joins; starter club for newcomers. |
| 8   | Seasons                       | Both | Six-week cycles; three-day join window; no changes after it closes.                                    |
| 9   | Streaks, milestones, progress | Both | Make consistency visible for members and clubs; weekly reports.                                        |
| 10  | WhatsApp check-in bot         | Both | Post a standup from WhatsApp. No Telegram bot.                                                         |

### Community

| #   | Feature                               | Plan                  | Summary                                                             |
| --- | ------------------------------------- | --------------------- | ------------------------------------------------------------------- |
| 11  | Global forum                          | Both                  | Posts, comments, reactions, reports, search.                        |
| 12  | Short rooms                           | Both                  | Definition still open (see Open decisions).                         |
| 13  | Member network                        | Both                  | Follow members; following feed.                                     |
| 14  | Events                                | Both                  | Browse events and RSVP.                                             |
| 15  | Collaborator board                    | Both                  | Find and offer collaboration by type and skills.                    |
| 16  | Real-time chat and voice              | Both                  | Club chat and direct messages; voice deferred.                      |
| 28  | Post composer and LinkedIn scheduling | Both (scheduling Pro) | Write once, publish to the platform and LinkedIn, now or scheduled. |

Composer plan rules: Free gets instant posting to both places, **5 AI-written posts per month**
(reset monthly, no rollover, counted when generated, even if never posted) and a **watermark**.
Pro gets scheduling, a **higher** AI quota (number to be decided) and the **option** to remove
the watermark.

### Tutors and experts

| #   | Feature                                 | Plan | Summary                        |
| --- | --------------------------------------- | ---- | ------------------------------ |
| 17  | Tutors, classrooms, one-to-one sessions | Both | Scope in the FYP is undecided. |

### Platform services

| #   | Feature                    | Plan  | Summary                                                                     |
| --- | -------------------------- | ----- | --------------------------------------------------------------------------- |
| 18  | Notifications              | Both  | In-app and email, with preferences.                                         |
| 19  | Subscriptions and payments | Both  | Free and Pro plans through a payment gateway (provider undecided).          |
| 20  | Admin dashboard            | Admin | Users, clubs, seasons, events, moderation queue, analytics.                 |
| 21  | Public site                | Both  | Landing, pricing, about, legal pages and more (see `docs/LANDING_PAGE.md`). |

### AI layer

| #   | Feature                            | Plan | Summary                                                                  |
| --- | ---------------------------------- | ---- | ------------------------------------------------------------------------ |
| 22  | AI Standup Coach                   | Pro  | Short, private, constructive feedback on each standup; weekly summaries. |
| 23  | AI partner and co-founder matching | Pro  | Recommends compatible clubs, people and collaborators.                   |
| 24  | AI community knowledge assistant   | Pro  | Answers from community content with source links; semantic search.       |
| 25  | AI content moderation              | Both | Flags spam and abuse for moderator review.                               |
| 26  | AI disengagement prediction        | Both | Predicts members likely to go inactive; triggers nudges.                 |
| 27  | AI safeguards                      | Both | Protective checks around the AI layer.                                   |

## 7. Scoring and visibility (current design, to be confirmed)

- **Member weekly score /100:** Consistency 40, Completion 25, Shipping 20, Milestones 10,
  Support 5. Rates are capped; at most 5 to-dos a day count.
- **Club score:** average of member scores with inactive members counted as zero. Supporting
  stats: participation rate and club streak.
- **Leaderboard:** season-to-date average of weekly club scores; minimum 5 members; starter club
  excluded; tie-breakers are participation rate, then ship logs per member; resets each season;
  top 10 plus the viewer's club, and a "most improved" board.
- **Standup privacy (recommended):** status (posted, N of M done, streak) is always visible to the
  club; content visible by default with per-item hiding; AI coach feedback private to the member;
  risk scores never shown to members (the leader sees only an alert).

These are not final. See `docs/DECISIONS.md`.

## 8. Non-goals (for now)

- Native mobile apps. Telegram bot. Voice chat in v1. A paid member directory.
- Multiple communities created by users: only the admin creates clubs.

## 9. Open decisions (from the system design)

Short rooms definition; tutor module in or out of FYP scope; free members and the starter club;
sign-in methods beyond email and GitHub; payment gateway for Pakistan; moderator role; LLM
provider and budget; WhatsApp provider and costs; Pro AI quota number; standup privacy and
scoring confirmation. Tracked in `docs/DECISIONS.md`.

## 10. Risks

- Scope is large for a small team and a fixed academic timeline: phase the build.
- AI cost: per-user caps and queues are required.
- Pakistan payments and WhatsApp provider constraints may change plans.
- Gaming of scores and discouragement of low-ranked clubs: caps, top-10 view and a most-improved board.
- Telemetry could expose private standup or message content: Sentry is configured without Session
  Replay, with scrubbing and opaque user IDs only.
