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

      {/* REAL-IMAGERY PREVIEW: RaceBreak replaces FullWidthPhoto in this
          slot — same "editorial break after product proof" beat, but sized
          to the race photo's real portrait composition instead of force-
          cropping it into a landscape full-bleed frame. Not sticky, so
          EarnYourPlace below no longer needs the -mt-[100vh] pull-up that
          only made sense against FullWidthPhoto's pinned layer. */}
      <RaceBreak src={raceBreak.media.src} alt={raceBreak.media.alt} caption={raceBreak.caption} />

      <Provenance
        eyebrow={provenance.eyebrow}
        heading={provenance.heading}
        body={provenance.body}
        src={provenance.media.src}
        alt={provenance.media.alt}
      />

      {/* FINAL POLISH: moved ahead of Earn Your Place — Work Travels reads
          as an editorial interlude, not the page's last emotional beat
          before the commercial close. Earn Your Place, pricing, and the
          final CTA now close the page instead, so Velvet Viking/Valhalla
          reclaims it after this section rather than ending on it. */}
      <WorkTravels
        desktopSrc={workTravels.desktop.src}
        mobileHeadlineSrc={workTravels.mobile.headline}
        heroLocation={workTravels.heroLocation}
        temple={workTravels.temple}
        map={workTravels.map}
        alt={workTravels.alt}
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
