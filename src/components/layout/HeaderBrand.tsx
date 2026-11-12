import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";
import { brand } from "@/content/site";

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
//
// AND THE COMPANY SIGNS IT, which is a website decision rather than a product
// one. The app deliberately took this byline OUT of its top bar — founder:
// "Do you think we need by velvet viking on every page of the plan? Or just
// the splash screen?" — because inside the product an athlete is already
// somewhere, and the signature belongs on the splash and the share image.
// This masthead is the opposite case: it is the company's own front door, the
// company owns the domain it sits on, and Sacoro is the first of what it
// makes rather than the whole of it. So the one place the byline reads as
// information rather than repetition is here.
//
// SET SO IT CANNOT COMPETE. Centred under the full lockup, dots included,
// because the lockup is symmetrical and aligning to the S instead would hang
// the line off a dot. 9px and widely tracked, so it is legible on inspection
// and invisible to somebody reading the mark.
//
// AND IT IS GOLD, WHICH IS THE APP'S OWN ANSWER. It was --vv-ink-faint: a
// grey that on a near-black bar read as something switched off rather than
// something quiet. The app sets this exact line in .vvv-by as
// `color:var(--gold-text)` at 10.5px/.3em, and 9px for its compact variant,
// which is the size this masthead uses. Gold is the founder's rule for brand
// — "Gold = brand/destination/milestone" — and a company signature under the
// product's name is brand by definition. It also means the byline is no
// longer grey text, which is the whole point of this pass.
export default function HeaderBrand() {
  return (
    <Link
      href="/"
      aria-label={`Sacoro by ${brand.name} — home`}
      className="inline-flex flex-col items-center"
    >
      {/* THE PINNED LINE BOX IS WHAT KEEPS THE BAR ONE HEIGHT. The mark's
          font-size is a clamp(), so its natural line box — and therefore this
          masthead — slid from 90px at 360 to 95px at 430, which made
          --vv-header-h a number that was only right at one width. 36px is the
          app's own figure for the same reason on the same mark. */}
      <Wordmark lineHeight="36px" />
      {/* aria-hidden: the accessible name above already says "Sacoro by Velvet
          Viking", so exposing this too would have a screen reader read the
          company twice for one link. */}
      <span
        aria-hidden
        className="mt-0.5 font-head text-[9px] font-semibold tracking-[0.3em] text-vv-gold-text uppercase"
      >
        By {brand.name}
      </span>
    </Link>
  );
}
