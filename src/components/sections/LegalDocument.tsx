import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import type { LegalDocument as LegalDocumentContent } from "@/content/legal";

// Renders a full legal document from the structured content in @/content/legal.
// Deliberately plainer than the marketing sections: legal copy is read, not
// scanned, so this is a single measured column with generous leading and no
// editorial devices competing for attention.
//
// Rendered only when the document's own gate in LEGAL_APPROVALS is true. Each
// document has its own gate — see the note at the top of @/content/legal for why
// that is not one shared flag.

// Linkification, deliberately narrow. A legal page that prints
// "email support@velvetviking.co.uk" as dead text makes the reader do work at
// exactly the moment they have decided to exercise a right, and a Privacy Policy
// that mentions the beta terms should be one tap from them. Only two things are
// matched -- the support address and the site's own legal paths -- because a
// general-purpose autolinker in legal copy is a way to create surprises.
const LINK_PATTERN = /(support@velvetviking\.co\.uk|\/(?:privacy|beta-terms|terms|cookies)\b)/g;

function withLinks(text: string) {
  const parts = text.split(LINK_PATTERN);
  return parts.map((part, i) => {
    if (part === "support@velvetviking.co.uk") {
      return (
        <a
          key={i}
          href={`mailto:${part}`}
          className="text-vv-bronze-text underline decoration-vv-bronze-text/40 underline-offset-2 transition-colors hover:decoration-vv-bronze-text"
        >
          {part}
        </a>
      );
    }
    if (part.startsWith("/")) {
      return (
        <Link
          key={i}
          href={part}
          className="text-vv-bronze-text underline decoration-vv-bronze-text/40 underline-offset-2 transition-colors hover:decoration-vv-bronze-text"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
}

export default function LegalDocument({ doc }: { doc: LegalDocumentContent }) {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto max-w-2xl px-6 py-28 sm:px-8 sm:py-36">
        <div className="text-center">
          {/* FINAL QA FIX PASS: this is always the first (and only)
              top-level heading on whatever legal page renders it — the same
              reasoning PageIntro already applies — so it must be the h1,
              not fall through to SectionHeading's h2 default. */}
          <SectionHeading eyebrow={doc.eyebrow} heading={doc.heading} align="center" level="h1" />
          <p className="mx-auto mt-6 max-w-lg text-lg text-vv-ink-dim">{doc.sub}</p>
        </div>

        <p className="mt-12 text-sm leading-relaxed text-vv-ink-dim">{withLinks(doc.preamble)}</p>
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
                  {withLinks(paragraph)}
                </p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
