import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

// The origin comes from @/content/site rather than a literal here. It was a
// literal, it read velvet-viking-website-preview.vercel.app, and so every URL
// this sitemap handed to a search engine pointed at a preview deployment.
const routes = [
  "",
  "/valhalla",
  "/pricing",
  "/start",
  "/philosophy",
  "/about",
  "/privacy",
  "/terms",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
