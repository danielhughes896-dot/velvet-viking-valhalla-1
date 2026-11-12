import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // REDIRECT RATHER THAN DELETE, and the reason is that /trial was public.
  // It was in the sitemap, indexable, and reachable from the pricing CTA for
  // as long as that CTA pointed at it — so search engines have it and anybody
  // who got as far as choosing a billing period may have bookmarked it. A bare
  // deletion turns every one of those into a 404 at the exact moment somebody
  // was trying to buy something.
  //
  // Permanent (308), because the move is permanent: the page is gone, its job
  // moved into /start, and a permanent redirect is what tells an index to
  // transfer rather than keep checking. The route file itself IS deleted —
  // this is not a hidden page, it is a forwarding address.
  async redirects() {
    return [
      { source: "/trial", destination: "/start", permanent: true },
      /* /valhalla WAS THE DEEP-DIVE PAGE, and it was public for months: in the
         sitemap, linked from the menu, the homepage and both CTAs. The product
         is called Sacoro now, so the page moved to /sacoro — but every indexed
         URL, every bookmark and every link anyone has shared still points here.
         Deleting it would 404 them, and this page is where somebody goes to
         find out what they are buying. 308, because the move is permanent. */
      { source: "/valhalla", destination: "/sacoro", permanent: true },
    ];
  },
};

export default nextConfig;
