import { Reveal } from "@/features/marketing/components/animations/reveal";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { steps } from "@/features/marketing/lib/content/home";

/**
 * "How it works" section: the daily loop in three numbered steps.
 *
 * @packageDocumentation
 */

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-y bg-muted/60 dark:bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="A daily loop you can keep up."
            description="No courses, no long forms. Three small actions a day, repeated for a season."
          />
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="relative rounded-3xl border border-border bg-background p-8"
            >
              <span className="absolute top-6 right-7 font-heading text-5xl font-semibold text-primary-text/25 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mt-8 font-heading text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
