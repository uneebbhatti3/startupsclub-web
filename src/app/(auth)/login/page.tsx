import { getAuthRoute } from "@/config/site";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { hero } from "@/features/marketing/lib/content/home";
import { createPageMetadata } from "@/lib/seo";

/**
 * Log-in page (/login): GitHub or email and password through better-auth (D36). No marketing
 * page links here yet (D26). Indexable per D4. The brand panel reuses the home hero message,
 * passed in from here so the auth feature does not import the marketing feature's content.
 *
 * @packageDocumentation
 */

export const metadata = createPageMetadata(getAuthRoute("/login"));

export default function LoginPage() {
  return (
    <AuthShell
      title="Log in to StartupsClub"
      description="Use GitHub or your email and password."
      alternate={{ prompt: "Don't have an account?", label: "Sign up", href: "/signup" }}
      panelTitleLines={hero.titleLines}
      panelDescription={hero.description}
    >
      <LoginForm />
    </AuthShell>
  );
}
