#!/usr/bin/env node
/**
 * Make a certificate safe to host publicly.
 *
 *   npm run publish-cert -- <downloaded.opencert> <id>
 *
 * Removes PRIVATE_FIELDS (NRIC, email, ID type), checks the signature still
 * verifies, and writes public/opencerts/<id>.opencert. The original file is
 * never copied into the repository.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { PRIVATE_FIELDS, auditDocument, oa } from "./opencert-lib.mjs";

const [input, id] = process.argv.slice(2);
if (!input || !/^[a-z0-9-]+$/.test(id ?? "")) {
  console.error("usage: npm run publish-cert -- <file.opencert> <id, e.g. m03>");
  process.exit(1);
}

const doc = JSON.parse(await readFile(input, "utf8"));
if (!oa.verifySignature(doc)) {
  console.error("The input certificate's signature does not verify.");
  process.exit(1);
}

const present = PRIVATE_FIELDS.filter((f) => {
  const [obj, key] = f.split(".");
  return key in (oa.getData(doc)?.[obj] ?? {});
});
const out = present.length ? oa.obfuscate(doc, present) : doc;

const problems = auditDocument(out);
if (problems.length) {
  console.error(`Refusing to publish: ${problems.join("; ")}`);
  process.exit(1);
}

const dest = path.join("public", "opencerts", `${id}.opencert`);
await mkdir(path.dirname(dest), { recursive: true });
await writeFile(dest, JSON.stringify(out));
console.log(`Wrote ${dest} (obfuscated: ${present.join(", ") || "nothing"})`);
console.log(`Set document: "/opencerts/${id}.opencert" in src/data/credentials.ts`);
