import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import DeviceFrame from "@/components/ui/DeviceFrame";
import { pages, valhallaProduct } from "@/content/site";

export const metadata: Metadata = {
  title: pages.valhalla.heading,
  description: pages.valhalla.sub,
};

export default function ValhallaPage() {
  return (
    <>
      <PageIntro {...pages.valhalla} />

      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 pt-20 text-center sm:px-8">
          {pages.valhalla.expanded.map((paragraph) => (
            <p key={paragraph} className="max-w-md text-base leading-relaxed text-vv-ink-dim">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-end">
            <DeviceFrame
              kind="desktop"
              label={valhallaProduct.screenshots.desktop.placeholder}
              className="sm:-mr-16"
            />
            <DeviceFrame kind="mobile" label={valhallaProduct.screenshots.mobile.placeholder} />
          </div>
        </div>
      </section>
    </>
  );
}
