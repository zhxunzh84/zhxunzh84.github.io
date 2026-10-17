import ui from "./ui.module.css";
import s from "./SiteChrome.module.css";

export function SiteHeader({
  start,
  end,
}: {
  start: React.ReactNode;
  end?: React.ReactNode;
}) {
  return (
    <header className={s.header}>
      <div className={`${ui.wrap} ${s.headerInner}`}>
        {start}
        {end}
      </div>
    </header>
  );
}

/** "ZX / <rest>" mark used in the header of both pages. */
export function Brand({
  initials,
  children,
}: {
  initials: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <span className={s.brandMark}>{initials}</span>
      <span className={s.slash} aria-hidden="true">
        /
      </span>
      {children}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={`${ui.wrap} ${s.footerInner}`}>
        <p>PERSONAL CREDENTIAL PAGE · NOT AN OFFICIAL NTU OR OPENCERTS WEBSITE</p>
        <p>VERIFICATION → OPENCERTS.IO</p>
      </div>
    </footer>
  );
}

export { s as chrome };
