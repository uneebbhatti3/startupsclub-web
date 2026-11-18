import { getAuthRoute } from "@/config/site";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { SignupForm } from "@/features/auth/components/signup-form";
import { hero } from "@/features/marketing/lib/content/home";
import { createPageMetadata } from "@/lib/seo";

/**
 * Sign-up page (/signup): GitHub or name, email and password through better-auth (D36). No
 * marketing page links here yet (D26). Indexable per D4. The brand panel reuses the home hero
 * message, passed in from here so the auth feature does not import the marketing feature's content.
 *
 * @packageDocumentation
 */

export const metadata = createPageMetadata(getAuthRoute("/signup"));

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your StartupsClub account"
      description="Use GitHub or your email and a password."
      alternate={{ prompt: "Already have an account?", label: "Log in", href: "/login" }}
      panelTitleLines={hero.titleLines}
      panelDescription={hero.description}
    >
      <SignupForm />
    </AuthShell>
  );
}
