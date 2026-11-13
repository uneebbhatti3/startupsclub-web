"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper built on GSAP ScrollTrigger.
 * The content is in the server-rendered HTML and visible without JavaScript; the animation only
 * runs when scripts load and the visitor has not asked for reduced motion.
 *
 * @packageDocumentation
 */

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Animate each direct child in sequence instead of the wrapper as one block. */
  stagger?: boolean;
  /** Delay in seconds before the animation starts. */
  delay?: number;
  /** Vertical travel in pixels. */
  distance?: number;
};

export function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  distance = 28,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = stagger ? Array.from(element.children) : [element];

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: distance },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          stagger: stagger ? 0.09 : 0,
          clearProps: "transform",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        },
      );
    });

    return () => media.revert();
  }, [delay, distance, stagger]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
