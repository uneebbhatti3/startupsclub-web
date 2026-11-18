import type { MetadataRoute } from "next";
import { listedPublicRoutes } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Generates /sitemap.xml from `listedPublicRoutes` only (listed marketing pages plus the
 * indexable auth pages), so it lists exactly the public pages that exist. Each entry uses the route's real last-modified date; a build-time `new Date()` would
 * be inaccurate and lead Google to ignore lastmod. Priority and changeFrequency are omitted
 * because Google ignores them.
 *
 * @packageDocumentation
 */

export default function sitemap(): MetadataRoute.Sitemap {
  return listedPublicRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: route.lastModified,
  }));
}
