import type { Metadata } from "next";
// Self-hosted Geist fonts from the `geist` package: bundled at build time,
// no request to Google Fonts at build or run time.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AudioUnlock } from "@/components/AudioUnlock";
import { Crosshair } from "@/components/Crosshair";
import { EntranceGate } from "@/components/EntranceGate";
import { SITE_URL, ogImagePath } from "@/lib/format";
import { motionBootScript } from "@/lib/motion-boot";
import "./globals.css";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Zhang Xun · Credentials",
    template: "%s · Zhang Xun",
  },
  description:
    "Verifiable NTU credentials from the Advanced Professional Certificate in AI Engineering.",
  // Pages that set their own openGraph replace this whole object, so the
  // detail page repeats siteName/type alongside its own image.
  openGraph: {
    type: "website",
    siteName: "Zhang Xun · Credentials",
    url: "/",
    images: [{ url: ogImagePath("index"), width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-motion is set by the boot script before React hydrates, so the
    // server-rendered <html> intentionally differs from the client's.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body>
        <AudioUnlock />
        <Crosshair />
        <EntranceGate />
        {children}
      </body>
    </html>
  );
}
