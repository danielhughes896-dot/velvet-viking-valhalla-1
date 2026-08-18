import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import Gallery from "@/components/sections/Gallery";
import { pages } from "@/content/site";

export const metadata: Metadata = {
  title: pages.gallery.heading,
  description: pages.gallery.sub,
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageIntro {...pages.gallery} />
      <Gallery />
    </>
  );
}
