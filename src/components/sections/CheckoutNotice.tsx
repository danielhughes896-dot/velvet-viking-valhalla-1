"use client";

import { useSyncExternalStore } from "react";

// THE ONE PIECE OF THE CHECKOUT THE WEBSITE OWNS.
//
// Valhalla's Stripe session is created in the app (api/_stripe.js) and its two
// return addresses are set there, not here:
//
//   success_url  <app origin>/account?checkout=complete&session_id=...
//   cancel_url   <marketing origin>/pricing?checkout=cancelled
//
// Success returns to the app, which knows the athlete and their entitlement.
// CANCEL RETURNS HERE — to this site's pricing page, on this site's domain —
// and until now nothing on the page acknowledged it. Somebody who opened
// checkout, thought better of it and pressed back landed on an ordinary
// pricing page with no confirmation that they had not just been charged.
// That is the single worst moment to leave silent.
//
// CLIENT-SIDE ON PURPOSE. Reading the query string on the server would make
// /pricing a dynamic route for every visitor in order to serve a message that
// matters to a handful; this keeps the page static and prerendered, and the
// notice appears the moment the browser has the URL.
//
// NO COMMERCE HERE. This reads one query parameter and renders a sentence. It
// grants nothing, records nothing and calls nothing — Stripe and entitlement
// remain entirely the app's.
// Read through useSyncExternalStore rather than a state-in-effect pair: the
// query string is external, immutable for the life of this render, and the
// server has no answer for it. Same mechanism MobileNav uses to know it has
// hydrated, and it keeps the server snapshot honest (false) instead of
// rendering a notice into HTML that may not apply.
const subscribe = () => () => {};
const getSnapshot = () =>
  new URLSearchParams(window.location.search).get("checkout") === "cancelled";
const getServerSnapshot = () => false;

export default function CheckoutNotice() {
  const cancelled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!cancelled) return null;

  return (
    <div
      role="status"
      className="mx-auto mb-12 w-full max-w-md rounded-vv border border-vv-line bg-vv-bg-2 px-6 py-5 text-center"
    >
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-bronze-text">
        Checkout closed
      </p>
      {/* Says the one thing the athlete actually wants to know, and stops.
          No urgency, no second attempt at selling: they have already seen the
          page this notice sits on. */}
      <p className="mt-2 text-sm leading-relaxed text-vv-ink">
        You haven’t been charged. Your plan is still saved, and you can pick this
        up whenever you’re ready.
      </p>
    </div>
  );
}
