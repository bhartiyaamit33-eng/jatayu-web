import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { Button } from "@/components/ui/Button";
import { PatientConsentBlock } from "@/components/blocks/PatientConsentBlock";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "For Doctors",
  description:
    "Hands-free, pocket-friendly VoiceDocAI for Indian clinicians. Multilingual conversations turned into structured English notes you approve.",
  alternates: { canonical: `${siteMeta.domain}/for-doctors` },
};

const benefits = [
  "Speak Hindi, Marathi, English, or any mix. Structured English output for the record.",
  "Hands-free workflows suited to busy OPDs. Pocket-friendly deployments that respect resident hardware.",
  "Templates across common specialties. The CMS-managed list grows with your hospital agreements.",
  "You verify every note before filing. VoiceDocAI assists, you decide.",
];

export default function ForDoctorsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Clinician path"
        title="Stay with patients, not the keyboard"
        conciseAnswer="VoiceDocAI is built for practicing physicians and small clinics that need reliable multilingual capture, fast structured drafts, and a clear approval step before anything is filed. Especially useful when documentation is stealing your evenings."
      />
      <section className="container-page py-[var(--section-y)] space-y-12">
        <ul className="grid gap-6 md:grid-cols-2">
          {benefits.map((text) => (
            <li
              key={text}
              className="rounded-2xl border border-indigo/10 bg-white p-6 text-sm leading-relaxed text-navy/85 shadow-card"
            >
              {text}
            </li>
          ))}
        </ul>

        <PatientConsentBlock />

        <div className="flex flex-wrap gap-4">
          <Button as="link" href="/trial" variant="primary" size="lg">
            Start 7-day trial
          </Button>
          <Button as="link" href="/specialties" variant="secondary" size="lg">
            Browse specialties
          </Button>
        </div>
      </section>
    </>
  );
}
