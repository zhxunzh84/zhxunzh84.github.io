import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  credentials,
  getCredential,
  issuedCredentials,
  programme,
} from "@/data/credentials";
import { Brand, SiteFooter, SiteHeader, chrome } from "@/components/SiteChrome";
import { ArrowLeft } from "@/components/icons";
import { RecordDecode } from "@/components/RecordDecode";
import { RetrieveLink } from "@/components/SoundLink";
import { Toggles } from "@/components/Toggles";
import { VerifyPanel } from "@/components/VerifyPanel";
import { certPath, ogImagePath, pad2 } from "@/lib/format";
import ui from "@/components/ui.module.css";
import s from "./page.module.css";

// Only issued credentials get a page; any other id is a 404 in the export.
export const dynamicParams = false;

export function generateStaticParams() {
  return issuedCredentials.map((c) => ({ id: c.id }));
}

export async function generateMetadata(
  props: PageProps<"/certs/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const c = getCredential(id);
  if (!c) return {};
  const description = `${c.code} of the ${programme.name}, issued by ${programme.issuer}${
    c.issuedOn ? ` in ${c.issuedOn}` : ""
  }. Verifiable on OpenCerts.`;
  const image = {
    url: ogImagePath(c.id),
    width: 1200,
    height: 630,
    alt: `${c.code} — ${c.title}`,
  };
  return {
    title: c.title,
    description,
    alternates: { canonical: certPath(c.id) },
    openGraph: {
      type: "website",
      siteName: "Zhang Xun · Credentials",
      url: certPath(c.id),
      title: `${c.title} · ${programme.holder}`,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function CredentialPage(props: PageProps<"/certs/[id]">) {
  const { id } = await props.params;
  const c = getCredential(id);
  if (!c || c.status !== "issued") notFound();

  const moduleNumber = c.kind === "module" ? c.code.replace("M-", "") : null;
  const issuedCount = credentials.filter((x) => x.status === "issued").length;

  return (
    <>
      <SiteHeader
        start={
          <Link href="/" className={chrome.navLink}>
            <ArrowLeft />
            INDEX
          </Link>
        }
        controls={<Toggles />}
        end={
          <span className={s.recordTag}>
            <Brand initials={programme.holderInitials}>
              <RecordDecode text={`RECORD ${c.code}`} />
            </Brand>
          </span>
        }
      />

      <main className={`${ui.wrap} ${s.main}`}>
        {/* title + spec cells */}
        <section
          className={`${ui.hairline} anim-draw`}
          style={{ animationDelay: "100ms" }}
          aria-labelledby="record-title"
        >
          <div className={s.titleCell}>
            <p className={ui.label}>
              § {c.code} — {programme.name.toUpperCase()}
            </p>
            <h1 id="record-title" className={s.title}>
              {c.title}
            </h1>
            {moduleNumber && (
              <p className={s.subtitle}>
                Module {moduleNumber} of the {programme.name}
              </p>
            )}
          </div>
          <SpecCell term="HOLDER">{programme.holder}</SpecCell>
          <SpecCell term="ISSUER">{programme.issuer}</SpecCell>
          <SpecCell term="DATE">{c.issuedOn ?? "—"}</SpecCell>
          <SpecCell term="FORMAT">OpenCerts</SpecCell>
        </section>

        {/* verification + provenance */}
        {c.opencertsUrl && (
          <VerifyPanel
            url={c.opencertsUrl}
            issuerShort={programme.issuerShort}
            issuedOn={c.issuedOn}
          />
        )}

        {/* abstract + skills */}
        {(c.abstract || c.skills?.length) && (
          <section
            className={`${ui.hairline} anim-draw`}
            style={{ animationDelay: "300ms" }}
            aria-label="About this credential"
          >
            {c.abstract && (
              <div className={s.abstract}>
                <h2 className={ui.label}>§ ABSTRACT</h2>
                <p>{c.abstract}</p>
              </div>
            )}
            {c.skills && c.skills.length > 0 && (
              <div className={s.skillsCell}>
                <h2 className={ui.label}>§ SKILLS</h2>
                <ul className={s.skillList}>
                  {c.skills.map((skill) => (
                    <li key={skill}>
                      <span className={s.dash} aria-hidden="true">
                        —
                      </span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* sequence */}
        <section className={s.section} aria-labelledby="sequence-title">
          <div className={ui.sectionHead}>
            <h2 id="sequence-title" className={ui.label}>
              § SEQUENCE
            </h2>
            <span className={ui.label}>
              <span style={{ color: "var(--text)" }}>{pad2(issuedCount)}</span> /{" "}
              {pad2(credentials.length)} ISSUED
            </span>
          </div>
          <ol className={`${s.sequence} anim-draw`} style={{ animationDelay: "350ms" }}>
            {credentials.map((x) => {
              const current = x.id === c.id;
              const issued = x.status === "issued";
              const state = current ? "CURRENT" : issued ? "ISSUED" : "PENDING";
              const body = (
                <>
                  <span className={s.seqCode}>{x.code}</span>
                  <span className={s.seqState}>{state}</span>
                </>
              );
              return (
                <li
                  key={x.id}
                  className={`${s.seqItem} ${issued ? s.seqIssued : ""} ${
                    current ? s.seqCurrent : ""
                  }`}
                >
                  <div className={s.seqBar} />
                  {issued && !current ? (
                    <RetrieveLink href={certPath(x.id)} className={s.seqBody}>
                      {body}
                    </RetrieveLink>
                  ) : (
                    <div
                      className={s.seqBody}
                      aria-current={current ? "page" : undefined}
                    >
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <Link href="/" className={ui.textLink} style={{ alignSelf: "flex-start" }}>
            <ArrowLeft />
            BACK TO INDEX
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function SpecCell({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className={s.spec}>
      <span className={s.specTerm}>{term}</span>
      <span className={s.specValue}>{children}</span>
    </div>
  );
}
