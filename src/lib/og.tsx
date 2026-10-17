/**
 * Share-preview images (Open Graph / LinkedIn / X), rendered at build time.
 *
 * `next/og` turns this JSX into a PNG with Satori. Satori only understands a
 * subset of CSS: flexbox layout (every element with several children needs
 * `display: flex`), inline styles, and fonts passed in as raw bytes — so the
 * Geist TTF files are read straight from the `geist` package.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { credentials, programme } from "@/data/credentials";

export const ogSize = { width: 1200, height: 630 };

// Same values as the tokens in globals.css (Satori can't read CSS variables).
const c = {
  bg: "#0a1120",
  line: "#1e2a44",
  lineStrong: "#2a3756",
  text: "#e6edf7",
  text3: "#9aa8bf",
  text4: "#7787a1",
  accent: "#4c8dff",
};

const fontDir = path.join(process.cwd(), "node_modules/geist/dist/fonts");

async function loadFonts() {
  const [sans, mono] = await Promise.all([
    readFile(path.join(fontDir, "geist-sans/Geist-SemiBold.ttf")),
    readFile(path.join(fontDir, "geist-mono/GeistMono-Regular.ttf")),
  ]);
  return [
    { name: "Geist", data: sans, weight: 600 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

interface OgCardProps {
  /** Small label top-left, e.g. "RECORD M-01". */
  label: string;
  title: string;
  subtitle: string;
  /** Spec cells along the bottom. */
  specs: [string, string][];
  /** Which credential to highlight in the progress strip, if any. */
  currentId?: string;
}

export async function renderOgCard({
  label,
  title,
  subtitle,
  specs,
  currentId,
}: OgCardProps) {
  const mono = { fontFamily: "Geist Mono", letterSpacing: "0.08em" };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 48,
          background: c.bg,
          // faint engineering grid
          backgroundImage: `linear-gradient(${c.line} 1px, transparent 1px), linear-gradient(90deg, ${c.line} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: "-1px -1px",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: c.bg,
            border: `1px solid ${c.lineStrong}`,
          }}
        >
          {/* top bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "22px 32px",
              borderBottom: `1px solid ${c.line}`,
              fontSize: 20,
              color: c.text3,
              ...mono,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  padding: "4px 10px",
                  border: `1px solid ${c.accent}`,
                  color: c.accent,
                }}
              >
                {programme.holderInitials}
              </div>
              <div style={{ display: "flex", color: c.text }}>{label}</div>
            </div>
            <div style={{ display: "flex" }}>VERIFIABLE ON OPENCERTS</div>
          </div>

          {/* title */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 32px",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Geist",
                fontWeight: 600,
                fontSize: title.length > 40 ? 58 : 68,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: c.text,
              }}
            >
              {title}
            </div>
            <div style={{ display: "flex", fontSize: 22, color: c.text3, ...mono }}>
              {subtitle}
            </div>
          </div>

          {/* progress strip: one segment per credential */}
          <div style={{ display: "flex", gap: 6, padding: "0 32px 24px" }}>
            {credentials.map((x) => (
              <div
                key={x.id}
                style={{
                  flex: 1,
                  height: 6,
                  background:
                    x.id === currentId
                      ? c.accent
                      : x.status === "issued"
                        ? "#2f5fb3"
                        : c.line,
                }}
              />
            ))}
          </div>

          {/* spec cells */}
          <div style={{ display: "flex", borderTop: `1px solid ${c.line}` }}>
            {specs.map(([term, value], i) => (
              <div
                key={term}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: "18px 32px",
                  borderLeft: i === 0 ? "none" : `1px solid ${c.line}`,
                  ...mono,
                }}
              >
                <div style={{ display: "flex", fontSize: 15, color: c.text4 }}>
                  {term}
                </div>
                <div style={{ display: "flex", fontSize: 20, color: c.text }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await loadFonts() },
  );
}
