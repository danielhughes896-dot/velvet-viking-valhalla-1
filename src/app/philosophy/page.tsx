import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import Crest from "@/components/ui/Crest";
import { pages } from "@/content/site";

export const metadata: Metadata = {
  title: pages.philosophy.heading,
  description: pages.philosophy.sub,
};

export default function PhilosophyPage() {
  return (
    <>
      <PageIntro {...pages.philosophy} />
      <section className="theme-light border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 py-24 text-center sm:px-8">
          <Crest size={80} framed />
          {pages.philosophy.expanded.map((paragraph) => (
            <p key={paragraph} className="max-w-md text-base leading-relaxed text-vv-ink-dim">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
