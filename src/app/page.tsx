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
      <DocumentaryReel />

      <EditorialSplit
        theme="light"
        eyebrow={brandStory.eyebrow}
        heading={brandStory.heading}
        body={brandStory.body}
        mediaLabel={brandStory.media.placeholder}
        mediaAlt={brandStory.media.alt}
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

      <WorkTravels
        desktopSrc={workTravels.desktop.src}
        mobileHeadlineSrc={workTravels.mobile.headline}
        mobileTempleSrc={workTravels.mobile.temple}
        mobileMapSrc={workTravels.mobile.map}
        alt={workTravels.alt}
      />

      <FutureWorld />
      <FinalCta />
    </>
  );
}
