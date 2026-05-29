import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/pages/PageIntro";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Careers at Jatayu Healthcare Technologies. Hiring updates for the VoiceDocAI team.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteMeta.domain}/careers` },
};

/**
 * /careers — Holding page until live ATS feed lands.
 *
 * Until openings publish from the CMS, the page surfaces what we look for
 * (so candidates self-screen) and where to send applications. Keeps the
 * page from feeling abandoned on the new wider layout.
 */
const valueCards = [
  {
    title: "Clinical seriousness",
    body: "We optimise for clinician verification, not autopilot. Every feature is tested with the doctor in the loop.",
  },
  {
    title: "Real-world engineering",
    body: "Noise profiles, accents, multilingual capture, and field-realistic hardware constraints are first-class concerns.",
  },
  {
    title: "Quiet rigour",
    body: "Procurement-grade documentation, signed claims, and audit-friendly defaults. We do not over-promise.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageIntro
        eyebrow="Careers"
        title="Build clinical-grade voice AI with us"
        conciseAnswer="Publish open roles from CMS — each listing should include mission alignment, location flexibility, and compliance expectations for handling sensitive healthcare workloads."
      />

      <section className="container-page pb-[var(--section-y)] space-y-12">
        {/* What we look for — 3-col card grid */}
        <div>
          <h2 className="font-display text-2xl font-bold text-navy md:text-3xl">
            What we look for
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate">
            Open roles are managed in the CMS and will appear here once published.
            Until then, here is the shape of the team we are building.
          </p>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {valueCards.map((v) => (
              <li
                key={v.title}
                className="rounded-2xl border border-indigo/10 bg-white p-6 shadow-card"
              >
                <h3 className="font-display text-lg font-bold text-navy">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Where to send applications */}
        <div className="grid items-center gap-8 rounded-2xl border border-indigo/10 bg-pale-blue p-8 shadow-card lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12 lg:p-10">
          <div>
            <h2 className="font-display text-xl font-bold text-navy md:text-2xl">
              No live openings mirrored yet
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-navy/85">
              Sync ATS or Notion embed via CMS block to publish roles directly here.
              In the meantime, send a short note about how you would help and where
              you sit on the clinical-engineering spectrum.
            </p>
          </div>
          <div className="lg:text-right">
            <Link
              href={`mailto:${siteMeta.founderEmail}`}
              className="inline-flex rounded-xl bg-grad-accent px-6 py-3 font-display text-sm font-semibold text-white"
            >
              Write to the founder office
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
