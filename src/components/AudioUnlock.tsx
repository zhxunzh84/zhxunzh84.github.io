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
 * propagation. Several event types because browsers differ in which ones
 * count as activation (on touch, pointerdown may come before the eligible
 * pointerup/touchend; older iOS Safari only honours touchend). So the
 * listeners stay until the context is actually running, not just until the
 * first event.
 */
const EVENTS = ["pointerdown", "pointerup", "touchend", "keydown"] as const;
export function AudioUnlock() {
  const { sound } = usePreferences();

  useEffect(() => {
    if (!sound || isAudioRunning()) return;
    let ctx: AudioContext | null = null;
    const onState = () => {
      if (isAudioRunning()) remove();
    };
    const unlock = () => {
      const next = ensureAudio(); // resume() is async: wait for "running"
      if (next && next !== ctx) {
        ctx?.removeEventListener("statechange", onState);
        ctx = next;
        ctx.addEventListener("statechange", onState);
      }
      onState();
    };
    const remove = () => {
      for (const e of EVENTS) window.removeEventListener(e, unlock, true);
      ctx?.removeEventListener("statechange", onState);
    };
    for (const e of EVENTS) window.addEventListener(e, unlock, true);
    return remove;
  }, [sound]);

  return null;
}
