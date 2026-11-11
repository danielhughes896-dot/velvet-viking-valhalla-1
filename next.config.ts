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
  // /valhalla MOVED TO /sacoro, same reasoning, different cause. The product
  // was renamed; the page was not deleted. /valhalla was in the sitemap, was
  // indexable, and was linked from the header, the menu, the hero and the
  // closing CTA for as long as the product carried that name — so it is in
  // search indexes and in people's bookmarks, and a rename that drops it
  // turns all of that into a 404 for a page that still exists.
  //
  // Permanent (308) so an index transfers rather than keeps checking, and it
  // stays indefinitely: there is no future point at which breaking the old
  // URL becomes useful. The route file is MOVED, not duplicated — src/app/
  // sacoro/page.tsx is the only copy, and this is its forwarding address.
  async redirects() {
    return [
      { source: "/trial", destination: "/start", permanent: true },
      { source: "/valhalla", destination: "/sacoro", permanent: true },
    ];
  },
};

export default nextConfig;
