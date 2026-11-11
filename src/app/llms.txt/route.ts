import { marketingRoutes, siteConfig, type MarketingRoute } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Serves /llms.txt, a plain-language summary of the site for language models, generated from
 * `src/config/site.ts` so its page list always matches the sitemap. With Cache Components on,
 * a GET handler that reads no request data is prerendered at build time, so no
 * `dynamic = "force-static"` export is needed (that option is replaced under Cache Components).
 * Facts come from docs/PRD.md only: no prices or numbers that cannot be backed up.
 *
 * @packageDocumentation
 */

function toListItem(route: MarketingRoute): string {
  return `- [${route.title}](${absoluteUrl(route.path)}): ${route.description}`;
}

function buildLlmsTxt(): string {
  const primary = marketingRoutes.filter((route: MarketingRoute) => !route.optional);
  const optional = marketingRoutes.filter((route: MarketingRoute) => route.optional);

  const sections = [
    `# ${siteConfig.name}`,
    `> ${siteConfig.description}`,
    [
      "## About",
      "",
      `${siteConfig.name} is an accountability and community platform for startup founders and developers who want to make consistent progress.`,
      "",
      "- Members post one daily standup, with items they tick off through the day and any blockers.",
      "- Members keep ship logs: a permanent record of what they shipped.",
      "- Members belong to a small club of up to 20 people that sees their progress.",
      "- Members compete in six-week seasons.",
      "- There is a free plan and a paid Pro plan.",
    ].join("\n"),
    ["## Pages", "", ...primary.map(toListItem)].join("\n"),
  ];

  if (optional.length > 0) {
    sections.push(["## Optional", "", ...optional.map(toListItem)].join("\n"));
  }

  return `${sections.join("\n\n")}\n`;
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
