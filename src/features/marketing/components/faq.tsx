import { Plus } from "lucide-react";

import { Reveal } from "@/features/marketing/components/animations/reveal";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { faqs } from "@/features/marketing/lib/content/home";

/**
 * FAQ section built on native `<details>` elements: keyboard accessible, works without JavaScript,
 * and keeps every answer in the HTML for search engines. Swap for the shadcn Accordion if preferred.
 *
 * @packageDocumentation
 */

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Questions, answered."
            description="The short version of how StartupsClub works."
          />
        </Reveal>

        <Reveal stagger className="space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              open={index === 0}
              className="group rounded-2xl border border-border bg-background transition-colors open:bg-muted/50"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-5 font-medium [&::-webkit-details-marker]:hidden">
                <h3 className="text-base">{faq.question}</h3>
                <span className="inline-flex size-7 flex-none items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-45">
                  <Plus aria-hidden="true" className="size-4" />
                </span>
              </summary>
              <p className="px-6 pb-6 text-[15px] leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
