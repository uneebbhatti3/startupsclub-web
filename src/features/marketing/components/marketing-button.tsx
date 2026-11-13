import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Expressive link-buttons for the marketing site only (never used inside the app area).
 * Variants follow docs/DESIGN_SYSTEM.md section 7.3; their effects live in marketing.css.
 *
 * @packageDocumentation
 */

const marketingButton = cva(
  "mk-btn inline-flex min-h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold whitespace-nowrap select-none",
  {
    variants: {
      variant: {
        glow: "mk-glow bg-primary text-primary-foreground",
        shine: "mk-glow mk-shine bg-primary text-primary-foreground",
        "gradient-border": "mk-gradient-border text-foreground",
        "arrow-slide": "mk-arrow border border-border bg-background text-foreground hover:bg-muted",
        "ghost-underline": "mk-underline min-h-0 rounded-none px-0 pb-0.5 text-foreground",
      },
      size: {
        md: "px-5 py-2.5",
        lg: "px-7 py-3.5 text-base",
      },
    },
    compoundVariants: [{ variant: "ghost-underline", className: "px-0 py-0" }],
    defaultVariants: { variant: "glow", size: "md" },
  },
);

type MarketingButtonProps = VariantProps<typeof marketingButton> & {
  href: string;
  children: ReactNode;
  className?: string;
  /** Shows a trailing arrow. On by default for the `arrow-slide` variant. */
  withArrow?: boolean;
  /** For example, closing the mobile menu when the link is followed. */
  onClick?: () => void;
};

export function MarketingButton({
  href,
  children,
  className,
  variant,
  size,
  withArrow,
  onClick,
}: MarketingButtonProps) {
  const showArrow = withArrow ?? variant === "arrow-slide";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(marketingButton({ variant, size }), showArrow && "mk-arrow", className)}
    >
      {children}
      {showArrow ? <ArrowRight aria-hidden="true" className="mk-arrow-icon size-4" /> : null}
    </Link>
  );
}
