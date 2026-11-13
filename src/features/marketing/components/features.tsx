import type { ReactNode } from "react";

import { Reveal } from "@/features/marketing/components/animations/reveal";
import { MarketingButton } from "@/features/marketing/components/marketing-button";
import {
  ClubBoardMock,
  CoachMock,
  ComposerMock,
  ShipLogMock,
  StandupMock,
} from "@/features/marketing/components/product-mockups";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { cn } from "@/lib/utils";

/**
 * Features section: a bento grid where each card pairs a short explanation with a product mockup.
 *
 * @packageDocumentation
 */

type FeatureCardProps = {
  title: string;
  description: string;
  badge?: "Pro";
  className?: string;
  children: ReactNode;
};

function FeatureCard({ title, description, badge, className, children }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border border-border bg-muted/50",
        className,
      )}
    >
      <div className="p-7 pb-0 sm:p-8 sm:pb-0">
        <div className="flex items-center gap-2.5">
          <h3 className="font-heading text-xl font-semibold tracking-tight">{title}</h3>
          {badge ? (
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-primary-text">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-auto p-5 pt-7 sm:p-6 sm:pt-8">{children}</div>
    </article>
  );
}

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to stay consistent."
          description="Built around one habit, the daily standup, with the tools that make it stick."
        />
      </Reveal>

      <Reveal stagger className="mt-14 grid gap-5 lg:grid-cols-6">
        <FeatureCard
          className="lg:col-span-3"
          title="Daily standup"
          description="One check-in a day. List your to-dos, tick them off, and carry unfinished items into tomorrow."
        >
          <StandupMock className="mk-card-shadow" />
        </FeatureCard>

        <FeatureCard
          className="lg:col-span-3"
          title="Clubs"
          description="A small group of up to 20 builders who can see who showed up today, and who did not."
        >
          <ClubBoardMock className="mk-card-shadow" />
        </FeatureCard>

        <FeatureCard
          className="lg:col-span-2"
          title="Ship logs"
          description="Connect GitHub and get suggested ship logs from your commits. You confirm before anything is saved."
        >
          <ShipLogMock className="mk-card-shadow" />
        </FeatureCard>

        <FeatureCard
          className="lg:col-span-2"
          badge="Pro"
          title="AI Standup Coach"
          description="Short, private feedback on vague goals, repeated carry-overs and blockers that keep coming back."
        >
          <CoachMock className="mk-card-shadow" />
        </FeatureCard>

        <FeatureCard
          className="lg:col-span-2"
          title="Post composer"
          description="Write once and publish to StartupsClub and LinkedIn. Scheduling each one separately is a Pro feature."
        >
          <ComposerMock className="mk-card-shadow" />
        </FeatureCard>
      </Reveal>

      <div className="mt-12 flex justify-center">
        <MarketingButton href="/features" variant="arrow-slide">
          See all features
        </MarketingButton>
      </div>
    </section>
  );
}
