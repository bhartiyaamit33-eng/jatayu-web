import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { TrialSignupForm } from "@/components/trial/TrialSignupForm";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Start your 7-day trial",
  description:
    "Request VoiceDocAI trial access—capture leads into Postgres, provision credentials, and automate onboarding email once backend services are connected.",
  alternates: { canonical: `${siteMeta.domain}/trial` },
};

export default function TrialPage() {
  return (
    <>
      <PageIntro
        eyebrow="Trial"
        title="7-day VoiceDocAI evaluation"
        conciseAnswer="Collect structured lead data here; founder confirmation still needs what the trial unlocks—web login, desktop installer, or expiring license keys—before marketing promises go live."
      />
      <section className="container-page pb-[var(--section-y)]">
        <TrialSignupForm />
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-slate">
          Backend checklist: persist leads with{" "}
          <span className="font-mono">trial_ends_at</span>, trigger Gmail SMTP via
          Workspace, notify {siteMeta.salesEmail}, schedule Cloud Scheduler cron for
          credential revocation—no third-party SaaS required.
        </p>
      </section>
    </>
  );
}
