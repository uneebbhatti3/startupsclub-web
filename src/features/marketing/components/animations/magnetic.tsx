"use client";

import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Makes its child gently follow the cursor within a small radius (the "magnetic" button effect).
 * Disabled for touch devices and for visitors who prefer reduced motion.
 *
 * @packageDocumentation
 */

type MagneticProps = {
  children: ReactNode;
  /** How strongly the element follows the pointer, from 0 to 1. */
  strength?: number;
};

export function Magnetic({ children, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
      const moveX = gsap.quickTo(element, "x", { duration: 0.5, ease: "power3.out" });
      const moveY = gsap.quickTo(element, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        moveX((event.clientX - (rect.left + rect.width / 2)) * strength);
        moveY((event.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const onLeave = () => {
        moveX(0);
        moveY(0);
      };

      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);

      return () => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => media.revert();
  }, [strength]);

  return (
    <span ref={ref} className="inline-block p-3">
      {children}
    </span>
  );
}
