// Shared helpers for the OpenCerts scripts.
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
/** @type {typeof import("@govtechsg/open-attestation")} */
export const oa = require("@govtechsg/open-attestation");

/**
 * Fields removed (replaced by their hashes) before a certificate is published.
 * OpenAttestation keeps the signature valid: the hash of each removed field is
 * listed under `privacy.obfuscatedData`, so the document still hashes to the
 * same targetHash.
 */
export const PRIVATE_FIELDS = [
  "recipient.nric",
  "recipient.email",
  "recipient.idType",
];

// Singapore NRIC/FIN shape, and anything that looks like an email address.
// No word boundaries: an identifier glued to other text ("ID:S1234567D")
// must still be caught. False positives only block a publish, which is the
// safe direction.
const NRIC = /[STFGM]\d{7}[A-Z]/;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/;

/** Every string value and object key in a decoded document, recursively. */
function* strings(value) {
  if (typeof value === "string") {
    yield value;
  } else if (Array.isArray(value)) {
    for (const v of value) yield* strings(v);
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      yield k;
      yield* strings(v);
    }
  }
}

/** Problems that make a document unsafe or invalid to publish. */
export function auditDocument(doc) {
  const problems = [];
  if (!oa.verifySignature(doc)) problems.push("signature does not verify");
  const data = oa.getData(doc);
  for (const field of PRIVATE_FIELDS) {
    const [obj, key] = field.split(".");
    if (data?.[obj] && key in data[obj]) problems.push(`${field} is not obfuscated`);
  }
  // Scan decoded strings, not JSON text: serialisation escapes newlines and
  // tabs as "\\n"/"\\t", which would hide an identifier that follows them.
  for (const str of strings(data)) {
    if (NRIC.test(str)) problems.push(`contains an NRIC-like value: ${mask(str)}`);
    if (EMAIL.test(str)) problems.push(`contains an email-like value: ${mask(str)}`);
  }
  return problems;
}

/** Show where a hit is without printing the identifier itself into CI logs. */
function mask(str) {
  return JSON.stringify(
    str
      .replace(new RegExp(NRIC.source, "g"), "[NRIC]")
      .replace(new RegExp(EMAIL.source, "g"), "[EMAIL]")
      .slice(0, 60),
  );
}
