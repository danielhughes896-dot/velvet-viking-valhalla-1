import Link from "next/link";
import LegalDocument from "@/components/sections/LegalDocument";
import type { LegalDocument as LegalDocumentContent } from "@/content/legal";

// REVIEW MODE — READ THE DRAFT WITHOUT PUBLISHING IT.
//
// HQ needs to read the finished legal documents in their real website
// presentation before approving them. The obvious ways to allow that are both
// wrong: flipping LEGAL_APPROVALS would publish unapproved wording, and
// building an admin area would be a whole authenticated surface for four
// documents nobody outside HQ is looking for.
//
// So: an unlinked query parameter on the page the document already lives on.
// `?review=1` renders the draft; anything else renders the existing gated
// placeholder, exactly as before.
//
// WHY THAT IS SAFE ENOUGH, STATED HONESTLY. This is obscurity, not access
// control, and it is chosen deliberately for a document whose harm model is
// "someone mistakes a draft for the real terms" rather than "someone learns a
// secret". Four things address that harm directly:
//   - every gated legal route already sends robots noindex, so the review URL
//     cannot be indexed even if it were guessed;
//   - nothing on the site links to it, and it is absent from the sitemap;
//   - LEGAL_APPROVALS stays false, so the footer link stays absent and the
//     public page keeps saying the document is not published;
//   - the banner below makes the status unmissable to anyone who does land on
//     it, which is the actual mitigation.
// If HQ ever needs real access control here, that is a different task and
// should use real authentication rather than a longer parameter.
export default function LegalReview({
  doc,
  otherDocs,
}: {
  doc: LegalDocumentContent;
  /** The other legal routes, so a reviewer can move between them in review mode. */
  otherDocs: { label: string; href: string }[];
}) {
  return (
    <>
      <div className="border-b border-vv-line bg-vv-bg-2">
        <div className="mx-auto max-w-3xl px-6 py-5 text-center sm:px-8">
          <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-bronze-text">
            Draft for review — not published
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-vv-ink-dim">
            This document has not been approved and is not in force. It is not linked from the site
            and search engines are told not to index it. Nothing here creates any obligation until
            it is approved and published.
          </p>
          {otherDocs.length ? (
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {otherDocs.map((other) => (
                <li key={other.href}>
                  <Link
                    href={`${other.href}?review=1`}
                    className="font-head text-xs font-medium uppercase tracking-[0.15em] text-vv-ink-faint underline decoration-vv-line underline-offset-4 transition-colors hover:text-vv-ink"
                  >
                    {other.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <LegalDocument doc={doc} />
    </>
  );
}

/** Every document in the pack, so each page can offer the other three. */
export const LEGAL_PACK = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Beta Terms", href: "/beta-terms" },
];

export const otherLegalDocs = (currentHref: string) =>
  LEGAL_PACK.filter((d) => d.href !== currentHref);
