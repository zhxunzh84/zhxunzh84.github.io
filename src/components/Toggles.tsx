"use client";

import { ensureAudio, sounds } from "@/lib/audio";
import { usePreferences } from "@/lib/preferences";
import s from "./Toggles.module.css";

/** SOUND / MOTION switches shown in the header of every page. */
export function Toggles() {
  const { sound, motion, setSound, setMotion } = usePreferences();

  return (
    <div role="group" aria-label="Page settings" className={s.group}>
      <button
        type="button"
        className={s.toggle}
        aria-pressed={sound}
        onClick={() => {
          const next = !sound;
          if (next && ensureAudio()) sounds.relay();
          setSound(next);
        }}
      >
        <span className={`${s.chip} ${sound ? s.on : ""}`}>
          SOUND · <span className={s.state}>{sound ? "ON" : "OFF"}</span>
        </span>
      </button>
      <button
        type="button"
        className={s.toggle}
        aria-pressed={motion}
        onClick={() => setMotion(!motion)}
      >
        <span className={`${s.chip} ${motion ? s.on : ""}`}>
          MOTION · <span className={s.state}>{motion ? "ON" : "OFF"}</span>
        </span>
      </button>
    </div>
  );
}
