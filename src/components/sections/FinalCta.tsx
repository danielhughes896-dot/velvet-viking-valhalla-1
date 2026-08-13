import Crest from "@/components/ui/Crest";
import CtaButton from "@/components/ui/CtaButton";
import { finalCta } from "@/content/site";

export default function FinalCta() {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center sm:px-8 sm:py-36">
        <Crest size={72} />
        <h2 className="mt-8 font-display text-3xl leading-[1.15] font-semibold uppercase tracking-[0.01em] text-vv-ink sm:text-4xl">
          {finalCta.heading[0]}
          <br />
          {finalCta.heading[1]}
        </h2>
        <CtaButton href={finalCta.cta.href} className="mt-10">
          {finalCta.cta.label}
        </CtaButton>
      </div>
    </section>
  );
}
