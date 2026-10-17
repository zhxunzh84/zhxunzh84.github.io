import type { Metadata } from "next";
// Self-hosted Geist fonts from the `geist` package: bundled at build time,
// no request to Google Fonts at build or run time.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  metadataBase: new URL("https://zhxunzh84.github.io"),
  title: {
    default: "Zhang Xun · Credentials",
    template: "%s · Zhang Xun",
  },
  description:
    "Verifiable NTU credentials from the Advanced Professional Certificate in AI Engineering.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
