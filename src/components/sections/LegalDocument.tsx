import SectionHeading from "@/components/ui/SectionHeading";
import type { LegalDocument as LegalDocumentContent } from "@/content/legal";

// Renders a full legal document (Privacy, Terms, Cookies) from the structured
// content in @/content/legal. Deliberately plainer than the marketing sections:
// legal copy is read, not scanned, so this is a single measured column with
// generous leading and no editorial devices competing for attention.
//
// Only rendered when LEGAL_CONTENT_APPROVED is true — see @/content/legal.
export default function LegalDocument({ doc }: { doc: LegalDocumentContent }) {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto max-w-2xl px-6 py-28 sm:px-8 sm:py-36">
        <div className="text-center">
          <SectionHeading eyebrow={doc.eyebrow} heading={doc.heading} align="center" />
          <p className="mx-auto mt-6 max-w-lg text-lg text-vv-ink-dim">{doc.sub}</p>
        </div>

        <p className="mt-12 text-sm leading-relaxed text-vv-ink-dim">{doc.preamble}</p>
        <p className="mt-4 font-head text-[11px] uppercase tracking-[0.2em] text-vv-ink-faint">
          Last updated: {doc.lastUpdated}
        </p>

        <div className="mt-16 flex flex-col gap-12">
          {doc.sections.map((section) => (
            <article key={section.heading} className="flex flex-col gap-4">
              <h2 className="font-head text-sm font-semibold uppercase tracking-[0.16em] text-vv-bronze-text">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-vv-ink-dim">
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
