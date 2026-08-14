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
      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 py-24 text-center sm:px-8">
          {pages.about.expanded.map((paragraph) => (
            <p key={paragraph} className="max-w-md text-base leading-relaxed text-vv-ink-dim">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
      <section id="contact" className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center sm:px-8">
          <h2 className="font-head text-xs font-semibold uppercase tracking-[0.24em] text-vv-bronze-text">
            Contact
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-vv-ink-faint">{pages.about.contactNote}</p>
        </div>
      </section>
    </>
  );
}
