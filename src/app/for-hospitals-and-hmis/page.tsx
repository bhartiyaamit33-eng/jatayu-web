import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "For Hospitals & HMIS",
  description:
    "Integration models, latency SLAs, audit logs, data residency, and on-prem options for EMR/EHR/HMIS partners evaluating VoiceDocAI.",
  alternates: { canonical: `${siteMeta.domain}/for-hospitals-and-hmis` },
};

export default function ForHospitalsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Hospital IT & HMIS partners"
        title="One clinical voice layer across your stack"
        conciseAnswer="VoiceDocAI helps EMR, EHR, and HMIS vendors embed multilingual speech-to-note capabilities with governance-friendly audit trails, deployment flexibility—including API and on-prem—and documentation tuned for procurement reviewers."
      />
      <section className="container-page py-[var(--section-y)]">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-indigo/10 bg-white p-8 shadow-card">
            <h2 className="font-display text-xl font-bold text-navy">
              Integration story
            </h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-slate">
              <li>Authenticated ingest of encounter audio or partner-provided streams.</li>
              <li>
                Structured JSON + rendered clinical narrative aligned to templates.
              </li>
              <li>
                Clinician review events recorded for audit; exported via API or secure file patterns.
              </li>
              <li>Optional on-prem footprint—confirm reference architecture with engineering.</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-indigo/10 bg-navy p-8 text-white shadow-card">
            <h2 className="font-display text-xl font-bold">Procurement pack</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Send hospitals directly to the Security & Compliance page for HIPAA-aligned language,
              DPDP Act 2023 posture, ISO 27001 status, encryption, residency, and audit-log commitments—after founder and counsel sign every claim.
            </p>
            <Link
              href="/security"
              className="mt-6 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-navy"
            >
              Open Security & Compliance
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="rounded-xl bg-grad-accent px-6 py-3 font-display text-sm font-semibold text-white"
          >
            Book integration workshop
          </Link>
          <Link
            href="/case-studies"
            className="rounded-xl border border-indigo/20 px-6 py-3 font-display text-sm font-semibold text-navy"
          >
            Read case studies
          </Link>
        </div>
      </section>
    </>
  );
}
