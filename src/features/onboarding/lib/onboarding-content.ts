import { HandCoins, Rocket, TrendingUp, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  FocusValue,
  SituationValue,
  SkillValue,
} from "@/features/onboarding/types/onboarding-types";

/**
 * Static copy, options and limits for the onboarding steps (adapted from the owner's reference
 * screenshots in `public/screenshots/`, D37). Limits marked TO CONFIRM must match the backend's
 * validation once it exists.
 *
 * @packageDocumentation
 */

export const onboardingSteps = [
  {
    id: "profile",
    title: "First, you",
    description:
      "How you show up on your profile and in your club. You can change all of it later.",
  },
  {
    id: "startups",
    title: "Your startups",
    description: "Paste a landing page and the name fills in. Add as many as you are building.",
  },
  {
    id: "github",
    title: "Connect GitHub",
    description:
      "Your commits fill your activity graph: public proof that you ship. Optional, and you can connect later from your profile.",
  },
  {
    id: "situation",
    title: "Your current situation",
    description: "This stays private. It tunes your coaching and day plans to your reality.",
  },
  {
    id: "focus",
    title: "What is your focus right now?",
    description: "Your first tasks are suggested from this goal. You can edit them next.",
  },
  {
    id: "tasks",
    title: "First tasks",
    description:
      "StartupsClub runs on one habit: ship something small every day. Keep the ones that fit, remove the rest and add your own. Finish a task to start your streak.",
  },
  {
    id: "reminders",
    title: "Reminders and privacy",
    description: "Pick when we remind you to post your standup each day.",
  },
] as const;

export type OnboardingStepId = (typeof onboardingSteps)[number]["id"];

/** Steps that can be skipped without filling anything in. */
export const optionalSteps: readonly OnboardingStepId[] = ["startups", "github"];

export const situations: readonly { value: SituationValue; title: string; description: string }[] =
  [
    {
      value: "full-time",
      title: "Full-time on my startup",
      description: "All in. This is the job.",
    },
    {
      value: "side-project",
      title: "Building on the side",
      description: "Nights and weekends around a day job.",
    },
    { value: "student", title: "Student", description: "Shipping between classes." },
    {
      value: "agency",
      title: "Agency or freelance",
      description: "Client work funds the products.",
    },
    { value: "exploring", title: "Exploring ideas", description: "Still looking for the one." },
  ];

export const skills: readonly { value: SkillValue; label: string }[] = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "product", label: "Product" },
];

export const focuses: readonly {
  value: FocusValue;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "launch-mvp",
    title: "Launch the MVP",
    description: "Get the first version into strangers' hands.",
    icon: Rocket,
  },
  {
    value: "first-customer",
    title: "Land the first customer",
    description: "One paying stranger changes everything.",
    icon: HandCoins,
  },
  {
    value: "grow-revenue",
    title: "Grow revenue",
    description: "Turn a trickle into rent money.",
    icon: TrendingUp,
  },
  {
    value: "ship-faster",
    title: "Ship faster",
    description: "More output, less thrash.",
    icon: Zap,
  },
];

/** Field limits. TO CONFIRM with the backend (D37). */
export const onboardingLimits = {
  name: 80,
  handleMin: 3,
  handleMax: 20,
  location: 80,
  bio: 160,
  startupName: 60,
  tagline: 120,
  startups: 5,
  taskTitle: 120,
  tasks: 10,
  photoBytes: 2 * 1024 * 1024,
} as const;

/** Lowercase letters, digits and underscores. TO CONFIRM with the backend (D37). */
export const handlePattern = /^[a-z0-9_]+$/;

export const defaultReminderTime = "09:00";
