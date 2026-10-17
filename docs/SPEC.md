# Credentials site — specification

Personal site that presents Zhang Xun's verifiable course credentials from NTU's
**Advanced Professional Certificate in AI Engineering** and links each one to
its OpenCerts verification.

Primary audience: recruiters arriving from a LinkedIn "Show credential" link,
often on a phone, staying a few seconds. The page must say *what this is, who
issued it, and how to verify it* immediately.

## 1. Scope

| In scope | Out of scope |
|---|---|
| Static site, no server, no database | Accounts, CMS, analytics |
| Home page + one detail page per credential | Side projects / portfolio (later) |
| Verification via OpenCerts links | Verifying certificates on this site |
| Desktop and phone layouts | Light theme |

## 2. URLs (permanent — used on LinkedIn)

| Page | URL |
|---|---|
| Home | `https://zhxunzh84.github.io/` |
| Credential detail | `https://zhxunzh84.github.io/certs/<id>/` e.g. `/certs/m01/` |

Ids are stable and never renamed: `m01`…`m05`, `award`.
The existing `zhxunzh84.github.io/cert/` page (separate repo) stays untouched.

## 3. Data model

All content lives in one typed data file (`src/data/credentials.ts`).
Adding or issuing a credential is a data-only change.

```ts
type Status = "issued" | "pending";

interface Credential {
  id: string;            // "m01" … "m05", "award"
  code: string;          // "M-01" … "M-05", "AWARD"
  kind: "module" | "award";
  title: string;         // official NTU title
  status: Status;
  issuedOn?: string;     // "2026-09"
  period?: { start: string; end: string }; // "2026-09-01"
  skills?: string[];
  abstract?: string;
  opencertsUrl?: string; // full OpenCerts link incl. #key fragment
}
```

Programme facts (name, issuer, holder) live alongside as constants.

## 4. Pages

### Home (`/`)
- Header: `ZX / ZHANG XUN`, SOUND and MOTION toggles, LinkedIn and GitHub links
- Intro block `§ 00 — INDEX`: title *AI Engineering, on record*, one-line
  programme description, scope tags; spec table (HOLDER, PROGRAM, ISSUER,
  MODULES, ISSUED, STATUS)
- Progress strip: 6 cells (M-01…M-05, AWARD), issued cells filled
- `§ 01 — ISSUED`: one full-width card per issued credential, **in module
  order**; DATE, PERIOD, ISSUER, SKILLS (`+` separated), OPEN RECORD link
- `§ 02 — UPCOMING`: compact rows for pending modules, AWARD last
- Footer disclaimer: personal page, not an official NTU or OpenCerts website

### Credential detail (`/certs/<id>/`) — generated for issued credentials
- Header: `← INDEX`, toggles, `ZX / RECORD M-0x` (decode easter egg)
- Title block + spec cells: HOLDER, ISSUER, DATE, FORMAT
- Verification panel with **VERIFY ON OPENCERTS** (opens in new tab)
- Provenance strip: `ISSUED · NTU · <date> - - - VERIFY · OPENCERTS.IO`
- ABSTRACT + SKILLS
- `§ CAPSTONE` section on M-05 only
- SEQUENCE strip of all six credentials, BACK TO INDEX

## 5. Visual system
- Background `#0A1120` with faint 32px grid; panels `#0D1628`; hairlines `#1E2A44`
- Text `#E6EDF7` / `#C9D4E5` / `#9AA8BF` / `#7787A1`; accent `#4C8DFF`
- Fonts: Geist (body), Geist Mono (headings and technical fields), via `next/font`
- Modular grid built from 1px shared hairlines, no rounded floating cards
- Never claim "verified" statically; verification only happens on OpenCerts

## 6. Motion and sound
| Effect | Trigger | Notes |
|---|---|---|
| Grid draw-in + staggered rise | page load | < 1 s total, one-off |
| Progress fill | page load | |
| Crosshair + coordinate readout | mouse move | desktop / hover devices only |
| Issued card glow border (cool blue/cyan/violet, rotating + breathing) | hover | |
| Pending row hatch drift, AWARD scan band | hover | |
| Provenance dashed line flow | always (detail) | the only continuous animation |
| RECORD decode (0.8 s scramble hold, ~0.4 s resolve) | label enters viewport, tab refocus, hover | fixed-width, no ligatures, A–Z/0–9 glyphs |

Sound (Web Audio, synthesised, no files), **off by default**:
- Toggle on: relay click
- OPEN RECORD click: "record retrieval" tick run + lock tone
- VERIFY click: two-tone handshake
- Decode ticks: **only on hover replay**, never on page entry

Toggles are site-wide and persisted in `localStorage`.
MOTION defaults to the OS `prefers-reduced-motion` setting; when off, all
animation stops and states render final.

## 7. Responsive (≤ 600px)
- Detail spec cells 2×2; subtitle and verify description hidden so
  VERIFY is within the first screen
- Verify button full width; reduced paddings; progress labels smaller

## 8. Quality bar
- `npm run lint`, `npm run typecheck`, `npm run build` pass in CI
- Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95
- Keyboard reachable controls, visible focus, `aria-pressed` on toggles,
  text contrast ≥ 4.5:1

## 9. Acceptance checklist
- [ ] Home and both issued detail pages live on GitHub Pages
- [ ] Each VERIFY button opens the correct certificate and OpenCerts verifies it
- [ ] Certificate files hosted in this repo (`public/certs/`) and verify from there
- [ ] Pending credentials appear only as rows; issuing one is a data-only change
- [ ] SOUND off by default; MOTION follows OS; both persist across pages
- [ ] Decode plays on entry (silent) and on hover (with sound if on)
- [ ] Phone (390px): VERIFY visible without scrolling on detail page
- [ ] Tested on a real phone via the LinkedIn app
- [ ] LinkedIn credential URLs switched to `/certs/<id>/`
