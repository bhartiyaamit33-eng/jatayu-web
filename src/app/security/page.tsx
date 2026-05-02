import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { JsonLd } from "@/components/seo/JsonLd";
import { PrintButton } from "@/components/ui/PrintButton";
import { homeFaqs, siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Security & Compliance",
  description:
    "HIPAA-aligned posture, DPDP Act 2023 readiness, ISO 27001 status, encryption, residency, audit logs, and on-prem deployment options for VoiceDocAI.",
  alternates: { canonical: `${siteMeta.domain}/security` },
};

const securityFaqs = homeFaqs.filter((f) =>
  ["Is audio stored?", "Can hospitals integrate via API?"].includes(f.question),
);

export default function SecurityPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: securityFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <PageIntro
        eyebrow="Trust center"
        title="Security language legal reviews before publish"
        conciseAnswer="This page must reflect counsel-approved statements only: differentiate HIPAA-aligned versus HIPAA-certified claims, disclose ISO 27001 progress accurately, specify Indian data residency and retention, and document encryption plus RBAC for hospital admins."
      />
      <section className="container-page py-[var(--section-y)] space-y-8">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-950">
          Placeholder checklist — replace with signed copy: HIPAA stance, DPDP Act 2023 compliance statement, ISO 27001 status, audio retention, TLS 1.2+, AES-256 at rest, key management, patient consent for ambient capture, on-prem reference customer.
        </div>
        <div className="rounded-2xl border border-indigo/10 bg-white p-8 shadow-card">
          <h2 className="font-display text-xl font-bold text-navy">
            Printable summary
          </h2>
          <p className="mt-4 text-sm text-slate">
            Generate a single-page PDF via headless Chromium in CI or expose a print stylesheet (`@media print`) so procurement teams can archive the exact wording shared during diligence.
          </p>
          <div className="mt-6">
            <PrintButton />
          </div>
        </div>
        <Link href="/contact" className="inline-flex text-sm font-semibold text-magenta">
          Invite security reviewers →
        </Link>
      </section>
    </>
  );
}
