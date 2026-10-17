"use client";

import { useEffect, useState } from "react";
import { usePreferences } from "@/lib/preferences";
import { pad4 } from "@/lib/format";

/**
 * Faint crosshair that follows the mouse, with a page-coordinate readout.
 * Mouse only (ignores touch/pen); CSS hides it on small or non-hover screens.
 */
export function Crosshair() {
  const { motion } = usePreferences();
  const [pos, setPos] = useState<{ x: number; y: number; pageY: number } | null>(
    null,
  );

  useEffect(() => {
    if (!motion) return;
    let raf = 0;
    let last = { x: 0, y: 0, pageY: 0 };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = { x: e.clientX, y: e.clientY, pageY: e.pageY };
      // Coalesce to one state update per frame.
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          setPos(last);
        });
      }
    };
    const onLeave = () => {
      // Drop a frame queued by the last move, or it would re-show the
      // crosshair after we hide it.
      cancelAnimationFrame(raf);
      raf = 0;
      setPos(null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [motion]);

  if (!motion || !pos) return null;

  return (
    <div className="crosshair" aria-hidden="true">
      <div className="crosshair-v" style={{ transform: `translateX(${pos.x}px)` }} />
      <div className="crosshair-h" style={{ transform: `translateY(${pos.y}px)` }} />
      <div className="crosshair-readout">
        X {pad4(pos.x)} · Y {pad4(pos.pageY)}
      </div>
    </div>
  );
}
