import {
  BookOpenText,
  CalendarClock,
  CalendarDays,
  ChartColumn,
  Flame,
  GraduationCap,
  Handshake,
  MessageCircle,
  MessagesSquare,
  Radio,
  Send,
  Smartphone,
  Sparkles,
  Stamp,
  Trophy,
  UserRound,
  UserSearch,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Reveal } from "@/features/marketing/components/animations/reveal";
import { PlanBadge } from "@/features/marketing/components/feature-badges";
import {
  ClubBoardMock,
  CoachMock,
  ComposerMock,
  SeasonGridMock,
  ShipLogMock,
  StandupMock,
} from "@/features/marketing/components/product-mockups";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import type { Feature, FeatureGroup } from "@/features/marketing/lib/content/features";

/**
 * One feature group on the Features page: an h2 and a card per feature (h3, full description,
 * plan badge). Features with an existing product mockup get a wide card beside it; the rest get
 * a compact card with a Lucide line icon. No new mockups are drawn for features that have none.
 *
 * @packageDocumentation
 */

/** Existing mockups, paired by feature id. Decorative: every mockup is `aria-hidden`. */
const mockups: Partial<Record<string, ReactNode>> = {
  "daily-standup": <StandupMock className="mk-card-shadow" />,
  "ship-logs": <ShipLogMock className="mk-card-shadow" />,
  clubs: <ClubBoardMock className="mk-card-shadow" />,
  seasons: (
    <div className="mk-card-shadow rounded-2xl border border-border bg-card p-5">
      <SeasonGridMock />
    </div>
  ),
  "post-composer": <ComposerMock className="mk-card-shadow" />,
  "ai-standup-coach": <CoachMock className="mk-card-shadow" />,
};

const icons: Partial<Record<string, LucideIcon>> = {
  "streaks-and-milestones": Flame,
  "weekly-progress-report": ChartColumn,
  "profile-and-project-page": UserRound,
  "whatsapp-check-in": Smartphone,
  "club-leaderboard": Trophy,
  forum: MessagesSquare,
  "member-network": UsersRound,
  events: CalendarDays,
  "collaborator-board": Handshake,
  chat: MessageCircle,
  "short-rooms": Radio,
  "instant-posting": Send,
  "ai-written-posts": Sparkles,
  "post-scheduling": CalendarClock,
  watermark: Stamp,
  "ai-matching": UserSearch,
  "ai-knowledge-assistant": BookOpenText,
  "tutors-and-classrooms": GraduationCap,
};

function FeatureText({ feature }: { feature: Feature }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        <h3 className="font-heading text-xl font-semibold tracking-tight">{feature.name}</h3>
        <PlanBadge plan={feature.plan} />
      </div>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        {feature.description}
      </p>
    </>
  );
}

function MockupCard({ feature, mockup }: { feature: Feature; mockup: ReactNode }) {
  return (
    <article className="grid items-center gap-8 overflow-hidden rounded-3xl border border-border bg-muted/50 p-7 sm:p-8 md:col-span-2 lg:col-span-3 lg:grid-cols-2 lg:gap-12">
      <div>
        <FeatureText feature={feature} />
      </div>
      <div>{mockup}</div>
    </article>
  );
}

function IconCard({ feature }: { feature: Feature }) {
  const Icon = icons[feature.id] ?? Sparkles;

  return (
    <article className="flex flex-col rounded-3xl border border-border bg-muted/50 p-7">
      <span className="mb-6 inline-flex size-10 items-center justify-center rounded-xl bg-accent text-primary-text">
        <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
      </span>
      <FeatureText feature={feature} />
    </article>
  );
}

type FeatureGroupSectionProps = {
  group: FeatureGroup;
  index: number;
};

export function FeatureGroupSection({ group, index }: FeatureGroupSectionProps) {
  return (
    <section
      id={group.id}
      aria-labelledby={`${group.id}-heading`}
      className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-20"
    >
      <Reveal>
        <SectionHeading
          align="left"
          eyebrow={String(index + 1).padStart(2, "0")}
          title={<span id={`${group.id}-heading`}>{group.name}</span>}
        />
      </Reveal>

      <Reveal stagger className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {group.features.map((feature) => {
          const mockup = mockups[feature.id];
          return mockup ? (
            <MockupCard key={feature.id} feature={feature} mockup={mockup} />
          ) : (
            <IconCard key={feature.id} feature={feature} />
          );
        })}
      </Reveal>
    </section>
  );
}
