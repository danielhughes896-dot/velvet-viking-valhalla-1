import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { publicLegalLinks } from "@/content/legal";

// The origin comes from @/content/site rather than a literal here. It was a
// literal, it read velvet-viking-website-preview.vercel.app, and so every URL
// this sitemap handed to a search engine pointed at a preview deployment.
//
// /trial is not here because /trial no longer exists. It redirects permanently
// to /start (next.config.ts); a removed page must not still be advertised for
// indexing, and the redirect is what carries the indexed URL across.
const routes = [
  "",
  "/valhalla",
  "/gallery",
  "/pricing",
  "/start",
  "/philosophy",
  "/about",
  "/support",
];

// LEGAL ROUTES ARE DERIVED, NOT LISTED. This used to be a hand-maintained line
// in the array above with a comment telling whoever flipped a LEGAL_APPROVALS
// gate to remember to come back here — which is precisely the instruction that
// gets missed, and the failure is silent in both directions: a published
// contract left out of the sitemap, or an unpublished one advertised to a
// crawler. publicLegalLinks is already derived from those same gates and is
// what the footer renders, so a document is now offered for indexing exactly
// when it is offered to a reader.
//
// /beta-terms is not a candidate, here or in the footer: it governs five
// invited testers rather than the public, and it keeps its own noindex.
const legalRoutes = publicLegalLinks.map((link) => link.href);

export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes, ...legalRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
