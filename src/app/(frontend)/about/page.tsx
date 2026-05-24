import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/pages/PageIntro";
import { Logo } from "@/components/brand/Logo";
import { founderNote, siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jatayu Healthcare Technologies. VoiceDocAI founders, IIT Bombay incubation story, and vision for Indian clinical documentation.",
  alternates: { canonical: `${siteMeta.domain}/about` },
};

/**
 * /about — Leadership snapshot + founder quote sidebar.
 *
 * The body uses a two-column grid (leadership left, founder quote sidebar
 * right) so the page reads well on wide screens without a giant empty band
 * down the right side.
 */
export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="Our story"
        title="Built where rigorous medicine meets Indian engineering"
        conciseAnswer="Jatayu Healthcare Technologies is an IIT Bombay incubated voice-first medical AI company co-founded by Dr. Aparna Oruganty Das (Director and CEO) and Sridhar Murthy, focused on reducing documentation drag without compromising clinician accountability."
      />

      <section className="container-page py-[var(--section-y)]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
          {/* LEFT — leadership + narrative */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-indigo/10 bg-white p-8 shadow-card">
              <div className="mb-6 flex items-center gap-4">
                <Logo size={64} decorative />
                <div>
                  <p className="font-display text-sm font-semibold text-indigo">
                    {siteMeta.legalName}
                  </p>
                  <p className="text-xs text-slate">
                    Voice-first medical AI built in India
                  </p>
                </div>
              </div>

              <h2 className="font-display text-2xl font-bold text-navy">
                Leadership snapshot
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate">
                <strong>{founderNote.name}</strong> — {founderNote.role}.{" "}
                <strong>Sridhar Murthy</strong> — Co-founder (refresh titles and bios from CMS).
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate">
                VoiceDocAI emerged from repeated observations in Indian public and
                private hospitals: extraordinary clinical throughput constrained by
                documentation latency and brittle digitisation pathways.
              </p>
            </div>

            <Link
              href="/about/facts"
              className="inline-flex text-sm font-semibold text-magenta hover:underline"
            >
              View sourced facts for GEO →
            </Link>
          </div>

          {/* RIGHT — founder quote sidebar */}
          <aside className="rounded-2xl border border-indigo/15 bg-pale-blue p-8 shadow-card lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              From the founder
            </p>
            <blockquote className="mt-4 font-display text-xl leading-snug text-navy">
              &ldquo;{founderNote.quote}&rdquo;
            </blockquote>
            <p className="mt-6 text-sm font-semibold text-navy">{founderNote.name}</p>
            <p className="text-xs text-slate">{founderNote.role}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
