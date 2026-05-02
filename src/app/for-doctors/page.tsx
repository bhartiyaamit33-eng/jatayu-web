import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "For Doctors",
  description:
    "Hands-free, pocket-friendly VoiceDocAI for Indian clinicians—multilingual conversations to structured English notes you approve.",
  alternates: { canonical: `${siteMeta.domain}/for-doctors` },
};

export default function ForDoctorsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Clinician path"
        title="Stay with patients—not the keyboard"
        conciseAnswer="VoiceDocAI is built for practicing physicians and small clinics that need reliable multilingual capture, fast structured drafts, and an approval step before anything is filed—ideal when documentation steals evening hours from patient care."
      />
      <section className="container-page py-[var(--section-y)]">
        <ul className="grid gap-6 md:grid-cols-2">
          {[
            "Speak Hindi, Marathi, English, or mixed clinic conversations—structured English output for records.",
            "Hands-free workflows suited to busy OPDs; pocket-friendly deployments that respect resident hardware.",
            "Templates across common specialties—CMS-managed list grows with your hospital agreements.",
            "Verify every note before filing; VoiceDocAI assists, you decide.",
          ].map((text) => (
            <li
              key={text}
              className="rounded-2xl border border-indigo/10 bg-white p-6 text-sm leading-relaxed text-slate shadow-card"
            >
              {text}
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/trial"
            className="rounded-xl bg-grad-accent px-6 py-3 font-display text-sm font-semibold text-white"
          >
            Start 7-day trial
          </Link>
          <Link
            href="/specialties"
            className="rounded-xl border border-indigo/20 px-6 py-3 font-display text-sm font-semibold text-navy"
          >
            Browse specialties
          </Link>
        </div>
      </section>
    </>
  );
}
