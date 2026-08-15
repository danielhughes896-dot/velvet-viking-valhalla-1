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
      {/* COPY AUDIT: the "Contact" section that lived here ("Contact
          details will be published here soon.") was removed rather than
          rewritten — a real contact mechanism doesn't exist yet, and the
          audit correctly flagged that stating so outright cost more
          credibility than it was worth. No placeholder/fake contact
          details were substituted in its place; this page simply doesn't
          claim a contact channel until one is real. */}
      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 py-24 text-center sm:px-8">
          {pages.about.expanded.map((paragraph) => (
            <p key={paragraph} className="max-w-md text-base leading-relaxed text-vv-ink-dim">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
