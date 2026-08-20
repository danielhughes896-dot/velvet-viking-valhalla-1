import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import BillingPeriodChoice from "@/components/sections/BillingPeriodChoice";
import { pages } from "@/content/site";

export const metadata: Metadata = {
  title: pages.trial.heading,
  description: pages.trial.sub,
  alternates: { canonical: "/trial" },
};

// STEP TWO OF THE COMMERCIAL JOURNEY: /pricing -> /trial -> /start.
//
// WHY A NEW ROUTE RATHER THAN EVOLVING /start. /start is not just a signup
// page: it is also where the five-person private beta's own entry point
// lives ("Already invited to the private beta?" -> the app's real /get URL).
// Rebuilding that page into a billing chooser would have moved or buried the
// one door existing testers use, which is precisely the beta behaviour this
// task must not disturb. Adding a step in front of /start leaves that door
// exactly where it was, on the same URL, reachable by the same link, while
// still putting the billing choice directly behind the pricing CTA where the
// journey wants it.
//
// The division of labour between the two pages is real, not padding: this
// page asks the one question (how should Standard continue after the trial),
// and /start still answers the next one (what actually happens, and create an
// account). Neither repeats the other.
//
// NOTHING COMMERCIAL HAPPENS HERE. No payment provider, no checkout session,
// no card form, no subscription or entitlement record, no tax logic, no
// mutation of any kind. The page renders two prices read from
// content/commerce.ts and hands a chosen period to the next page as a query
// parameter. That is the entire behaviour.
export default function TrialPage() {
  return (
    <>
      <PageIntro {...pages.trial} />
      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto max-w-3xl px-6 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-20">
          <BillingPeriodChoice />
        </div>
      </section>
    </>
  );
}
