"use client";

import { useState } from "react";
import { ensureAudio, sounds } from "@/lib/audio";
import { usePreferences } from "@/lib/preferences";
import { ArrowUpRight } from "./icons";
import ui from "./ui.module.css";
import s from "./VerifyPanel.module.css";

/**
 * Verification panel plus the provenance strip beneath it. They share state:
 * hovering or focusing VERIFY fills the strip's open "verify" square.
 */
export function VerifyPanel({
  url,
  issuerShort,
  issuedOn,
}: {
  url: string;
  issuerShort: string;
  issuedOn?: string;
}) {
  const { sound } = usePreferences();
  const [armed, setArmed] = useState(false);

  return (
    <>
      <section className={`${s.verify} anim-rise`} style={{ animationDelay: "750ms" }} aria-labelledby="verify-title">
        <div className={s.text}>
          <p className={`${ui.label} ${s.label}`}>§ VERIFICATION</p>
          <h2 id="verify-title" className={s.title}>
            Verify this certificate
          </h2>
          <p className={s.desc}>
            Open the original digital certificate on OpenCerts to check who
            issued it and that it has not been altered.
          </p>
          <p className={s.note}>
            OPENS OPENCERTS.IO · THIS PAGE DOES NOT CERTIFY THE RESULT
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={s.button}
          onMouseEnter={() => setArmed(true)}
          onMouseLeave={() => setArmed(false)}
          onFocus={() => setArmed(true)}
          onBlur={() => setArmed(false)}
          onClick={() => {
            if (sound && ensureAudio()) sounds.handshake();
          }}
        >
          VERIFY ON OPENCERTS
          <span className={ui.srOnly}> (opens in a new tab)</span>
          <ArrowUpRight size={16} strokeWidth={2.2} />
        </a>
      </section>

      <div className={s.provenance}>
        <span>§ PROVENANCE</span>
        <span className={s.done} aria-hidden="true" />
        <span className={s.issued}>
          ISSUED · {issuerShort}
          {issuedOn ? ` · ${issuedOn}` : ""}
        </span>
        <span className={`${s.line} march`} aria-hidden="true" />
        <span className={`${s.open} ${armed ? s.armed : ""}`} aria-hidden="true" />
        <span>VERIFY · OPENCERTS.IO</span>
      </div>
    </>
  );
}
