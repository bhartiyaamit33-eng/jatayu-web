import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { TrialSignupForm } from "@/components/trial/TrialSignupForm";
import { getSiteMeta, getTrialEmails } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const siteMeta = await getSiteMeta();
  return {
    title: "Start your 7-day trial",
    description:
      "Request VoiceDocAI trial access. We capture your details, notify our team, and follow up within one business day.",
    alternates: { canonical: `${siteMeta.domain}/trial` },
  };
}

export default async function TrialPage() {
  const [siteMeta, trialEmails] = await Promise.all([
    getSiteMeta(),
    getTrialEmails(),
  ]);

  return (
    <>
      <PageIntro
        eyebrow="Trial"
        title="Try VoiceDocAI for 7 days"
        conciseAnswer="We capture your details, notify a real person on our team, and follow up within one business day. Your account is paused, not deleted, when the trial ends."
      />
      <section className="container-page pb-[var(--section-y)] grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <TrialSignupForm />
        </div>
        <aside className="rounded-2xl border border-indigo/10 bg-canvas p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-navy">
            What happens after you submit
          </h2>
          <ol className="mt-5 space-y-4">
            {trialEmails.map((email, i) => (
              <li key={email.id} className="flex gap-3">
                <span
                  className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-grad-accent text-[11px] font-bold text-white"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">
                    Day {email.sendOnDay}: {email.subject.replace("{{firstName}}", "you")}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate">{email.preheader}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-slate">
            Sales team is notified at {siteMeta.salesEmail} the moment you submit.
            Manage all signups in{" "}
            <a href="/admin" className="font-semibold text-indigo hover:underline">
              /admin
            </a>
            .
          </p>
        </aside>
      </section>
    </>
  );
}
