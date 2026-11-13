import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared heading block for marketing sections: a small eyebrow label, an h2 and optional text.
 *
 * @packageDocumentation
 */

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="text-xs font-semibold tracking-[0.14em] text-primary-text uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-heading text-3xl leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
