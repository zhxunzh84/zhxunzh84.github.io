import { notFound } from "next/navigation";
import { credentials, getCredential, issuedCredentials, programme } from "@/data/credentials";
import { pad2 } from "@/lib/format";
import { renderOgCard } from "@/lib/og";

/**
 * Share-preview PNGs: /og/index.png and /og/<id>.png, written to out/og/ at
 * build time.
 *
 * A route handler (rather than the opengraph-image file convention) because
 * the convention exports files without an extension, and GitHub Pages serves
 * those as application/octet-stream, which link-preview crawlers may reject.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { file: "index.png" },
    ...issuedCredentials.map((c) => ({ file: `${c.id}.png` })),
  ];
}

export async function GET(
  _req: Request,
  ctx: RouteContext<"/og/[file]">,
) {
  const { file } = await ctx.params;
  const id = file.replace(/\.png$/, "");

  if (id === "index") {
    return renderOgCard({
      label: "INDEX",
      title: "AI Engineering, on record",
      subtitle: programme.name.toUpperCase(),
      specs: [
        ["HOLDER", programme.holder],
        ["ISSUER", programme.issuer],
        [
          "ISSUED",
          `${pad2(issuedCredentials.length)} OF ${pad2(credentials.length)}`,
        ],
      ],
    });
  }

  const c = getCredential(id);
  if (!c || c.status !== "issued") notFound();
  return renderOgCard({
    label: `RECORD ${c.code}`,
    title: c.title,
    subtitle: programme.name.toUpperCase(),
    specs: [
      ["HOLDER", programme.holder],
      ["ISSUER", programme.issuer],
      ["DATE", c.issuedOn ?? "—"],
    ],
    currentId: c.id,
  });
}
