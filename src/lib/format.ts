import type { Credential } from "@/data/credentials";

export const SITE_URL = "https://zhxunzh84.github.io";

/** "2026-09-01 → 2026-09-06" */
export function formatPeriod(period: Credential["period"]): string | undefined {
  return period ? `${period.start} → ${period.end}` : undefined;
}

/** Zero-padded count, e.g. 2 → "02" */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Zero-padded 4-digit integer, e.g. 236 → "0236" */
export function pad4(n: number): string {
  return String(Math.max(0, Math.round(n))).padStart(4, "0");
}

export function certPath(id: string): string {
  return `/certs/${id}/`;
}

/** Share-preview image for a page: "index" or a credential id. */
export function ogImagePath(id: string): string {
  return `/og/${id}.png`;
}

/**
 * OpenCerts link that verifies a certificate hosted on this site.
 * OpenCerts fetches the file from `uri` (GitHub Pages allows cross-origin
 * reads) and checks it in the visitor's browser. The file is unencrypted, so
 * no key is needed in the link.
 */
export function opencertsVerifyUrl(documentPath: string): string {
  const action = {
    type: "DOCUMENT",
    payload: { uri: new URL(documentPath, SITE_URL).href },
  };
  return `https://www.opencerts.io/?q=${encodeURIComponent(JSON.stringify(action))}`;
}
