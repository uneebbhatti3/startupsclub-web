# Roadmap — StartupsClub Web

Priorities set by the owner on 11 Nov 2026: **the proposal defence is not a priority driver.**
The landing site and the app are both built in full, in the order below. No dates are fixed
yet; add them when the owner sets them.

## Milestones

| #   | Milestone                  | Outcome                                                                                                                   | Depends on                  |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| M0  | Scaffold and tooling       | Next.js project created; Husky, Prettier, ESLint, CI, MCP, Playwright, Sentry working; docs in place                      | Owner approves `docs/`      |
| M1  | Design foundation          | Tokens, fonts, theme provider (light/dark), shadcn base components, icon rules                                            | M0; heading font decided    |
| M2  | Marketing site             | All pages in `docs/LANDING_PAGE.md`, GSAP and Locomotive Scroll, expressive buttons                                       | M1                          |
| M3  | App shell and auth screens | Dashboard shell (shadcn block), login, signup, verify, reset, onboarding                                                  | M1                          |
| M4  | Phase 1 screens            | Dashboard, standup, history, clubs, club board, leaderboard, progress, profile, project, notifications, settings, billing | M3                          |
| M5  | Phase 2 screens            | Ship logs, composer, forum, network, events, collaborators, messages, rooms                                               | M4; open decisions on rooms |
| M6  | Phase 3 screens            | AI matching, knowledge assistant, coach feedback in standup, admin                                                        | M4                          |
| M7  | Phase 4                    | Tutors and sessions — only if confirmed in FYP scope                                                                      | Decision                    |
| M8  | Real API integration       | Replace every `FIXTURE:` with API calls; end-to-end tests against a running backend                                       | Backend ready               |
| M9  | Hardening                  | Accessibility pass, performance pass, security review, Sentry alerts and noise review, production deploy                  | M8                          |

M2 and M3–M4 can run in parallel across the team. Suggested split (to confirm with the owner):
Uneeb leads M0 and M1 and the integration with the backend; Hadia and Ahtisham take M2 and
M3–M4 screens, assigned per page.

## Order inside a milestone

For every page: spec in docs → hard-coded data and types → UI → Playwright check in both themes
→ pull request.

## Not on the roadmap

Native mobile apps, voice chat, Telegram bot.
