import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/pages/PageIntro";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Contact / Book a conversation",
  description:
    "Reach Jatayu Healthcare for VoiceDocAI pilots, HMIS integrations, or procurement workshops. No third-party schedulers required.",
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

      <section className="container-page pb-[var(--section-y)]">
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
                  Phone (founder deck)
                </p>
                <a
                  className="mt-1 inline-flex font-semibold text-navy hover:text-indigo"
                  href="tel:+917506060955"
                >
                  +91 75060 60955
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
                  Briefing on hospital context, EMR stack, compliance posture, and pilot timeline.
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
      </section>
    </>
  );
}
