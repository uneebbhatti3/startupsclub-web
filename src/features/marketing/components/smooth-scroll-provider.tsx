"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type ReactNode } from "react";

import "locomotive-scroll/locomotive-scroll.css";

/**
 * Smooth scrolling for the marketing site with Locomotive Scroll v5 (built on Lenis).
 * Locomotive v5 scrolls the real window, so GSAP ScrollTrigger reads native scroll positions and
 * needs no proxy; we only refresh its measurements once the scroller is ready.
 * One instance per page, destroyed on unmount, and skipped for reduced-motion visitors.
 *
 * @packageDocumentation
 */

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    let destroy: (() => void) | undefined;
    let cancelled = false;

    void import("locomotive-scroll").then(({ default: LocomotiveScroll }) => {
      if (cancelled) return;
      const scroll = new LocomotiveScroll({
        lenisOptions: { lerp: 0.1, duration: 1.1, smoothWheel: true },
      });
      destroy = () => scroll.destroy();
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  return <>{children}</>;
}
