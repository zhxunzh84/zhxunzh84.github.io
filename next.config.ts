import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages: `next build` writes the site to `out/`.
  output: "export",
  // Emit `/certs/m01/index.html` so URLs end in a slash, as used on LinkedIn.
  trailingSlash: true,
  // GitHub Pages has no image optimisation server.
  images: { unoptimized: true },
};

export default nextConfig;
