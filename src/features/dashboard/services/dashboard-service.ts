import { toDateKey } from "@/features/dashboard/lib/dashboard-content";
import type {
  ActivityDay,
  AddStandupItemInput,
  CreateStandupInput,
  Dashboard,
  StandupItem,
  TodayStandup,
  ToggleStandupItemInput,
} from "@/features/dashboard/types/dashboard-types";

/**
 * Dashboard calls. The backend has no dashboard endpoint yet, so every function is a fixture that
 * waits briefly and returns believable data (docs/STATE_AND_DATA.md section 3). Each one names the
 * endpoint that replaces it. Nothing is stored: a refresh shows the fixture again.
 *
 * @packageDocumentation
 */

const fixtureDelayMs = 400;

/** 26 weeks, the range of the contribution graph. */
const activityDays = 26 * 7;

function wait(ms: number = fixtureDelayMs): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** An ISO time `minutes` before now, so the fixture always reads as recent. */
function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

/** A local id for items created by the fixtures. */
function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

/**
 * Six months of activity ending today. Same pattern on every load (no randomness), with the
 * 12 days before today all active to match the fixture streak, and today empty (not posted yet).
 */
function activityFixture(today: Date = new Date()): ActivityDay[] {
  const days: ActivityDay[] = [];
  for (let offset = activityDays - 1; offset >= 0; offset -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    const pattern = (offset * 37 + 11) % 13;
    let itemsDone = pattern < 4 ? 0 : pattern % 6;
    if (offset >= 1 && offset <= 12) {
      itemsDone = Math.max(itemsDone, 1 + (offset % 4));
    }
    if (offset === 0) {
      itemsDone = 0;
    }
    days.push({ date: toDateKey(date), itemsDone });
  }
  return days;
}

/** The signed-in member's dashboard. */
export async function getDashboard(): Promise<Dashboard> {
  // FIXTURE: replace with `apiClient.get<ApiSuccess<Dashboard>>("/me/dashboard")` (body TO CONFIRM).
  await wait();
  return {
    // FIXTURE: no standup yet today, so the dashboard opens on "Start standup".
    today: null,
    streak: { current: 12, best: 21 },
    activity: activityFixture(),
    club: {
      id: "club-1",
      name: "Night Shift Builders",
      seasonWeek: 3,
      seasonWeeks: 6,
      membersPostedToday: 9,
      memberCount: 14,
      score: 64,
      clubStreak: 5,
    },
    notifications: [
      {
        id: "notification-1",
        message: "Ayesha reacted to your standup.",
        createdAt: minutesAgo(25),
        read: false,
      },
      {
        id: "notification-2",
        message: "Your club moved up to 4th on the leaderboard.",
        createdAt: minutesAgo(140),
        read: false,
      },
      {
        id: "notification-3",
        message: "New ship log suggestion from your GitHub commits.",
        createdAt: minutesAgo(60 * 20),
        read: true,
      },
    ],
  };
}

/** Posts today's standup and returns it. */
export async function createStandup(input: CreateStandupInput): Promise<TodayStandup> {
  // FIXTURE: replace with `POST /standups` (API_CONTRACT section 5; body TO CONFIRM). One standup
  // per member per day is enforced by the backend.
  await wait();
  return {
    id: newId("standup"),
    postedAt: new Date().toISOString(),
    items: input.items.map((text) => ({ id: newId("item"), text, done: false })),
    blockers: input.blockers,
  };
}

/** Adds an item to today's standup and returns the saved item. */
export async function addStandupItem(input: AddStandupItemInput): Promise<StandupItem> {
  // FIXTURE: replace with `PATCH /standups/:id` (API_CONTRACT section 5; body TO CONFIRM).
  await wait(250);
  return { id: newId("item"), text: input.text, done: false };
}

/** Ticks or unticks one item of today's standup and returns the saved item. */
export async function setStandupItemDone(input: ToggleStandupItemInput): Promise<StandupItem> {
  // FIXTURE: replace with `PATCH /standups/:id` (API_CONTRACT section 5; body TO CONFIRM).
  await wait(250);
  return { id: input.itemId, text: "", done: input.done };
}
