import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { founderNote, siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jatayu Healthcare Technologies—VoiceDocAI founders, IIT Bombay incubation story, and vision for Indian clinical documentation.",
  alternates: { canonical: `${siteMeta.domain}/about` },
};

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="Our story"
        title="Built where rigorous medicine meets Indian engineering"
        conciseAnswer="Jatayu Healthcare Technologies is IIT Bombay–linked voice-first medical AI company co-founded by Dr. Aparna Oruganty Das (Director & CEO) and Sridhar Murthy, focused on reducing documentation drag without compromising clinician accountability."
      />
      <section className="container-page py-[var(--section-y)] space-y-10">
        <div className="rounded-2xl border border-indigo/10 bg-white p-8 shadow-card">
          <h2 className="font-display text-2xl font-bold text-navy">
            Leadership snapshot
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate">
            <strong>{founderNote.name}</strong> — {founderNote.role}.{" "}
            <strong>Sridhar Murthy</strong> — Co-founder (refresh titles and bios from CMS).
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate">
            VoiceDocAI emerged from repeated observations in Indian public and private
            hospitals: extraordinary clinical throughput constrained by documentation
            latency and brittle digitisation pathways.
          </p>
        </div>
        <Link href="/about/facts" className="inline-flex text-sm font-semibold text-magenta">
          View sourced facts for GEO →
        </Link>
      </section>
    </>
  );
}
