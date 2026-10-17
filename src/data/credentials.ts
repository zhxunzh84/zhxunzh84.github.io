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
  /**
   * Public, privacy-filtered certificate under /public (see
   * `npm run publish-cert`). Verified on OpenCerts via opencertsVerifyUrl().
   */
  document?: string;
}

export const profiles = {
  github: "https://github.com/zhxunzh84",
  /** Optional: remove to hide the header link. */
  linkedin: "https://www.linkedin.com/in/jzhangxun/" as string | undefined,
};

export const programme = {
  name: "Advanced Professional Certificate in AI Engineering",
  issuer: "Nanyang Technological University",
  issuerShort: "NTU",
  holder: "Zhang Xun",
  holderInitials: "ZX",
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
    period: { start: "2026-09-01", end: "2026-09-04" },
    document: "/opencerts/m01.opencert",
    skills: ["LangGraph", "LLM", "Prompt Engineering"],
    abstract:
      "The opening module of NTU’s Advanced Professional Certificate in AI Engineering, laying the groundwork for the five-module programme by pairing core software engineering practice with applied AI. Hands-on work centred on large language models, prompt engineering and building LLM workflows with LangGraph.",
  },
  {
    id: "m02",
    code: "M-02",
    kind: "module",
    title: "Frontend Web Development",
    status: "issued",
    issuedOn: "2026-10",
    period: { start: "2026-09-07", end: "2026-10-01" },
    document: "/opencerts/m02.opencert",
    skills: ["React.js", "JavaScript", "REST APIs", "Next.js"],
    abstract:
      "The second module of NTU’s Advanced Professional Certificate in AI Engineering, focused on building responsive, interactive interfaces with modern frameworks. Hands-on work centred on React.js and JavaScript, consuming REST APIs and building with Next.js.",
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
