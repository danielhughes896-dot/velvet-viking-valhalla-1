import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import { pages } from "@/content/site";

export const metadata: Metadata = {
  title: pages.about.heading,
  description: pages.about.sub,
};

export default function AboutPage() {
  return (
    <>
      <PageIntro {...pages.about} />
      <section id="contact" className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center sm:px-8">
          <h2 className="font-head text-xs font-semibold uppercase tracking-[0.24em] text-vv-bronze-text">
            Contact
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-vv-ink-faint">
            [Contact details to be confirmed.]
          </p>
        </div>
      </section>
    </>
  );
}
