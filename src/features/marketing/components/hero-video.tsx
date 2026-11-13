"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Home hero product video (`public/product-video.mp4`, 1280×720, silent loop).
 * Plays muted and looped like a moving screenshot, with a pause/play button (WCAG 2.2.2: moving
 * content longer than five seconds must be pausable). Visitors who ask for reduced motion get the
 * first frame and must press play. It also pauses while scrolled off screen, to save battery,
 * unless the visitor paused it themselves.
 *
 * @packageDocumentation
 */

type HeroVideoProps = {
  className?: string;
};

export function HeroVideo({ className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // A pause chosen by the visitor wins over automatic play when the video scrolls back in.
  const userPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) userPaused.current = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) {
          // Autoplay can be refused (for example in low-power mode); the button still works.
          void video.play().catch(() => undefined);
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play().catch(() => undefined);
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  return (
    <div
      className={cn(
        "mk-card-shadow relative overflow-hidden rounded-2xl border border-border bg-background sm:rounded-3xl",
        className,
      )}
    >
      <video
        ref={videoRef}
        // The #t fragment makes iOS Safari paint the first frame instead of a blank box.
        src="/product-video.mp4#t=0.1"
        muted
        loop
        playsInline
        preload="metadata"
        width={1280}
        height={720}
        aria-label="StartupsClub product demo"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="block aspect-video h-auto w-full"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-3 bottom-3 inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:right-4 sm:bottom-4"
      >
        {playing ? (
          <Pause aria-hidden="true" className="size-4" />
        ) : (
          <Play aria-hidden="true" className="size-4 translate-x-px" />
        )}
      </button>
    </div>
  );
}
