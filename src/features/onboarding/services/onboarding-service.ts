import type {
  FocusValue,
  GithubConnection,
  HandleAvailability,
  OnboardingDraft,
  OnboardingStatus,
  StartupLookup,
} from "@/features/onboarding/types/onboarding-types";

/**
 * Onboarding calls. The backend has no onboarding module yet, so every function here is a
 * fixture that waits briefly and returns a believable result (docs/STATE_AND_DATA.md section 3).
 * Each one names the endpoint that should replace it; the ones not in `docs/API_CONTRACT.md` are
 * TO CONFIRM with the backend.
 *
 * @packageDocumentation
 */

const fixtureDelayMs = 500;

function wait(ms: number = fixtureDelayMs): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// FIXTURE: handles already taken, until `GET /profiles/handle-availability?handle=` (TO CONFIRM).
const takenHandles = new Set(["admin", "startupsclub", "support", "founder"]);

/** Whether a handle is free. */
export async function checkHandleAvailability(handle: string): Promise<HandleAvailability> {
  // FIXTURE: replace with the handle availability endpoint (TO CONFIRM).
  await wait(300);
  return { handle, available: !takenHandles.has(handle) };
}

/** Reads a startup's name from its landing page URL. */
export async function lookupStartup(url: string): Promise<StartupLookup> {
  // FIXTURE: replace with a server-side landing page lookup, e.g. `POST /projects/lookup`
  // (TO CONFIRM). The fixture only turns the domain into a name ("launch-pilot.io" → "Launch Pilot").
  await wait();
  const host = new URL(url).hostname.replace(/^www\./, "");
  const label = host.split(".")[0] ?? host;
  const name = label
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return { name, tagline: "" };
}

// FIXTURE: starter tasks per focus, until AI suggestions exist (TO CONFIRM).
const suggestedTasks: Record<FocusValue, readonly string[]> = {
  "launch-mvp": [
    "Write the one-line pitch",
    "Cut scope: list what v1 will not do",
    "Put a real date on the launch",
  ],
  "first-customer": [
    "Write down who your first customer is",
    "List 10 people who have this problem",
    "Send the first 3 outreach messages",
  ],
  "grow-revenue": [
    "Write down this month's revenue goal",
    "Find the step where most people drop off",
    "Ask one paying customer what made them buy",
  ],
  "ship-faster": [
    "Pick one thing to ship this week",
    "Break it into tasks under 2 hours",
    "Ship the smallest piece today",
  ],
};

/** First tasks suggested for a focus. */
export async function getSuggestedTasks(focus: FocusValue): Promise<readonly string[]> {
  // FIXTURE: replace with the AI task suggestion endpoint (TO CONFIRM).
  await wait();
  return suggestedTasks[focus];
}

/** Connects the member's GitHub account for activity and ship log suggestions. */
export async function connectGithub(handle: string): Promise<GithubConnection> {
  // FIXTURE: replace with GitHub account linking through better-auth (TO CONFIRM). The fixture
  // pretends the GitHub login matches the chosen handle.
  await wait();
  return { login: handle || "your-github" };
}

/** Saves everything from onboarding and marks it complete. */
export async function completeOnboarding(draft: OnboardingDraft): Promise<OnboardingStatus> {
  // FIXTURE: replace with `POST /onboarding/complete` (API_CONTRACT section 3; body TO CONFIRM)
  // plus the photo upload. Nothing is sent or stored yet.
  void draft;
  await wait(800);
  return { completed: true };
}
