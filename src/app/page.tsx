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
          COMPOUNDS COVER TRANSITION: RaceBreak's photo pins sticky at sm+
          (see that component); WorkTravels below is pulled up over it — see
          the className passed there for how the two halves of this one
          transition connect. */}
      <RaceBreak src={raceBreak.media.src} alt={raceBreak.media.alt} caption={raceBreak.caption} />

      {/* FINAL POLISH: moved ahead of Earn Your Place — Work Travels reads
          as an editorial interlude, not the page's last emotional beat
          before the commercial close. Earn Your Place, pricing, and the
          final CTA now close the page instead, so Velvet Viking/Valhalla
          reclaims it after this section rather than ending on it.
          CONSISTENCY COMPOUNDS COVER TRANSITION: pulled up over RaceBreak's
          pinned photo at sm+ only (mobile/reduced-motion get zero margin
          adjustment — plain, unmoved stacking, exactly as if this className
          were never passed) — restores the historical FullWidthPhoto
          behaviour (image visually pinned while the next section rises and
          covers it), adapted to RaceBreak's portrait box and today's
          section order rather than the old full-bleed landscape version.
          WorkTravels' own composition, copy and imagery are completely
          unchanged; only its outer wrapper is affected. */}
      <WorkTravels
        desktopSrc={workTravels.desktop.src}
        mobileHeadlineSrc={workTravels.mobile.headline}
        heroLocation={workTravels.heroLocation}
        temple={workTravels.temple}
        map={workTravels.map}
        alt={workTravels.alt}
        className="motion-safe:sm:relative motion-safe:sm:z-10 motion-safe:sm:-mt-[120vh]"
      />

      {/* RESTORED: the three-slot gallery composition is approved as part
          of the visual architecture — see earnYourPlace.gallery in
          site.ts. Deliberately empty until real photography exists for
          it, not filled with founder/race imagery merely to occupy the
          space. */}
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

      <FutureWorld />
      <FinalCta />
    </>
  );
}
