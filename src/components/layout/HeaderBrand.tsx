import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";

// THE BAR'S NAME IS THE MARK, in the mark's own face.
//
// Was "VELVET VIKING" in Cinzel under .text-metallic — the 3D gold gradient.
// Two things retired it at once. The product is called Sacoro now, and
// customer-facing surfaces say Sacoro (founder: "If it's customer facing
// SACORO"); Velvet Viking Ltd remains the company and speaks in the footer,
// where a company belongs. And the metallic treatment itself is gone on the
// app side — the gold is now two dots, not a gradient across six letters.
//
// THE 360px OVERFLOW THIS USED TO CARRY IS GONE WITH IT, and not by tuning a
// breakpoint. The old wordmark was 274px at 30px, against 312px of usable
// width on a 360px phone once the 40px menu control was counted — a 2px
// overflow that needed a size step at min-[380px] to escape. SACORO is six
// characters to VELVET VIKING's twelve plus a space, and the mark's own
// clamp() caps it at 1.62rem, so there is nothing to step down from. The
// dots are flex-none, so if anything ever does run out of room the tracking
// closes before the dots do.
export default function HeaderBrand() {
  return (
    <Link href="/" aria-label="Sacoro — home" className="inline-flex items-center">
      <Wordmark />
    </Link>
  );
}
