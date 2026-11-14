/**
 * Copy for the waitlist page (/waitlist), approved by the owner on 12 Nov 2026; the role field
 * (Founder, Developer, Other, with a free-text role for Other) was added on 14 Nov 2026. Where
 * entries are stored is not decided yet (docs/DECISIONS.md D27), so nothing is sent anywhere.
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
  ],
  submit: "Join waitlist",
} as const;
