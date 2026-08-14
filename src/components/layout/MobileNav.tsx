"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Crest from "@/components/ui/Crest";
import CtaButton from "@/components/ui/CtaButton";
import { brand, nav } from "@/content/site";

const subscribeNoop = () => () => {};

// SSR-safe "has this hydrated on the client yet" check, without the extra
// render a useState+useEffect("mounted") pair would cost — the portal
// target (document.body) only exists client-side, so the drawer can't
// render during SSR regardless of `open`.
function useIsClient() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  // The drawer is portaled to <body> (see below) so its `fixed inset-0`
  // sizes against the real viewport — as a Header descendant it would
  // instead size against the header bar, because the header's
  // backdrop-blur establishes a containing block for fixed descendants.
  const isClient = useIsClient();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`block h-px w-5 bg-vv-ink transition-transform duration-200 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
        />
        <span
          className={`block h-px w-5 bg-vv-ink transition-transform duration-200 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
        />
      </button>

      {open && isClient
        ? createPortal(
            <div className="fixed inset-0 z-40 flex flex-col bg-vv-bg">
              <div className="flex-1 overflow-y-auto px-8 pt-28 pb-10">
                <div className="mb-10 flex justify-center">
                  <Crest size={64} />
                </div>
                <nav className="flex flex-col items-center gap-8">
                  {nav.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-head text-xl font-medium uppercase tracking-[0.12em] text-vv-ink"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="border-t border-vv-line-soft px-8 py-8">
                <CtaButton href={nav.cta.href} className="w-full">
                  {nav.cta.label}
                </CtaButton>
                <p className="mt-6 text-center font-head text-[11px] uppercase tracking-[0.24em] text-vv-ink-faint">
                  {brand.name}
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
