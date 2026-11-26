"use client";

import { useEffect } from "react";
import { ensureAudio, getAudio, isAudioRunning } from "@/lib/audio";
import { usePreferences } from "@/lib/preferences";

/**
 * Browsers keep audio locked until the visitor interacts with the page. When
 * SOUND was left on from an earlier visit, the first click or key press
 * anywhere unlocks it, not just clicks on the few controls that make a sound.
 *
 * - Capture phase, so it runs even if a handler stops propagation.
 * - Several event types, because browsers differ in which count as a user
 *   gesture: Chrome accepts pointerdown; Safari only honours click,
 *   mousedown/mouseup, touchend and keydown.
 * - Armed whenever the context is not running, not only before the first
 *   unlock: Safari can drop a running context back to "interrupted" (tab
 *   switch, another app taking audio), and the next gesture must revive it.
 */
const EVENTS = [
  "pointerdown",
  "pointerup",
  "mousedown",
  "click",
  "touchend",
  "keydown",
] as const;

export function AudioUnlock() {
  const { sound } = usePreferences();

  useEffect(() => {
    if (!sound) return;
    let armed = false;
    let watched: AudioContext | null = null;

    const arm = () => {
      if (armed) return;
      armed = true;
      for (const e of EVENTS) window.addEventListener(e, unlock, true);
    };
    const disarm = () => {
      if (!armed) return;
      armed = false;
      for (const e of EVENTS) window.removeEventListener(e, unlock, true);
    };
    const sync = () => (isAudioRunning() ? disarm() : arm());
    const watch = (c: AudioContext | null) => {
      if (!c || c === watched) return;
      watched?.removeEventListener("statechange", sync);
      watched = c;
      watched.addEventListener("statechange", sync);
    };
    function unlock() {
      watch(ensureAudio()); // resume() is async: statechange reports success
      sync();
    }

    watch(getAudio());
    sync();
    return () => {
      disarm();
      watched?.removeEventListener("statechange", sync);
    };
  }, [sound]);

  return null;
}
