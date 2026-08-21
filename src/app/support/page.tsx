import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import { pages, appUrl } from "@/content/site";
import { legalEntity, isConfirmed } from "@/content/legal";

export const metadata: Metadata = {
  title: pages.support.heading,
  description: pages.support.sub,
  alternates: { canonical: "/support" },
};

// THE PRODUCTION SUPPORT ROUTE, AND A STABLE PUBLIC URL.
//
// This page exists as much for the reviewers as for the athletes. Google Play
// Data Safety, Apple App Privacy, the Garmin developer application and Stripe's
// business verification each require a support contact at a stable, public URL
// that does not move once submitted. /support is that URL, alongside /privacy
// and /terms, and it is deliberately a real page rather than a mailto: link in
// a footer — a form submission cannot cite a mailto:.
//
// THE ADDRESS IS NOT WRITTEN HERE. It comes from legalEntity.contactEmail in
// content/legal, the same value the Privacy Policy already gives for data
// rights requests, so an athlete is never given two different addresses for
// the same company and a change of provider is one edit rather than a hunt.
// Everything is guarded by isConfirmed, which is what stops a placeholder ever
// reaching the public on the one page whose whole job is looking reachable.
const email = legalEntity.contactEmail;

const TOPICS = [
  {
    heading: "Your account or your training",
    body: "Sign-in trouble, a plan that does not look right, or a question about what Valhalla has done with your training. Include the email address your account uses.",
  },
  {
    heading: "Billing, trials and cancellation",
    body: "Questions about a trial, a subscription, an invoice or cancelling. Cancelling is done in the app, under your account; write to us if that is not working for you.",
  },
  {
    heading: "Your data, or closing your account",
    body: "You can delete your account and its data from inside the app, under your account. If you would rather we did it, or you want a copy of what we hold, ask here.",
  },
];

export default function SupportPage() {
  return (
    <>
      <PageIntro {...pages.support} />

      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto flex max-w-2xl flex-col gap-12 px-6 pb-24 sm:px-8 sm:pb-32">
          {isConfirmed(email) ? (
            <div className="w-full rounded-vv-lg border border-vv-line bg-vv-bg-2 p-8 text-center shadow-vv sm:p-10">
              <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-bronze-text">
                Email us
              </p>
              <p className="mt-3">
                <a
                  href={`mailto:${email}`}
                  className="font-display text-xl font-semibold text-vv-ink underline decoration-vv-bronze underline-offset-4 hover:text-vv-bronze-text sm:text-2xl"
                >
                  {email}
                </a>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-vv-ink-dim">
                One address for everything. A real person reads it.
              </p>
            </div>
          ) : null}

          <div className="flex flex-col gap-8">
            {TOPICS.map((topic) => (
              <div key={topic.heading}>
                <h2 className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-bronze-text">
                  {topic.heading}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-vv-ink-dim">{topic.body}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-vv-line-soft pt-8 text-sm leading-relaxed text-vv-ink-dim">
            <p>
              Valhalla itself lives at{" "}
              <a
                href={appUrl}
                className="underline decoration-vv-line underline-offset-4 hover:text-vv-bronze-text"
              >
                app.velvetviking.co.uk
              </a>
              . Your account, your plan and your settings are all in there.
            </p>
            {/* The statutory identity, on the page a reviewer or a regulator is
                most likely to open first. Each fact is guarded separately so a
                missing one is simply absent rather than shown as a placeholder. */}
            <p className="mt-4 text-xs text-vv-ink-faint">
              {legalEntity.name}
              {isConfirmed(legalEntity.companyNumber)
                ? `, registered in ${legalEntity.placeOfRegistration}, company number ${legalEntity.companyNumber}`
                : ""}
              {isConfirmed(legalEntity.registeredAddress)
                ? `. Registered office: ${legalEntity.registeredAddress}`
                : ""}
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
