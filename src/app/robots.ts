import type { MetadataRoute } from "next";

// Pre-launch: allow crawling of this preview freely for now since it is not
// on a production domain. Revisit before connecting velvetviking.com.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
  };
}
