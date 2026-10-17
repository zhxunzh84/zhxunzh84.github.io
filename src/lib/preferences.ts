/**
 * Site-wide SOUND and MOTION preferences.
 *
 * A tiny external store read with `useSyncExternalStore`:
 * - persisted in localStorage (wrapped in try/catch: storage can be blocked),
 * - MOTION defaults to the OS "reduce motion" setting until the visitor
 *   chooses, and is mirrored to <html data-motion="on|off"> so CSS can stop
 *   every animation in one place,
 * - SOUND is always off until the visitor turns it on.
 */

import { useSyncExternalStore } from "react";
import { MOTION_KEY, SOUND_KEY } from "./preference-keys";

const listeners = new Set<() => void>();
const memory: Record<string, string> = {};

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memory[key] ?? null;
  }
}

function writeStored(key: string, value: string) {
  memory[key] = value;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private mode / blocked storage: keep the in-memory value only.
  }
}

function osPrefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function readSound(): boolean {
  return readStored(SOUND_KEY) === "on";
}

function readMotion(): boolean {
  const stored = readStored(MOTION_KEY);
  if (stored === "on") return true;
  if (stored === "off") return false;
  return !osPrefersReducedMotion();
}

function emit() {
  document.documentElement.dataset.motion = readMotion() ? "on" : "off";
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === SOUND_KEY || e.key === MOTION_KEY) emit();
  };
  const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  window.addEventListener("storage", onStorage);
  mq?.addEventListener("change", emit);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    mq?.removeEventListener("change", emit);
  };
}

// Snapshots must be primitives so React can compare them cheaply.
const getSnapshot = () => `${readSound() ? 1 : 0}${readMotion() ? 1 : 0}`;
// Server render: sound off, motion on (the inline head script corrects
// <html data-motion> before first paint).
const getServerSnapshot = () => "01";

export function usePreferences() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    sound: snap[0] === "1",
    motion: snap[1] === "1",
    setSound(on: boolean) {
      writeStored(SOUND_KEY, on ? "on" : "off");
      emit();
    },
    setMotion(on: boolean) {
      writeStored(MOTION_KEY, on ? "on" : "off");
      emit();
    },
  };
}
