import { buildSiteJsonLd, serializeJsonLd } from "@/lib/seo";

/**
 * Layout for the public marketing pages. For now it only adds the site-wide Organization and
 * WebSite structured data; the header, footer and smooth scrolling are added with the
 * marketing site.
 *
 * @packageDocumentation
 */

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        // Approved exception (docs/DECISIONS.md D9): serializeJsonLd escapes "<", so the
        // typed, server-built JSON cannot break out of the script element.
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildSiteJsonLd()) }}
      />
    </>
  );
}
