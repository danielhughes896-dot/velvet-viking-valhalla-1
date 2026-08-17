import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

// The note that used to sit here said this was a preview not on a production
// domain, and said "velvetviking.com". Both are now wrong: the site is live on
// velvetviking.co.uk. Crawling stays open, and the sitemap and host are declared
// against the production origin so a crawler is pointed at the real domain
// rather than left to infer it from whichever hostname served the request.
//
// Individual pages still set their own robots directives — the unpublished legal
// pages carry noindex in their own metadata, which is the right place for a
// per-page decision rather than a blanket disallow here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
