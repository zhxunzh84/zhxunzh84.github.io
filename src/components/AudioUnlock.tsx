"use client";

import { useEffect } from "react";
import { ensureAudio, isAudioRunning } from "@/lib/audio";
import { usePreferences } from "@/lib/preferences";

/**
 * Browsers keep audio locked until the visitor interacts with the page. When
 * SOUND was left on from an earlier visit, the first click or key press
 * anywhere unlocks it, not just clicks on the few controls that make a sound.
 *
 * Listens in the capture phase so it runs even if a handler stops
 * propagation, and removes itself after the first gesture. Several event
 * types because browsers differ in which ones count as activation (older
 * iOS Safari only honours touchend).
 */
const EVENTS = ["pointerdown", "pointerup", "touchend", "keydown"] as const;
export function AudioUnlock() {
  const { sound } = usePreferences();

  useEffect(() => {
    if (!sound || isAudioRunning()) return;
    const unlock = () => {
      ensureAudio();
      remove();
    };
    const remove = () => {
      for (const e of EVENTS) window.removeEventListener(e, unlock, true);
    };
    for (const e of EVENTS) window.addEventListener(e, unlock, true);
    return remove;
  }, [sound]);

  return null;
}
