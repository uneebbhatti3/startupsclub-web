import { Check } from "lucide-react";

import { Reveal } from "@/features/marketing/components/animations/reveal";
import { principles } from "@/features/marketing/lib/content/home";
import { cn } from "@/lib/utils";

/**
 * Statement section: the product's core belief in large type, surrounded by floating feature tags.
 *
 * @packageDocumentation
 */

const tagPositions = [
  "lg:top-14 lg:left-[7%]",
  "lg:top-10 lg:right-[9%]",
  "lg:bottom-16 lg:left-[3%]",
  "lg:bottom-9 lg:left-[41%]",
  "lg:right-[4%] lg:bottom-16",
];

export function Principles() {
  return (
    <section className="relative overflow-hidden border-y">
      <div aria-hidden="true" className="mk-dots absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
        <Reveal>
          <p className="mx-auto max-w-4xl text-center font-heading text-3xl leading-[1.12] font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
            {principles.lead} <span className="text-muted-foreground">{principles.rest}</span>
          </p>
        </Reveal>

        <Reveal stagger className="mt-10 flex flex-wrap justify-center gap-2.5 lg:mt-0">
          {principles.tags.map((tag, index) => (
            <span
              key={tag}
              className={cn(
                "mk-card-shadow inline-flex items-center gap-2 rounded-full border border-border bg-background py-2 pr-4 pl-2 text-sm font-medium lg:absolute",
                tagPositions[index],
              )}
            >
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check aria-hidden="true" className="size-3" strokeWidth={3.5} />
              </span>
              {tag}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
