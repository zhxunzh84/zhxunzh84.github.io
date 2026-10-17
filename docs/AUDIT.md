# Accessibility & performance audit

Last run: 2026-10-17, on the static export served locally (`npm run preview`),
Chromium 141 headless. Re-run after any layout, colour or motion change.

## Lighthouse 12 (median of 5 runs, mobile = simulated slow 4G)

| Page | Performance | Accessibility | Best practices | SEO | FCP | LCP |
|---|---|---|---|---|---|---|
| `/` mobile | 96 | 100 | 100 | 100 | 0.96 s | 2.31 s |
| `/` desktop | 100 | 100 | 100 | 100 | | |
| `/certs/m01/` mobile | 99 | 100 | 100 | 100 | 0.92 s | 2.27 s |
| `/certs/m01/` desktop | 100 | 100 | 100 | 100 | | |

**LCP is bounded by the entrance animation**, not by loading: the largest text
block counts as painted only once its `draw` clip-path has revealed it.
`experimental.inlineCss` was measured and rejected — FCP improved ~0.3 s, LCP
did not (2.40 s / 2.76 s), and it is an experimental flag.

## axe-core 4 (WCAG 2.0–2.2 A/AA + best practices)

0 violations on `/`, `/certs/m01/`, `/certs/m02/` at 1280 px and 375 px,
after entrances finish.

axe reports colour contrast as "needs review" because the body has a grid
background gradient. Checked by hand against `--bg` (worst case `--panel`):

| Token | Use | Ratio | AA (4.5:1) |
|---|---|---|---|
| `--text` | headings, values | 16.0 | ✓ |
| `--text-2` | body | 12.6 | ✓ |
| `--text-3` | secondary | 7.8 | ✓ |
| `--text-4` | labels, hints | 5.2 (4.96) | ✓ |
| `--accent` | chips, noise glyphs | 5.9 | ✓ |
| `#7aabff` | focus outline | 8.2 (3:1 needed) | ✓ |

The `/` in the brand mark (`#4a5878`) is decorative and `aria-hidden`.

## Manual checks

| Check | Result |
|---|---|
| Tab order follows reading order; every stop has a visible outline | ✓ |
| Skip link is the first tab stop and moves focus to `<main>` | ✓ (added in this audit) |
| Interactive targets ≥ 24 × 24 px (WCAG 2.5.8) | ✓ RECORD button raised from 17 px to 44 px |
| 320 px viewport: no horizontal scroll (WCAG 1.4.10) | ✓ all pages |
| OS "reduce motion" → `data-motion="off"`, no running animations | ✓ |
| RECORD replay works with Enter/Space; announced as "RECORD M-01, replay decode" | ✓ |
| VERIFY announces "(opens in a new tab)" | ✓ |

## How to re-run

```sh
npm run build && npm run preview          # serves out/ on :3000
npx lighthouse http://localhost:3000/ --view
npx lighthouse http://localhost:3000/ --preset=desktop --view
```

For axe, the browser extension (axe DevTools) on the served pages is enough.
