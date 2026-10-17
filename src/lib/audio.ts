/**
 * Tiny Web Audio synth: every sound is generated from oscillators, so there
 * are no audio files to load. One AudioContext is shared for the whole visit
 * (it survives client-side navigation between pages).
 *
 * Browsers only allow audio after a user gesture, so `ensureAudio()` must be
 * called from a click/keypress handler before the first sound.
 */

let ctx: AudioContext | null = null;

export function ensureAudio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** One short enveloped tone. `delay` is in seconds from now. */
function tone(
  freq: number,
  dur: number,
  gain: number,
  type: OscillatorType = "sine",
  delay = 0,
) {
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  // Fast attack, exponential decay: a click-free "blip".
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(amp).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sounds = {
  /** SOUND toggled on: relay click. */
  relay() {
    tone(180, 0.05, 0.09, "square");
    tone(2600, 0.02, 0.03, "square", 0.012);
  },
  /** OPEN RECORD: accelerating read ticks, then a lock tone. */
  retrieve() {
    const steps = 8;
    for (let i = 0; i < steps; i++) {
      const at = 0.19 * Math.pow(i / steps, 0.6);
      tone(620 + i * 210 + Math.random() * 90, 0.016, 0.028, "square", at);
    }
    tone(1760, 0.07, 0.045, "sine", 0.21);
    tone(2640, 0.05, 0.018, "sine", 0.21);
  },
  /** VERIFY: two-tone handshake. */
  handshake() {
    tone(660, 0.09, 0.06, "sine");
    tone(990, 0.12, 0.06, "sine", 0.09);
  },
  /** Decode: faint static while scrambled. */
  scramble() {
    tone(900 + Math.random() * 900, 0.018, 0.018, "square");
  },
  /** Decode: one character locked. */
  lockChar() {
    tone(1700 + Math.random() * 500, 0.022, 0.035, "triangle");
  },
  /** Decode: whole label resolved. */
  lockDone() {
    tone(880, 0.06, 0.05, "sine", 0.03);
    tone(1320, 0.1, 0.05, "sine", 0.09);
  },
};
