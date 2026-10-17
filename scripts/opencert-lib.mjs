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
const NRIC = /\b[STFGM]\d{7}[A-Z]\b/;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/;

/** Problems that make a document unsafe or invalid to publish. */
export function auditDocument(doc) {
  const problems = [];
  if (!oa.verifySignature(doc)) problems.push("signature does not verify");
  const data = oa.getData(doc);
  for (const field of PRIVATE_FIELDS) {
    const [obj, key] = field.split(".");
    if (data?.[obj] && key in data[obj]) problems.push(`${field} is not obfuscated`);
  }
  const text = JSON.stringify(data);
  if (NRIC.test(text)) problems.push("contains an NRIC-like value");
  if (EMAIL.test(text)) problems.push("contains an email-like value");
  return problems;
}
