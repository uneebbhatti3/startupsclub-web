/**
 * Shapes for the member dashboard (`GET /me/dashboard`, API_CONTRACT section 9). The backend has
 * not published this body yet, so these are the frontend's proposal, built from US-D4 and the
 * contribution graph the owner asked for (D42). Check them against the backend when the endpoint exists.
 *
 * @packageDocumentation
 */

export type StandupItem = {
  id: string;
  text: string;
  done: boolean;
};

export type TodayStandup = {
  id: string;
  /** ISO 8601, UTC. */
  postedAt: string;
  items: StandupItem[];
  blockers: string | null;
};

export type StreakSummary = {
  /** Days in a row with a posted standup, including today if posted. */
  current: number;
  best: number;
};

/** One day of standup activity, for the contribution graph. */
export type ActivityDay = {
  /** Local calendar date, `YYYY-MM-DD`. */
  date: string;
  /** Standup items done that day; `0` when no standup was posted or nothing was done. */
  itemsDone: number;
};

export type ClubSnapshot = {
  id: string;
  name: string;
  seasonWeek: number;
  seasonWeeks: number;
  membersPostedToday: number;
  memberCount: number;
  /** Club weekly score out of 100. */
  score: number;
  /** Days in a row the whole club checked in. */
  clubStreak: number;
};

export type DashboardNotification = {
  id: string;
  message: string;
  /** ISO 8601, UTC. */
  createdAt: string;
  read: boolean;
};

export type Dashboard = {
  /** `null` until the member posts today's standup. */
  today: TodayStandup | null;
  streak: StreakSummary;
  /** The last 6 months of standup activity, oldest first, ending today. */
  activity: ActivityDay[];
  /** `null` when the member is not in a club this season. */
  club: ClubSnapshot | null;
  /** The latest few, newest first. */
  notifications: DashboardNotification[];
};

/** Tick or untick one item of today's standup. */
export type ToggleStandupItemInput = {
  standupId: string;
  itemId: string;
  done: boolean;
};

/** Post today's standup. */
export type CreateStandupInput = {
  items: string[];
  blockers: string | null;
};

/** Add one item to today's standup. */
export type AddStandupItemInput = {
  standupId: string;
  text: string;
};
