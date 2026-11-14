import { waitlistVisible } from "@/config/site";

/**
 * Static copy for the marketing home page. Facts come from docs/PRD.md.
 * No prices, user numbers, testimonials or customer logos: none exist yet, so none are invented.
 * All wording is a draft for the owner to approve.
 *
 * @packageDocumentation
 */

export type NavLink = {
  label: string;
  href: string;
};

/** Header links. Sections of the home page, except pages that exist on their own. */
export const navLinks: NavLink[] = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Features", href: "/features" },
  { label: "Seasons", href: "/#seasons" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
];

/**
 * The only call to action while StartupsClub is pre-launch. Sign-up and log-in links are removed
 * until those pages exist (docs/DECISIONS.md D26).
 */
export const waitlistLink = {
  label: "Join waitlist",
  href: "/waitlist",
} as const satisfies NavLink;

/** Whether the "Join waitlist" buttons render. Controlled by `waitlistVisible`. */
export const showWaitlist = waitlistVisible;

export const hero = {
  eyebrow: "Accountability for founders and developers",
  titleLines: ["Show up daily.", "Ship what you said."],
  description:
    "Post a daily standup, log what you ship, and let a small club keep you honest. StartupsClub turns good intentions into a visible record of work.",
  note: "Free to start. One standup a day is all it takes.",
} as const;

export type Problem = {
  title: string;
  description: string;
  icon: "buried" | "anonymous" | "unaccountable";
};

export const problems: Problem[] = [
  {
    icon: "buried",
    title: "Useful posts get buried",
    description: "Group chats move fast. The update you shared this morning is gone by lunch.",
  },
  {
    icon: "anonymous",
    title: "Nobody knows who is building what",
    description: "Members are a name and a number. There is no record of the work behind them.",
  },
  {
    icon: "unaccountable",
    title: "Nothing holds you to your goals",
    description: "You announce a plan, the chat reacts, and nobody notices when it quietly dies.",
  },
];

export type Step = {
  title: string;
  description: string;
};

export const steps: Step[] = [
  {
    title: "Post your standup",
    description:
      "Each morning, list what you will get done today and anything blocking you. It takes a minute.",
  },
  {
    title: "Ship and log it",
    description:
      "Tick items off through the day. Connect GitHub and StartupsClub suggests ship logs from your commits for you to confirm.",
  },
  {
    title: "Stay accountable",
    description:
      "Your club sees who checked in and who did not. Streaks and weekly reports keep the habit visible.",
  },
];

export const principles = {
  lead: "Consistency beats intensity.",
  rest: "StartupsClub rewards showing up and finishing what you planned, never raw volume.",
  tags: [
    "One standup a day",
    "Clubs of up to 20",
    "Six-week seasons",
    "Ship logs from GitHub",
    "Private AI feedback",
  ],
} as const;

export type Plan = {
  name: string;
  tagline: string;
  /** Shown under the plan name. `null` when there is nothing to add. */
  priceNote: string | null;
  cta: NavLink;
  featured: boolean;
  features: string[];
};

/** Prices are not decided yet (docs/DECISIONS.md O3), so only the plan contents are shown. */
export const plans: Plan[] = [
  {
    name: "Free",
    tagline: "Everything you need to build the daily habit.",
    priceNote: null,
    cta: waitlistLink,
    featured: false,
    features: [
      "Daily standups, history and streaks",
      "Ship logs to record what you ship",
      "Six-week seasons and the club leaderboard",
      "Post to StartupsClub and LinkedIn instantly",
      "5 AI-written posts each month (resets monthly, no rollover)",
      "Posts carry a StartupsClub watermark",
    ],
  },
  {
    name: "Pro",
    tagline: "AI that coaches you, and tools to grow your audience.",
    priceNote: "Pricing announced soon",
    cta: waitlistLink,
    featured: true,
    features: [
      "Everything in Free",
      "Schedule posts, with a separate time for StartupsClub and LinkedIn",
      "A higher monthly AI post quota",
      "Choose to remove the watermark or keep it",
      "AI Standup Coach with private feedback",
      "AI partner and co-founder matching",
      "AI knowledge assistant",
    ],
  },
];

export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "What is a daily standup?",
    answer:
      "A short check-in you post once a day: the to-dos you plan to finish and anything blocking you. You tick items off as you go, and you can edit the standup until the day ends.",
  },
  {
    question: "How do clubs work?",
    answer:
      "A club is a small group of up to 20 members who see each other's check-ins and ship logs. A club leader approves join requests, and new members start in a starter club.",
  },
  {
    question: "What is a season?",
    answer:
      "A season is a six-week cycle. Clubs form during the first three days, then stay fixed until the season ends, so everyone has a clear start, a finish line and a fresh start next time.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. Daily standups, ship logs, six-week seasons and the club leaderboard are free, and you can post to StartupsClub and LinkedIn instantly, with 5 AI-written posts each month and a StartupsClub watermark. Pro adds post scheduling, a higher monthly AI post quota, the choice to remove the watermark, the AI Standup Coach, partner and co-founder matching, and the AI knowledge assistant.",
  },
  {
    question: "Will StartupsClub post to LinkedIn without asking me?",
    answer:
      "No. Nothing is published on your behalf without your confirmation. That applies to ship logs suggested from GitHub and to posts drafted by the AI.",
  },
];

export const finalCta = {
  title: "Your first standup takes a minute.",
  description:
    "Start today, find your club, and see how far six consistent weeks can take your project.",
} as const;

export const footerGroups: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Features", href: "/features" },
      { label: "Seasons", href: "/#seasons" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Get started",
    links: [...(showWaitlist ? [waitlistLink] : []), { label: "FAQ", href: "/#faq" }],
  },
];
