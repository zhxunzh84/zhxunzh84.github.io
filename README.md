# zhxunzh84.github.io

Personal credentials site for **Zhang Xun** — verifiable certificates from NTU's
*Advanced Professional Certificate in AI Engineering*, each linked to its
[OpenCerts](https://www.opencerts.io/) verification.

Live: https://zhxunzh84.github.io/

## Stack

- [Next.js](https://nextjs.org/) (App Router) with static export (`output: "export"`)
- TypeScript
- Geist / Geist Mono fonts, self-hosted via the `geist` package
- GitHub Actions → GitHub Pages

No server, no database: all content lives in [`src/data/credentials.ts`](src/data/credentials.ts).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # static site in ./out
npm run preview    # serve ./out locally, as GitHub Pages would
```

`next start` is not available: with `output: "export"` there is no Next.js
server, only static files. Use `npm run preview` after a build instead.

## Adding a certificate

Edit `src/data/credentials.ts`: set the credential's `status` to `"issued"` and
fill in `issuedOn`, `period`, `skills` and `opencertsUrl`. Open a pull request;
merging to `main` deploys automatically.

## Docs

- [Specification and acceptance checklist](docs/SPEC.md)

This is a personal page, not an official NTU or OpenCerts website.
