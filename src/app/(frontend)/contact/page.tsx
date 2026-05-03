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

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Talk to us"
        title="Book a 20-minute walkthrough or bring your IT team"
        conciseAnswer="Share hospital context, EMR stack, compliance questions, and timeline. We respond from verified company inboxes and can coordinate self-hosted Cal.com once deployed."
      />
      <section className="container-page pb-[var(--section-y)] space-y-8">
        <div className="rounded-2xl border border-indigo/10 bg-white p-8 shadow-card">
          <h2 className="font-display text-xl font-bold text-navy">Direct lines</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate">
            <li>
              Sales:{" "}
              <a className="font-semibold text-indigo" href={`mailto:${siteMeta.salesEmail}`}>
                {siteMeta.salesEmail}
              </a>
            </li>
            <li>
              Founder office:{" "}
              <a
                className="font-semibold text-indigo"
                href={`mailto:${siteMeta.founderEmail}`}
              >
                {siteMeta.founderEmail}
              </a>
            </li>
            <li>
              Phone (founder deck):{" "}
              <a className="font-semibold text-indigo" href="tel:+917506060955">
                +91 75060 60955
              </a>
            </li>
          </ul>
        </div>
        <p className="text-sm text-slate">
          Scheduling widget placeholder-self-host{" "}
          <Link href="https://cal.com" className="font-semibold text-indigo">
            Cal.com
          </Link>{" "}
          on Cloud Run per stack guidance; avoid embedding SaaS calendars here.
        </p>
      </section>
    </>
  );
}
