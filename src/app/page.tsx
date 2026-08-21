import Hero from "@/components/sections/Hero";
import DocumentaryReel from "@/components/sections/DocumentaryReel";
import EditorialSplit from "@/components/sections/EditorialSplit";
import ProductShowcase from "@/components/sections/ProductShowcase";
import RaceBreak from "@/components/sections/RaceBreak";
import Provenance from "@/components/sections/Provenance";
import WorkTravels from "@/components/sections/WorkTravels";
import FutureWorld from "@/components/sections/FutureWorld";
import FinalCta from "@/components/sections/FinalCta";
import { brandStory, earnYourPlace, raceBreak, provenance, workTravels } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero />

      {/* RESTORED: an intentional, permanent seam for a future real Velvet
          Viking reel, not an accidental unfinished box — see
          DocumentaryReel.tsx and documentaryReel in site.ts. */}
      <DocumentaryReel />

      {/* FINAL POLISH: no genuine photograph exists yet for this statement,
          so it ships text-only rather than with an empty/placeholder media
          frame — see EditorialSplit's no-media branch. (Unlike the reel
          above and the Earn Your Place gallery below, this specific media
          slot was not flagged for restoration.) */}
      <EditorialSplit
        theme="light"
        eyebrow={brandStory.eyebrow}
        heading={brandStory.heading}
        body={brandStory.body}
      />

      <ProductShowcase />

      {/* HOMEPAGE STORY ORDER: moved ahead of Consistency Compounds — once
          the visitor understands what Valhalla is, the next natural
          question is why it exists and who built it, before the page
          moves on to proving consistency and real-world use. */}
      <Provenance
        eyebrow={provenance.eyebrow}
        heading={provenance.heading}
        body={provenance.body}
        src={provenance.media.src}
        alt={provenance.media.alt}
      />

      {/* REAL-IMAGERY PREVIEW: RaceBreak replaces FullWidthPhoto in this
          slot — same "editorial break after product proof" beat, but sized
          to the race photo's real portrait composition instead of force-
          cropping it into a landscape full-bleed frame. CONSISTENCY
          COMPOUNDS COVER TRANSITION: RaceBreak's photo pins sticky at every
          width now (see that component); WorkTravels below is pulled up
          over it once a genuine hold has passed — see the className passed
          there for how the two halves of this one transition connect and
          where the two pull-up numbers come from. */}
      <RaceBreak src={raceBreak.media.src} alt={raceBreak.media.alt} caption={raceBreak.caption} />

      {/* CONSISTENCY COMPOUNDS — POST-STICKY PAINT LAYER. RaceBreak's
          pinned photo is `position: sticky`, i.e. a POSITIONED element,
          and positioned elements paint above STATIC ones. WorkTravels'
          pull-up deliberately drags the rest of the page up into
          RaceBreak's own box, so without this layer the expired photo
          paints over whichever following section happens to overlap it —
          which is how it kept reappearing behind Earn Your Place. Wrapping
          the whole remainder of the page in one `relative z-10` layer
          makes every later section paint above the expired sticky section
          unconditionally, rather than that depending on section heights
          lining up (the previous per-section z-index left One Philosophy
          and the final CTA still static, and therefore still exposed).
          Layout is untouched: this div has no padding or border, so
          WorkTravels' negative margin still collapses through it exactly
          as before, and nothing inside gains a background, a size change
          or a position of its own. Reduced-motion opens no layer at all —
          there is no pull-up and no sticky there to correct for. */}
      <div className="motion-safe:relative motion-safe:z-10">
      {/* FINAL POLISH: moved ahead of Earn Your Place — Work Travels reads
          as an editorial interlude, not the page's last emotional beat
          before the commercial close. Earn Your Place, pricing, and the
          final CTA now close the page instead, so Velvet Viking/Valhalla
          reclaims it after this section rather than ending on it.
          CONSISTENCY COMPOUNDS COVER TRANSITION, RE-DERIVED PER
          BREAKPOINT: pulled up over RaceBreak's pinned photo at every
          width under motion-safe (reduced-motion gets zero margin
          adjustment — plain, unmoved stacking, exactly as if this
          className were never passed).

          Each pull-up is exactly "RaceBreak's own pinned height at this
          breakpoint, plus a 40px safety margin" — see the full derivation
          in RaceBreak.tsx. It deliberately does NOT encode the hold; the
          hold lives in that component's spacer instead, which is what
          lets the hold be a short, chosen beat rather than the leftover
          distance after guaranteeing coverage. Two values are needed
          because the photo box is sized differently either side of sm:
            - below sm: width-authority, aspect-3/4, so its height is
              133.333% of its own rendered width (100vw minus the section's
              48px of horizontal padding) plus the 80px of pt-20 above it
              — hence 16px + 133.333vw, plus 40px safety = 56px + 133.333vw.
            - sm and up: height-authority, a flat 78vh, plus the 112px of
              pt-28 above it — hence 112px + 78vh, plus 40px = 152px + 78vh.
          Both were checked against this component's actual rendered
          numbers via direct scroll-position tracing, not taken from the
          algebra alone — see the report for the measurements.

          Restores the historical FullWidthPhoto behaviour (image visually
          held in place, untouched, before the next section slides up from
          the bottom of the screen and covers it). WorkTravels' own
          composition, copy and imagery are completely unchanged; only its
          outer wrapper is affected. This section no longer needs a
          z-index of its own — it inherits the shared paint layer opened
          above — and it no longer has to be taller than the pinned photo
          for the photo to stay hidden afterwards. */}
      <WorkTravels
        desktopSrc={workTravels.desktop.src}
        mobileHeadlineSrc={workTravels.mobile.headline}
        heroLocation={workTravels.heroLocation}
        temple={workTravels.temple}
        map={workTravels.map}
        alt={workTravels.alt}
        className="motion-safe:-mt-[calc(56px_+_133.333vw)] motion-safe:sm:-mt-[calc(152px_+_78vh)]"
      />

      {/* RESTORED: the three-slot gallery composition is approved as part
          of the visual architecture — see earnYourPlace.gallery in
          site.ts. Now carries real photography.

          This section carries no z-index of its own: it sits inside the
          shared post-RaceBreak paint layer opened above, which covers it
          and everything after it, so it stays visually continuous with
          One Philosophy below rather than being singled out. */}
      <EditorialSplit
        theme="light"
        eyebrow={earnYourPlace.eyebrow}
        heading={earnYourPlace.heading}
        body={earnYourPlace.body}
        mediaLabel={earnYourPlace.media.placeholder}
        mediaAlt={earnYourPlace.media.alt}
        galleryItems={earnYourPlace.gallery}
        reverse
      />

      {/* YEAR-ROUND MOVED TO /valhalla. The lifecycle timeline used to sit
          here, between Earn Your Place and One Philosophy. It is a product
          argument, not a brand one, and it now opens the Valhalla page
          directly under that page's promise, where the sections either side
          of it are about the same thing. Deliberately NOT left mounted here
          as well: one timeline, one place. */}
      <FutureWorld />
      <FinalCta />
      </div>
    </>
  );
}
