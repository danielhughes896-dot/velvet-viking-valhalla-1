import SectionHeading from "@/components/ui/SectionHeading";
import CtaButton from "@/components/ui/CtaButton";
import DeviceFrame from "@/components/ui/DeviceFrame";
import { valhallaProduct } from "@/content/site";

export default function ProductShowcase() {
  return (
    <section className="theme-dark bg-vv-bg">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          eyebrow={valhallaProduct.eyebrow}
          heading={valhallaProduct.heading}
          align="center"
        />
        <p className="mx-auto mt-5 max-w-lg text-center text-lg text-vv-ink-dim">
          {valhallaProduct.sub}
        </p>

        {/* PROTOTYPE: both frames are portrait — Valhalla is phone-first,
            there's no desktop app to screenshot. Primary (Next Move/Plan
            Evolution) leads, unshifted; secondary (Execution Review) is
            deliberately smaller and offset behind/below it, echoing the
            original primary/secondary offset composition without implying
            a desktop surface exists. Ordinary flow (no absolute
            positioning), so the row's height grows to include the offset
            and nothing below it needs manual clearance. */}
        <div className="relative mt-16 flex flex-col items-center justify-center gap-10 sm:flex-row sm:items-start sm:justify-center sm:gap-0">
          <DeviceFrame
            kind="mobile"
            label={valhallaProduct.screenshots.primary.placeholder}
            src={valhallaProduct.screenshots.primary.src}
            alt={valhallaProduct.screenshots.primary.alt}
            priority
            className="sm:-mr-14"
          />
          <div className="relative z-10 origin-top scale-[0.84] sm:mt-20 md:mt-28">
            <DeviceFrame
              kind="mobile"
              label={valhallaProduct.screenshots.secondary.placeholder}
              src={valhallaProduct.screenshots.secondary.src}
              alt={valhallaProduct.screenshots.secondary.alt}
            />
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl sm:mt-10">
          <p className="text-center text-base leading-relaxed text-vv-ink-dim">
            {valhallaProduct.body}
          </p>

          <ul className="mt-10 grid gap-8 text-center sm:grid-cols-3">
            {valhallaProduct.points.map((point) => (
              <li key={point.heading}>
                <p className="font-head text-sm font-medium uppercase tracking-[0.1em] text-vv-ink-dim">
                  {point.heading}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-vv-ink-faint">{point.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex justify-center">
            <CtaButton href={valhallaProduct.cta.href}>{valhallaProduct.cta.label}</CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
