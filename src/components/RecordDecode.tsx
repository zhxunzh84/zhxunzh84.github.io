"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ensureAudio, isAudioRunning, sounds } from "@/lib/audio";
import { usePreferences } from "@/lib/preferences";
import ui from "./ui.module.css";
import s from "./RecordDecode.module.css";

// Letters and digits only: symbols like < > / can form font ligatures or fall
// back to another font, which changes width and makes the label jitter.
const GLYPHS = "ABCDEFGHJKLMNPRSTUVXYZ0123456789";
const HOLD_MS = 800; // fully scrambled before resolving starts
const RESOLVE_MS = 420; // left-to-right resolve
const FRAME_MS = 35;

function scramble(target: string, locked: number): string {
  let out = "";
  for (let i = 0; i < target.length; i++) {
    const c = target[i];
    out +=
      i < locked || c === " " || c === "-"
        ? c
        : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

/**
 * "RECORD M-01" label that decodes from noise.
 * - plays silently when it scrolls fully into view and when the tab regains focus
 * - replays on hover, with sound if SOUND is on (the easter egg)
 * - replays on click too: a click is a user gesture, so it can unlock audio
 *   that a hover could not (e.g. SOUND left on from an earlier visit)
 * Screen readers always get the plain text.
 */
export function RecordDecode({ text }: { text: string }) {
  const { sound, motion } = usePreferences();
  const [view, setView] = useState({ chars: text, locked: text.length });
  const elRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // Latest preferences for callbacks that outlive a render.
  const soundRef = useRef(sound);
  const motionRef = useRef(motion);
  useEffect(() => {
    soundRef.current = sound;
    motionRef.current = motion;
  }, [sound, motion]);

  const start = useCallback(
    (audible: boolean) => {
      window.clearTimeout(timer.current);
      if (!motionRef.current) {
        setView({ chars: text, locked: text.length });
        return;
      }
      const begin = performance.now() + HOLD_MS;
      let lastLocked = 0;
      let lastStatic = 0;

      const tick = () => {
        const now = performance.now();
        const t = Math.max(0, Math.min(1, (now - begin) / RESOLVE_MS));
        const locked = t >= 1 ? text.length : Math.floor(t * text.length);

        // Hover is not a user gesture: never create or resume audio here.
        // Decode sounds play only if a click already unlocked audio.
        if (audible && soundRef.current && isAudioRunning()) {
          if (locked > lastLocked) sounds.lockChar();
          else if (t === 0 && now - lastStatic > 130) {
            sounds.scramble();
            lastStatic = now;
          }
          if (t >= 1) sounds.lockDone();
        }
        lastLocked = locked;

        setView({ chars: t >= 1 ? text : scramble(text, locked), locked });
        if (t < 1) timer.current = window.setTimeout(tick, FRAME_MS);
      };
      tick();
    },
    [text],
  );

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    let wasVisible = false;
    const io = new IntersectionObserver(
      (entries) => {
        // threshold: 1 only controls *when* the callback fires; an entry can
        // still report isIntersecting for a partly visible label, so check
        // the ratio too (with a little slack for sub-pixel rounding).
        const entry = entries[entries.length - 1];
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.99;
        if (visible && !wasVisible) start(false);
        wasVisible = visible;
      },
      { threshold: 1 },
    );
    io.observe(el);
    const onVisibility = () => {
      if (document.visibilityState === "visible") start(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(timer.current);
    };
  }, [start]);

  // Turning MOTION off mid-decode snaps to the final text.
  useEffect(() => {
    if (!motion) start(false);
  }, [motion, start]);

  const decoding = view.locked < text.length;

  return (
    // A real button so the replay works from the keyboard and is announced.
    // Its name is the plain label; only the animated characters are hidden.
    <button
      ref={elRef}
      type="button"
      className={s.label}
      title="Replay decode"
      onMouseEnter={() => start(true)}
      onClick={() => {
        // A click or Enter/Space is a user gesture, so it may unlock audio.
        // resume() settles well within HOLD_MS, so the scramble ticks already
        // find the context running.
        if (soundRef.current) ensureAudio();
        start(true);
      }}
    >
      <span aria-hidden="true" className={s.chars}>
        <span>{view.chars.slice(0, view.locked)}</span>
        <span className={s.noise}>{view.chars.slice(view.locked)}</span>
        <span className={`${s.cursor} ${decoding ? s.cursorOn : ""}`}>▌</span>
      </span>
      <span className={ui.srOnly}>{text}, replay decode</span>
    </button>
  );
}
