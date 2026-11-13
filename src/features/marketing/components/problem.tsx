import { EyeOff, MessagesSquare, UserX, type LucideIcon } from "lucide-react";

import { Reveal } from "@/features/marketing/components/animations/reveal";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { problems, type Problem as ProblemItem } from "@/features/marketing/lib/content/home";

/**
 * "Why group chats fail" section: the three problems StartupsClub exists to solve.
 *
 * @packageDocumentation
 */

const icons: Record<ProblemItem["icon"], LucideIcon> = {
  buried: MessagesSquare,
  anonymous: UserX,
  unaccountable: EyeOff,
};

export function Problem() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="The problem"
          title="Group chats are built for talk, not for progress."
          description="Founder and developer communities live in WhatsApp, Discord and Telegram groups. They are great for conversation and bad at helping anyone finish."
        />
      </Reveal>

      <Reveal
        stagger
        className="mt-14 grid gap-px overflow-hidden rounded-3xl border bg-border md:grid-cols-3"
      >
        {problems.map((problem) => {
          const Icon = icons[problem.icon];
          return (
            <article key={problem.title} className="bg-background p-8">
              <span className="inline-flex size-10 items-center justify-center rounded-xl border border-border text-muted-foreground">
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
              </span>
              <h3 className="mt-6 font-heading text-lg font-semibold tracking-tight">
                {problem.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {problem.description}
              </p>
            </article>
          );
        })}
      </Reveal>
    </section>
  );
}
