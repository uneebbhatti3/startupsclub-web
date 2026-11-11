import type { MetadataRoute } from "next";
import { marketingRoutes } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Generates /sitemap.xml from `marketingRoutes` only, so it lists exactly the public pages that
 * exist. Each entry uses the route's real last-modified date; a build-time `new Date()` would
 * be inaccurate and lead Google to ignore lastmod. Priority and changeFrequency are omitted
 * because Google ignores them.
 *
 * @packageDocumentation
 */

export default function sitemap(): MetadataRoute.Sitemap {
  return marketingRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: route.lastModified,
  }));
}
