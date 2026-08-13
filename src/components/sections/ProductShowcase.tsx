import SectionHeading from "@/components/ui/SectionHeading";
import CtaButton from "@/components/ui/CtaButton";
import DeviceFrame from "@/components/ui/DeviceFrame";
import { valhallaProduct } from "@/content/site";

export default function ProductShowcase() {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          eyebrow={valhallaProduct.eyebrow}
          heading={valhallaProduct.heading}
          align="center"
        />
        <p className="mx-auto mt-5 max-w-lg text-center text-lg text-vv-ink-dim">
          {valhallaProduct.sub}
        </p>

        <div className="relative mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-end">
          <DeviceFrame
            kind="desktop"
            label={valhallaProduct.screenshots.desktop.placeholder}
            className="sm:-mr-16"
          />
          <DeviceFrame
            kind="mobile"
            label={valhallaProduct.screenshots.mobile.placeholder}
            className="relative"
          />
        </div>

        <div className="mx-auto mt-20 max-w-3xl">
          <p className="text-center text-base leading-relaxed text-vv-ink-dim">
            {valhallaProduct.body}
          </p>

          <ul className="mt-10 grid gap-6 text-center sm:grid-cols-3">
            {valhallaProduct.points.map((point) => (
              <li
                key={point}
                className="font-head text-[13px] font-medium uppercase tracking-[0.1em] text-vv-ink-faint"
              >
                {point}
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
