/**
 * Every product feature shown on the marketing site, grouped. This one array drives both the
 * Features page and the Free/Pro comparison table on the pricing page, so the two cannot drift.
 * Wording is owner-approved (12 Nov 2026). Plan decisions: docs/DECISIONS.md D21–D24.
 * No prices, numbers or claims beyond what is written here.
 *
 * @packageDocumentation
 */

/** A comparison cell: `true` included, `false` not included, or a short value shown as text. */
export type PlanCell = boolean | string;

export type Feature = {
  /** Stable id: used for keys and to pair a feature with its product mockup. */
  id: string;
  name: string;
  /** One line for the comparison table. */
  summary: string;
  /** Two or three sentences for the Features page. */
  description: string;
  plan: "both" | "pro";
  free: PlanCell;
  pro: PlanCell;
};

export type FeatureGroup = {
  /** Also the in-page anchor on the Features page (`/features#<id>`). */
  id: string;
  name: string;
  features: Feature[];
};

export const featureGroups: FeatureGroup[] = [
  {
    id: "accountability",
    name: "Accountability",
    features: [
      {
        id: "daily-standup",
        name: "Daily standup",
        summary:
          "One check-in a day: list your to-dos, tick them off through the day, note blockers.",
        description:
          "One check-in a day: list your to-dos, tick them off through the day, note blockers. Unfinished items are offered again tomorrow. Editable until the day ends.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "ship-logs",
        name: "Ship logs",
        summary: "A permanent record of what you shipped.",
        description:
          "A permanent record of what you shipped. Connect GitHub and StartupsClub suggests entries from your commits; nothing is saved until you confirm it.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "streaks-and-milestones",
        name: "Streaks and milestones",
        summary: "Every check-in extends your streak.",
        description:
          "Every check-in extends your streak. Set milestones on your project and mark them complete as you reach them.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "weekly-progress-report",
        name: "Weekly progress report",
        summary:
          "A weekly summary of your consistency, completion and shipping, for you and for your club.",
        description:
          "A weekly summary of your consistency, completion and shipping, for you and for your club.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "profile-and-project-page",
        name: "Profile and project page",
        summary: "A real profile and a page for what you are building.",
        description:
          "A real profile and a page for what you are building, with milestones and your progress history.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "whatsapp-check-in",
        name: "WhatsApp check-in",
        summary: "Post your standup from WhatsApp when you are away from your desk.",
        description: "Post your standup from WhatsApp when you are away from your desk.",
        plan: "both",
        free: true,
        pro: true,
      },
    ],
  },
  {
    id: "clubs-and-seasons",
    name: "Clubs and seasons",
    features: [
      {
        id: "clubs",
        name: "Clubs",
        summary: "Small groups of up to 20 builders who see each other's check-ins and ship logs.",
        description:
          "Small groups of up to 20 builders who see each other's check-ins and ship logs. A club leader approves who joins; new members begin in a starter club.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "seasons",
        name: "Seasons",
        summary: "Six-week cycles.",
        description:
          "Six-week cycles. Clubs form in the first three days and stay fixed until the season ends.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "club-leaderboard",
        name: "Club leaderboard",
        summary:
          "Clubs are ranked on how consistently their members show up, not on how many members they have.",
        description:
          "Clubs are ranked on how consistently their members show up, not on how many members they have. Resets every season.",
        plan: "both",
        free: true,
        pro: true,
      },
    ],
  },
  {
    id: "community",
    name: "Community",
    features: [
      {
        id: "forum",
        name: "Forum",
        summary: "Posts, comments and reactions for the whole community, with search.",
        description: "Posts, comments and reactions for the whole community, with search.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "member-network",
        name: "Member network",
        summary: "Follow other builders and see their updates in your feed.",
        description: "Follow other builders and see their updates in your feed.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "events",
        name: "Events",
        summary: "Browse community events and RSVP.",
        description: "Browse community events and RSVP.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "collaborator-board",
        name: "Collaborator board",
        summary: "Find or offer help by skill, and connect with co-builders.",
        description: "Find or offer help by skill, and connect with co-builders.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "chat",
        name: "Chat",
        summary: "Real-time club chat and direct messages.",
        description: "Real-time club chat and direct messages.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "short-rooms",
        name: "Short rooms",
        summary: "Live group sessions that members open and join.",
        description:
          "Live group sessions that members open and join. Creating a room is a Pro feature; any signed-in member can join.",
        plan: "both",
        free: "Join",
        pro: "Create and join",
      },
    ],
  },
  {
    id: "posting",
    name: "Posting",
    features: [
      {
        id: "post-composer",
        name: "Post composer",
        summary: "Write once and publish to StartupsClub and LinkedIn.",
        description:
          "Write once and publish to StartupsClub and LinkedIn. Attach a ship log to show what you built.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "instant-posting",
        name: "Instant posting",
        summary: "Publish to both places straight away.",
        description: "Publish to both places straight away.",
        plan: "both",
        free: true,
        pro: true,
      },
      {
        id: "ai-written-posts",
        name: "AI-written posts",
        summary: "The AI drafts a post from a topic and a ship log.",
        description:
          "The AI drafts a post from a topic and a ship log. The quota resets monthly with no rollover, and a post counts when it is generated even if you do not publish it.",
        plan: "both",
        free: "5 per month",
        pro: "Higher quota",
      },
      {
        id: "post-scheduling",
        name: "Post scheduling",
        summary: "Pick a date and time, with a separate time for StartupsClub and LinkedIn.",
        description: "Pick a date and time, with a separate time for StartupsClub and LinkedIn.",
        plan: "pro",
        free: false,
        pro: true,
      },
      {
        id: "watermark",
        name: "Watermark",
        summary: "Posts carry a StartupsClub watermark; Pro members can remove it or keep it.",
        description: "Posts carry a StartupsClub watermark; Pro members can remove it or keep it.",
        plan: "both",
        free: "Always shown",
        pro: "Your choice",
      },
    ],
  },
  {
    id: "ai",
    name: "AI",
    features: [
      {
        id: "ai-standup-coach",
        name: "AI Standup Coach",
        summary: "Short, private feedback on each standup.",
        description:
          "Short, private feedback on each standup: vague goals, items that keep carrying over, blockers that keep returning. Only you can see it.",
        plan: "pro",
        free: false,
        pro: true,
      },
      {
        id: "ai-matching",
        name: "AI partner and co-founder matching",
        summary:
          "Recommends clubs, people and collaborators that fit your skills, goals and project stage.",
        description:
          "Recommends clubs, people and collaborators that fit your skills, goals and project stage.",
        plan: "pro",
        free: false,
        pro: true,
      },
      {
        id: "ai-knowledge-assistant",
        name: "AI knowledge assistant",
        summary: "Ask a question and get an answer drawn from community posts.",
        description:
          "Ask a question and get an answer drawn from community posts, with links to the sources.",
        plan: "pro",
        free: false,
        pro: true,
      },
    ],
  },
  {
    id: "learning",
    name: "Learning",
    features: [
      {
        id: "tutors-and-classrooms",
        name: "Tutors and classrooms",
        summary: "Learn from experienced members in paid classrooms.",
        description:
          "Learn from experienced members in paid classrooms. The tutor decides how long a classroom runs, and each class lasts between 30 minutes and 1 hour 15 minutes.",
        plan: "both",
        free: "Pay per classroom",
        pro: "Pay per classroom",
      },
    ],
  },
];

/** Shown under the home pricing cards and under the comparison table. */
export const aiQuotaFootnote =
  "An AI-written post counts toward your monthly quota when it is generated, even if you do not publish it.";
