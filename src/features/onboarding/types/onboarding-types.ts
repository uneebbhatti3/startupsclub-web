/**
 * Shapes for the onboarding flow: the draft the wizard edits, the option values, and what the
 * fixture services return. The backend has no onboarding module yet, so these are the frontend's
 * proposal and must be checked against the backend when it exists (API_CONTRACT section 3).
 *
 * @packageDocumentation
 */

export type SituationValue = "full-time" | "side-project" | "student" | "agency" | "exploring";

export type SkillValue = "engineering" | "design" | "marketing" | "sales" | "product";

export type FocusValue = "launch-mvp" | "first-customer" | "grow-revenue" | "ship-faster";

export type ProfileDraft = {
  name: string;
  handle: string;
  location: string;
  bio: string;
  /** Chosen photo, uploaded on completion. `null` keeps the default avatar. */
  photo: File | null;
};

export type StartupDraft = {
  /** Local id for list keys; not sent to the API. */
  id: string;
  url: string;
  name: string;
  tagline: string;
};

export type TaskDraft = {
  id: string;
  title: string;
  /** Unticked tasks are not saved. */
  selected: boolean;
};

export type OnboardingDraft = {
  profile: ProfileDraft;
  startups: StartupDraft[];
  /** GitHub login when connected, otherwise `null` (the step is optional). */
  githubLogin: string | null;
  situation: SituationValue | null;
  skills: SkillValue[];
  focus: FocusValue | null;
  /** The focus the current `tasks` were suggested for, so a new focus re-seeds them. */
  tasksFocus: FocusValue | null;
  tasks: TaskDraft[];
  /** Daily reminder time, `HH:mm` in `timezone`. */
  reminderTime: string;
  /** IANA timezone, for example `Asia/Karachi`. */
  timezone: string;
  consent: boolean;
};

export type HandleAvailability = {
  handle: string;
  available: boolean;
};

/** Details read from a startup's landing page. */
export type StartupLookup = {
  name: string;
  tagline: string;
};

export type GithubConnection = {
  login: string;
};

export type OnboardingStatus = {
  completed: boolean;
};
