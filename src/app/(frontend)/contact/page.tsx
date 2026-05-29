import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/pages/PageIntro";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Contact / Book a conversation",
  description:
    "Reach Jatayu Healthcare for VoiceDocAI deployments, integrations, or procurement workshops. No third-party schedulers required.",
  alternates: { canonical: `${siteMeta.domain}/contact` },
};

/**
 * /contact — Direct lines + scheduling info.
 *
 * Two-column body: contact details on the left, what-to-expect/scheduling
 * placeholder on the right. Fills the wider canvas instead of leaving a tall
 * empty stripe to the right of a single column.
 */
export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Talk to us"
        title="Book a 20-minute walkthrough or bring your IT team"
        conciseAnswer="Share hospital context, EMR stack, compliance questions, and timeline. We respond from verified company inboxes and can coordinate self-hosted Cal.com once deployed."
      />

      <section className="container-page pb-[var(--section-y)] space-y-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT — direct lines */}
          <div className="rounded-2xl border border-indigo/10 bg-white p-8 shadow-card">
            <h2 className="font-display text-xl font-bold text-navy">Direct lines</h2>
            <ul className="mt-6 space-y-5 text-sm text-slate">
              <li>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo">
                  Sales
                </p>
                <a
                  className="mt-1 inline-flex font-semibold text-navy hover:text-indigo"
                  href={`mailto:${siteMeta.salesEmail}`}
                >
                  {siteMeta.salesEmail}
                </a>
              </li>
              <li>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo">
                  Founder office
                </p>
                <a
                  className="mt-1 inline-flex font-semibold text-navy hover:text-indigo"
                  href={`mailto:${siteMeta.founderEmail}`}
                >
                  {siteMeta.founderEmail}
                </a>
              </li>
              <li>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo">
                  Phone
                </p>
                <a
                  className="mt-1 inline-flex font-semibold text-navy hover:text-indigo"
                  href={`tel:${siteMeta.phone.replace(/\s/g, "")}`}
                >
                  {siteMeta.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* RIGHT — what to expect + scheduling placeholder */}
          <div className="rounded-2xl border border-indigo/10 bg-pale-blue p-8 shadow-card">
            <h2 className="font-display text-xl font-bold text-navy">What to expect</h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-navy/85">
              <li className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-magenta"
                  aria-hidden
                />
                <span>
                  Reply within one business day from a verified company inbox.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-magenta"
                  aria-hidden
                />
                <span>
                  Briefing on environment, integration stack, compliance posture, and rollout timeline.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-magenta"
                  aria-hidden
                />
                <span>
                  Optional follow-up workshop with our engineering team for integration questions.
                </span>
              </li>
            </ul>
            <p className="mt-8 text-xs text-slate">
              Scheduling widget placeholder — self-host{" "}
              <Link
                href="https://cal.com"
                className="font-semibold text-indigo hover:underline"
              >
                Cal.com
              </Link>{" "}
              on Cloud Run per stack guidance; avoid embedding SaaS calendars here.
            </p>
          </div>
        </div>

        {/* Our locations — one card per office */}
        <div>
          <h2 className="font-display text-2xl font-bold text-navy md:text-3xl">
            Our locations
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate">
            Walk-ins by appointment only. Reach out via the lines above and we will
            confirm the right office for your meeting.
          </p>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {siteMeta.offices.map((office) => (
              <li
                key={office.city}
                className="rounded-2xl border border-indigo/10 bg-white p-6 shadow-card"
              >
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo">
                  {office.label}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-navy">
                  {office.city}
                </h3>
                <address className="mt-3 not-italic text-sm leading-relaxed text-slate">
                  {office.lines.map((line, idx) => (
                    <span key={idx} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
