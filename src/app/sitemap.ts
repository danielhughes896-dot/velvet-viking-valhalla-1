import type { MetadataRoute } from "next";

const siteUrl = "https://velvet-viking-website-preview.vercel.app";

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
