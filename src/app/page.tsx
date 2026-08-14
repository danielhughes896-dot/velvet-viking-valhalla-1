import Hero from "@/components/sections/Hero";
import EditorialSplit from "@/components/sections/EditorialSplit";
import ProductShowcase from "@/components/sections/ProductShowcase";
import FullWidthPhoto from "@/components/sections/FullWidthPhoto";
import FutureWorld from "@/components/sections/FutureWorld";
import FinalCta from "@/components/sections/FinalCta";
import { brandStory, earnYourPlace, fullWidthPhoto } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero />

      <EditorialSplit
        theme="light"
        eyebrow={brandStory.eyebrow}
        heading={brandStory.heading}
        body={brandStory.body}
        mediaLabel={brandStory.media.placeholder}
        mediaAlt={brandStory.media.alt}
      />

      <ProductShowcase />

      <FullWidthPhoto
        mediaLabel={fullWidthPhoto.media.placeholder}
        mediaAlt={fullWidthPhoto.media.alt}
        caption={fullWidthPhoto.caption}
      />

      <EditorialSplit
        theme="light"
        eyebrow={earnYourPlace.eyebrow}
        heading={earnYourPlace.heading}
        body={earnYourPlace.body}
        mediaLabel={earnYourPlace.media.placeholder}
        mediaAlt={earnYourPlace.media.alt}
        reverse
      />

      <FutureWorld />
      <FinalCta />
    </>
  );
}
