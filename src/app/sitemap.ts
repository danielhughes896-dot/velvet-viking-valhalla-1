import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

// The origin comes from @/content/site rather than a literal here. It was a
// literal, it read velvet-viking-website-preview.vercel.app, and so every URL
// this sitemap handed to a search engine pointed at a preview deployment.
// FINAL QA FIX PASS: /terms and /cookies stay real, gated routes (see
// LEGAL_APPROVALS in @/content/legal) — they just don't belong in a public
// sitemap while they're still noindex placeholder pages nobody can reach
// from navigation. Same treatment the private beta's own terms page already
// gets below. Add each one back here once its own LEGAL_APPROVALS flag flips
// to true.
// /trial IS GONE, not gated. It existed for one job — asking which billing
// period an athlete wanted — and under the approved value-first journey that
// choice happens after the programme has been built and previewed, inside the
// app. A route whose only purpose was a step that no longer exists should not
// keep a public, indexable URL describing a decision the site no longer asks
// for, so the page and its component were removed rather than orphaned here.
const routes = [
  "",
  "/valhalla",
  "/gallery",
  "/pricing",
  "/start",
  "/philosophy",
  "/about",
  "/support",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
