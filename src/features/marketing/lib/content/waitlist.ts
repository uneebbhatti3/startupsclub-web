/**
 * Copy for the waitlist page (/waitlist), approved by the owner on 12 Nov 2026. Where entries
 * are stored is not decided yet (docs/DECISIONS.md D27), so the form is shown but disabled, with
 * no status message (owner's choice).
 *
 * @packageDocumentation
 */

export const waitlistPage = {
  eyebrow: "Waitlist",
  title: "Join the StartupsClub waitlist",
  description: "Join the waitlist and we will email you when you can create your account.",
  fields: {
    name: "Name",
    email: "Email",
  },
  submit: "Join waitlist",
} as const;
