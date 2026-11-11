# User Stories — StartupsClub Web

Format: _As a [user], I want [goal], so that [benefit]._ Each story has acceptance criteria (AC).
Stories cover Phase 1 (accountability loop) in detail and later phases briefly.

## Visitor

**US-V1** As a visitor, I want to understand what StartupsClub does and what it costs, so that I
can decide to sign up.

- AC: home, features and pricing pages explain the product; pricing shows Free and Pro.
- AC: every page has a clear sign-up call to action; light and dark mode work.

**US-V2** As a visitor, I want to read legal pages and the FAQ, so that I can trust the product.

- AC: privacy, terms and FAQ pages exist and are linked from the footer.

## New member

**US-N1** As a new member, I want to sign up with email or GitHub, so that I can start quickly.

- AC: form validation messages are specific; a verification-pending screen is shown after sign-up.

**US-N2** As a new member, I want a short onboarding, so that my profile and project are ready.

- AC: steps can be saved and resumed; I cannot reach the app until onboarding is complete.
- AC: I set my reminder time and timezone and accept the privacy and AI notice.

## Daily use

**US-D1** As a member, I want to post today's standup in under a minute, so that checking in
stays easy.

- AC: yesterday's unfinished items are offered; I can add blockers; only one standup per day.

**US-D2** As a member, I want to tick items done through the day, so that my progress is accurate.

- AC: ticking updates immediately and survives a refresh.

**US-D3** As a member, I want to choose what my club sees of my standup, so that I can keep
sensitive items private.

- AC: status is always visible; I can hide individual items. (Design pending confirmation.)

**US-D4** As a member, I want my streak and weekly progress on one dashboard, so that I see
whether I am on track.

- AC: dashboard shows today's standup, streak, weekly score breakdown and club snapshot.

**US-D5** As a member, I want GitHub-based ship log suggestions, so that logging what I shipped
takes seconds.

- AC: I can accept, edit or dismiss each suggestion; nothing is published without my action.

## Clubs and seasons

**US-C1** As a member, I want to request to join a club during the join window, so that I belong
to a small accountability group.

- AC: the UI explains the three-day join window and one-club-per-season rule.

**US-C2** As a member, I want to see my club's board for a date, so that I know who has checked in.

- AC: each member row shows status, items done and ship logs.

**US-C3** As a club leader, I want to approve or reject join requests, so that the club stays healthy.

- AC: pending requests are listed with the requester's profile.

**US-C4** As a member, I want to see the leaderboard, so that my club has a goal.

- AC: top 10 plus my club's position; a "most improved" board; minimum-members rule explained.

## Posting

**US-P1** As a member, I want to write one post and publish it on StartupsClub and LinkedIn, so
that I do not repeat myself.

- AC: I can attach a ship log and choose both targets or one.

**US-P2** As a Pro member, I want to schedule each target at its own date and time.

- AC: a free member who tries to schedule sees a clear upgrade prompt.

**US-P3** As a member, I want the AI to draft a post from a topic and a ship log, so that I can
start from something.

- AC: remaining monthly AI quota is visible; generating counts against it; I approve before posting.

## Profiles and plans

**US-R1** As a member, I want a profile and project page with milestones, so that others see my work.
**US-R2** As a member, I want to upgrade to Pro and see my plan, so that I can unlock AI and scheduling.

- AC: Pro-gated areas explain what Pro adds; cancel is available.

## Notifications

**US-NT1** As a member, I want reminders and updates in the app, so that I do not miss a standup.

- AC: list, mark as read, mark all as read, preferences.

## Later phases (summary)

- Community: forum, network, events, collaborator board, chat (US-CM*).
- AI: coach feedback, matching, knowledge assistant (US-AI*).
- Admin: manage clubs, seasons, events; moderation queue; analytics (US-AD*).
- Tutors: only if confirmed in scope (US-TU*).

Detailed stories for later phases are written when the phase starts, after the owner confirms the
related open decisions.
