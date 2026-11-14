import type { WaitlistField, WaitlistRole } from "@/features/waitlist/types/waitlist-types";

/**
 * Copy for the waitlist page (/waitlist). Page and field copy approved by the owner on 12 Nov 2026;
 * the role field was added on 14 Nov 2026. The success, error and field-error messages were
 * drafted by Claude on 14 Nov 2026 when the form was connected to the API.
 *
 * @packageDocumentation
 */

/** Length limits enforced by the API, mirrored on the inputs so users hit them early. */
export const waitlistLimits = {
  name: 100,
  email: 254,
  roleOther: 50,
} as const;

export const waitlistPage = {
  eyebrow: "Waitlist",
  title: "Join the StartupsClub waitlist",
  description: "Join the waitlist and we will email you when you can create your account.",
  fields: {
    name: "Name",
    email: "Email",
    role: "Role",
    rolePlaceholder: "Select your role",
    otherRole: "Your role",
    otherRolePlaceholder: "e.g. Designer",
  },
  /** Role options. `other` reveals the free-text role field. */
  roles: [
    { value: "founder", label: "Founder" },
    { value: "developer", label: "Developer" },
    { value: "other", label: "Other" },
  ] satisfies { value: WaitlistRole; label: string }[],
  submit: "Join waitlist",
  submitting: "Joining…",
  success: {
    title: "You're on the list",
    /** The email the user entered is inserted between these two parts. */
    descriptionBefore: "We will email you at ",
    descriptionAfter: " when you can create your account.",
  },
  errorTitle: "We could not add you to the waitlist",
} as const;

/** Plain messages for error codes the API returns, replacing its technical wording. */
export const waitlistErrorMessages: Record<string, string> = {
  WAITLIST_EMAIL_EXISTS: "This email is already on the waitlist.",
  TOO_MANY_REQUESTS: "Too many attempts. Please wait a minute and try again.",
  VALIDATION_FAILED: "Please check the highlighted fields.",
};

/** Shown under a field when the API rejects it (the API's own messages are technical). */
export const waitlistFieldErrors: Record<WaitlistField, string> = {
  name: `Enter your name (up to ${waitlistLimits.name} characters).`,
  email: "Enter a valid email address.",
  role: "Choose a role.",
  roleOther: `Enter your role (up to ${waitlistLimits.roleOther} characters).`,
};
