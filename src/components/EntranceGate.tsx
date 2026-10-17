"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Longest entrance (delay + duration) is 950ms; see globals.css.
const ENTRANCE_MS = 1000;

/**
 * Marks entrance animations as finished with <html data-entered>.
 *
 * Entrances are one-off page-load effects. Without this, toggling MOTION off
 * and on again would re-apply them, and their `backwards` fill would hide
 * already-visible content while they replay. The flag is cleared on every
 * navigation so each newly opened page still gets its entrance; if MOTION is
 * off when a page opens, the entrance counts as skipped straight away.
 */
export function EntranceGate() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    delete root.dataset.entered;
    const skipped = root.dataset.motion === "off";
    const timer = window.setTimeout(
      () => {
        root.dataset.entered = "true";
      },
      skipped ? 0 : ENTRANCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
