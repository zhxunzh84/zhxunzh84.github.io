import { credentials, programme } from "@/data/credentials";

// Placeholder home page for the scaffold PR. The full design lands in the
// next PR; this page only proves the data model and the deploy pipeline.
export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 16px" }}>
      <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-4)" }}>
        ZX / ZHANG XUN
      </p>
      <h1 style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}>
        AI Engineering, on record
      </h1>
      <p style={{ color: "var(--text-3)" }}>{programme.name}</p>
      <ul style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>
        {credentials.map((c) => (
          <li key={c.id}>
            {c.code} · {c.title} · {c.status.toUpperCase()}
          </li>
        ))}
      </ul>
    </main>
  );
}
