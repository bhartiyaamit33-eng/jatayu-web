import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
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

const pillars = [
  {
    title: "HIPAA-aligned, by design",
    body: "We say HIPAA-aligned, not HIPAA-certified, because there is no HIPAA certification body. Our controls map to the HIPAA Security Rule and we sign equivalent business associate agreements where US law applies.",
  },
  {
    title: "DPDP Act 2023 ready, regional residency available",
    body: "Default processing posture reflects DPDP Act 2023 obligations and our role as a processor on behalf of the customer. Customers in the Middle East, Europe, and other markets can request region-specific residency as part of onboarding.",
  },
  {
    title: "ISO 27001 in progress",
    body: "Certification is underway. We will publish the date and certificate number on this page when issued. No aspirational marketing in the meantime.",
  },
  {
    title: "Encryption and residency",
    body: "TLS 1.2 and above in transit. AES-256 at rest. Regional data residency available per customer. Customers on on-prem deployments retain full custody.",
  },
  {
    title: "Audit logs and RBAC",
    body: "Every encounter, edit, approval, and export is logged with user, timestamp, and reason. Hospital admins manage roles and access.",
  },
  {
    title: "Patient consent for ambient capture",
    body: "Capture begins only after the clinician confirms the patient has agreed. The capture indicator stays visible. Consent state is stored alongside the encounter for audit.",
  },
];

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
        title="Security and compliance, written for procurement"
        conciseAnswer="VoiceDocAI is HIPAA-aligned, DPDP Act 2023 ready in our home market, with regional data residency controls available, AES-256 at rest, TLS 1.2 plus in transit, encounter-level audit logs, and on-premise deployment options. Detailed posture and the latest signed statements live on this page."
      />
      <section className="container-page py-[var(--section-y)] space-y-12">
        {/* Six pillar cards — 3 across on lg+ uses the wider container cleanly */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <article
              key={p.title}
              className="rounded-2xl border border-indigo/15 bg-white p-6 shadow-card"
            >
              <h2 className="font-display text-lg font-bold text-navy">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-navy/85">{p.body}</p>
            </article>
          ))}
        </div>

        {/* "CISO one-pager" — magazine layout: pitch on the left, actions on the right */}
        <div className="grid items-center gap-8 rounded-2xl border border-indigo/15 bg-pale-blue p-8 shadow-card lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12 lg:p-10">
          <div>
            <h2 className="font-display text-xl font-bold text-navy md:text-2xl">
              Need a one-pager for your CISO?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-navy/85">
              We can send you a single-page PDF summary suitable for procurement
              forwarding. The page itself is also designed to print cleanly. Use the
              button below or email us and we will reply with the latest signed copy.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <PrintButton />
            <Button as="link" href="/contact" variant="primary" size="md">
              Email me the PDF
            </Button>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-navy">FAQ</h2>
          <div className="mt-4 divide-y divide-indigo/10 rounded-2xl border border-indigo/10 bg-white">
            {securityFaqs.map((f) => (
              <details key={f.question} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-display text-base font-semibold text-navy [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.question}
                    <span className="text-magenta transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-navy/85">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate">
          Statements on this page reflect current scope. Anything that changes after a
          counsel review will be re-published with a date stamp.{" "}
          <Link href="/contact" className="font-semibold text-indigo hover:underline">
            Reach the team
          </Link>{" "}
          for signed addenda.
        </p>
      </section>
    </>
  );
}
