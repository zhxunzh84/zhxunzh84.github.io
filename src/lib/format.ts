import type { Credential } from "@/data/credentials";

/** "2026-09-01 → 2026-09-06" */
export function formatPeriod(period: Credential["period"]): string | undefined {
  return period ? `${period.start} → ${period.end}` : undefined;
}

/** Zero-padded count, e.g. 2 → "02" */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function certPath(id: string): string {
  return `/certs/${id}/`;
}
