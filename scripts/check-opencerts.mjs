#!/usr/bin/env node
/**
 * CI guard: every certificate under public/opencerts/ must still verify and
 * must not expose NRIC or email. Fails the build otherwise.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { auditDocument } from "./opencert-lib.mjs";

const dir = path.join("public", "opencerts");
const files = (await readdir(dir)).filter((f) => f.endsWith(".opencert"));
let failed = false;

for (const file of files) {
  const doc = JSON.parse(await readFile(path.join(dir, file), "utf8"));
  const problems = auditDocument(doc);
  console.log(`${problems.length ? "FAIL" : "ok  "} ${file}${problems.length ? ` — ${problems.join("; ")}` : ""}`);
  if (problems.length) failed = true;
}

if (files.length === 0) console.log("no certificates found");
process.exit(failed ? 1 : 0);
