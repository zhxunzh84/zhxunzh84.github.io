"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePreferences } from "@/lib/preferences";

// Longest entrance (delay + duration) is 950ms; see globals.css.
const ENTRANCE_MS = 1000;

/**
 * Marks entrance animations as finished with <html data-entered>.
 *
 * Entrances are one-off page-load effects. Without this, toggling MOTION off
 * and on again would re-apply them, and their `backwards` fill would hide
 * already-visible content while they replay.
 *
 * - On every navigation the flag is cleared so the new page gets its
 *   entrance. This runs in a layout effect: it must happen before the
 *   destination paints, or the page would flash fully visible first.
 * - Turning MOTION off consumes the entrance at once, so turning it back on
 *   (even within the first second) cannot replay it on the same page.
 */
export function EntranceGate() {
  const pathname = usePathname();
  const { motion } = usePreferences();
  const timer = useRef<number | undefined>(undefined);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const markEntered = () => {
      root.dataset.entered = "true";
    };
    window.clearTimeout(timer.current);
    if (root.dataset.motion === "off") {
      markEntered();
    } else {
      delete root.dataset.entered;
      timer.current = window.setTimeout(markEntered, ENTRANCE_MS);
    }
    return () => window.clearTimeout(timer.current);
  }, [pathname]);

  useEffect(() => {
    if (motion) return;
    window.clearTimeout(timer.current);
    document.documentElement.dataset.entered = "true";
  }, [motion]);

  return null;
}
