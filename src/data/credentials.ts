/**
 * Single source of truth for all credential content.
 * Issuing a new certificate is a data-only change: set `status: "issued"`
 * and fill in the dates, skills and OpenCerts link.
 */

export type CredentialStatus = "issued" | "pending";

export interface Credential {
  /** Stable URL id, used in /certs/<id>/. Never rename once published. */
  id: string;
  /** Display code, e.g. "M-01" or "AWARD". */
  code: string;
  kind: "module" | "award";
  /** Official NTU title. */
  title: string;
  status: CredentialStatus;
  /** Issue month, "YYYY-MM". */
  issuedOn?: string;
  /** Study period, ISO dates. */
  period?: { start: string; end: string };
  skills?: string[];
  abstract?: string;
  /** Full OpenCerts verification link, including the #key fragment. */
  opencertsUrl?: string;
}

export const programme = {
  name: "Advanced Professional Certificate in AI Engineering",
  issuer: "Nanyang Technological University",
  issuerShort: "NTU",
  holder: "Zhang Xun",
  summary:
    "Building AI-enabled applications end to end through NTU’s AI Engineering programme: from LLM and retrieval pipelines to frontends, secure backends and automated deployment.",
  scope: [
    "GenAI & RAG",
    "AI Agents",
    "Frontend",
    "Backend & APIs",
    "DevSecOps",
    "GenAI Capstone",
  ],
} as const;

export const credentials: Credential[] = [
  {
    id: "m01",
    code: "M-01",
    kind: "module",
    title: "AI and Software Engineering Fundamentals",
    status: "issued",
    issuedOn: "2026-09",
    period: { start: "2026-09-01", end: "2026-09-06" },
    skills: ["LangGraph", "LLM", "Prompt Engineering"],
    abstract:
      "The opening module of NTU’s Advanced Professional Certificate in AI Engineering, laying the groundwork for the five-module programme by pairing core software engineering practice with applied AI. Hands-on work centred on large language models, prompt engineering and building LLM workflows with LangGraph.",
    opencertsUrl:
      "https://www.opencerts.io/?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fgist.githubusercontent.com%2Fzhxunzh84%2F16ca1e665e7bd82a2ffe9b3ec592c3dd%2Fraw%2F89b1f4856d95b39f8a06f3cf12c8f0c3ab6474c6%2Fcertificate-encrypted.opencert%22%7D%7D#%7B%22key%22%3A%2201c3c4488d3d7309a9244e801966fcf71fe70f203a9a0d4f255ecdba8c19458d%22%7D",
  },
  {
    id: "m02",
    code: "M-02",
    kind: "module",
    title: "Frontend Web Development",
    status: "issued",
    issuedOn: "2026-10",
    period: { start: "2026-09-07", end: "2026-10-01" },
    skills: ["React.js", "JavaScript", "REST APIs", "Next.js"],
    opencertsUrl:
      "https://www.opencerts.io/?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fgist.githubusercontent.com%2Fzhxunzh84%2F143a622c86b78781522312f1cba68aa4%2Fraw%2Fc53a5eea8a074bb1e39bdf52b621474eecdbd983%2Fcertificate-encrypted.opencert%22%7D%7D#%7B%22key%22%3A%224db40cbbbadefc4772c2d46348893231f1b2f619198b1c98ac008e60c9595f45%22%7D",
  },
  {
    id: "m03",
    code: "M-03",
    kind: "module",
    title: "Backend Development: Server-Side Programming",
    status: "pending",
  },
  {
    id: "m04",
    code: "M-04",
    kind: "module",
    title: "DevSecOps Essentials & System Monitoring Strategies",
    status: "pending",
  },
  {
    id: "m05",
    code: "M-05",
    kind: "module",
    title: "GenAI Deployment and Capstone",
    status: "pending",
  },
  {
    id: "award",
    code: "AWARD",
    kind: "award",
    title: "Advanced Professional Certificate in AI Engineering",
    status: "pending",
  },
];

export const issuedCredentials = credentials.filter(
  (c) => c.status === "issued",
);
export const pendingCredentials = credentials.filter(
  (c) => c.status === "pending",
);
export const moduleCount = credentials.filter((c) => c.kind === "module").length;

export function getCredential(id: string): Credential | undefined {
  return credentials.find((c) => c.id === id);
}
