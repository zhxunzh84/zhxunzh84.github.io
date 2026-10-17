import {
  credentials,
  issuedCredentials,
  moduleCount,
  pendingCredentials,
  profiles,
  programme,
  type Credential,
} from "@/data/credentials";
import { Brand, SiteFooter, SiteHeader, chrome } from "@/components/SiteChrome";
import { Skills } from "@/components/Skills";
import { ArrowRight } from "@/components/icons";
import { RetrieveLink } from "@/components/SoundLink";
import { Toggles } from "@/components/Toggles";
import { certPath, formatPeriod, pad2 } from "@/lib/format";
import ui from "@/components/ui.module.css";
import s from "./page.module.css";

export default function Home() {
  const total = credentials.length;
  const issued = issuedCredentials.length;

  return (
    <>
      <SiteHeader
        start={
          <a href="#top" className={chrome.brand}>
            <Brand initials={programme.holderInitials}>
              <span>{programme.holder.toUpperCase()}</span>
            </Brand>
          </a>
        }
        controls={<Toggles />}
        end={
          <nav aria-label="Profiles" className={chrome.nav}>
            {profiles.linkedin && (
              <a href={profiles.linkedin} className={chrome.navLink}>
                LINKEDIN
              </a>
            )}
            <a href={profiles.github} className={chrome.navLink}>
              GITHUB
            </a>
          </nav>
        }
      />

      <main id="top" className={`${ui.wrap} ${s.main}`}>
        {/* § 00 — intro and programme facts */}
        <section
          className={`${ui.hairline} anim-draw`}
          aria-labelledby="index-title"
        >
          <div className={s.intro}>
            <p className={ui.label}>§ 00 — INDEX</p>
            <h1 id="index-title" className={s.title}>
              AI Engineering, on record
            </h1>
            <p className={s.summary}>{programme.summary}</p>
            <ul aria-label="Programme scope" className={s.scope}>
              {programme.scope.map((item) => (
                <li key={item}>
                  <span className={ui.plus} aria-hidden="true">
                    +{" "}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <dl className={s.facts}>
            <Fact term="HOLDER">{programme.holder}</Fact>
            <Fact term="PROGRAM">{programme.name}</Fact>
            <Fact term="ISSUER">{programme.issuer}</Fact>
            <Fact term="MODULES">{pad2(moduleCount)} + AWARD</Fact>
            <Fact term="ISSUED">
              <span className={s.accentText}>{pad2(issued)}</span>
            </Fact>
            <Fact term="STATUS">
              {issued === total ? "COMPLETE" : "IN PROGRESS"}
            </Fact>
          </dl>
        </section>

        {/* progress strip */}
        <section className={s.section} aria-labelledby="progress-title">
          <div className={ui.sectionHead}>
            <h2 id="progress-title" className={ui.label}>
              PROGRESS
            </h2>
            <span className={ui.label}>
              <span style={{ color: "var(--text)" }}>{pad2(issued)}</span> /{" "}
              {pad2(total)}
            </span>
          </div>
          <ol className={`${s.progress} anim-draw`} style={{ animationDelay: "150ms" }}>
            {credentials.map((c, i) => {
              const done = c.status === "issued";
              return (
                <li key={c.id} className={`${s.step} ${done ? s.stepDone : ""}`}>
                  <div
                    className={`${s.stepBar} ${done ? "anim-fill" : ""}`}
                    style={done ? { animationDelay: `${650 + i * 120}ms` } : undefined}
                  />
                  <span className={s.stepLabel}>
                    {c.code}
                    <span className={ui.srOnly}>
                      {done ? " issued" : " pending"}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* § 01 — issued credentials, module order */}
        <section className={s.section} aria-labelledby="issued-title">
          <div className={ui.sectionHead}>
            <h2 id="issued-title" className={ui.label}>
              § 01 — ISSUED
            </h2>
            <span className={ui.label}>
              <span style={{ color: "var(--text)" }}>{pad2(issued)}</span> OF{" "}
              {pad2(total)}
            </span>
          </div>
          <div className={`${s.stack} anim-draw`} style={{ animationDelay: "250ms" }}>
            {issuedCredentials.map((c, i) => (
              <IssuedCard key={c.id} credential={c} delay={500 + i * 80} />
            ))}
          </div>
        </section>

        {/* § 02 — upcoming */}
        {pendingCredentials.length > 0 && (
          <section className={s.section} aria-labelledby="upcoming-title">
            <div className={ui.sectionHead}>
              <h2 id="upcoming-title" className={ui.label}>
                § 02 — UPCOMING
              </h2>
              <span className={ui.label}>
                {pad2(pendingCredentials.length)} REMAINING
              </span>
            </div>
            <ol className={`${s.rows} anim-draw`} style={{ animationDelay: "400ms" }}>
              {pendingCredentials.map((c, i) => (
                <li
                  key={c.id}
                  className={`${s.row} ${
                    c.kind === "award" ? `${s.rowAward} hover-scan` : "hover-hatch"
                  } anim-rise`}
                  style={{ animationDelay: `${650 + i * 50}ms` }}
                >
                  <span className={s.rowCode}>{c.code}</span>
                  <span className={s.rowTitle}>{c.title}</span>
                  <span className={s.rowStatus}>PENDING</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className={s.fact}>
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function IssuedCard({
  credential: c,
  delay,
}: {
  credential: Credential;
  delay: number;
}) {
  const period = formatPeriod(c.period);
  return (
    <article
      className={`${s.card} glow-card anim-rise`}
      style={{ animationDelay: `${delay}ms` }}
      aria-labelledby={`card-${c.id}`}
    >
      <div className="glow" aria-hidden="true">
        <div className="glow-ring" />
      </div>
      <div className={s.cardBody}>
        <div className={s.cardTop}>
          <span>{c.code}</span>
          <span className={`${ui.chip} ${ui.chipOn}`}>ISSUED</span>
        </div>
        <h3 id={`card-${c.id}`} className={s.cardTitle}>
          {c.title}
        </h3>
        <dl className={s.meta}>
          {c.issuedOn && <MetaRow term="DATE">{c.issuedOn}</MetaRow>}
          {period && <MetaRow term="PERIOD">{period}</MetaRow>}
          <MetaRow term="ISSUER">{programme.issuer}</MetaRow>
          {c.skills && c.skills.length > 0 && (
            <MetaRow term="SKILLS">
              <Skills skills={c.skills} />
            </MetaRow>
          )}
        </dl>
      </div>
      <div className={s.cardAction}>
        <RetrieveLink
          href={certPath(c.id)}
          className={`${ui.textLink} ${s.actionLink} nudge`}
        >
          OPEN RECORD
          <span className={ui.srOnly}> for {c.title}</span>
          <ArrowRight />
        </RetrieveLink>
        <span className={s.hint}>VERIFIABLE ON OPENCERTS</span>
      </div>
    </article>
  );
}

function MetaRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className={s.metaRow}>
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}
