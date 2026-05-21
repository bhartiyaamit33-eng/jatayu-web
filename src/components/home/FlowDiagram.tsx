/**
 * Custom 5-step flow diagram for "How VoiceDocAI Works".
 * Inline SVG + Tailwind. No rasterized assets. Calm CSS reveal on scroll into view.
 *
 * Steps follow the brief (§5.7): Conversation → Capture → Structuring → Verification → HMIS.
 */
import { type ReactNode } from "react";

type Step = {
  key: string;
  title: string;
  body: string;
  icon: ReactNode;
};

const STEPS: Step[] = [
  {
    key: "conversation",
    title: "Doctor & patient conversation",
    body: "Hands-free capture during OPDs, ward rounds, and ICU. Multilingual speech, not templated scripts.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 12h13a7 7 0 0 1 7 7v5a7 7 0 0 1-7 7h-5l-7 5v-5h-1a7 7 0 0 1-7-7v-5a7 7 0 0 1 7-7Z" stroke="currentColor" />
        <circle cx="18" cy="22" r="1.4" fill="currentColor" />
        <circle cx="24" cy="22" r="1.4" fill="currentColor" />
        <circle cx="30" cy="22" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "capture",
    title: "AI capture & noise filtering",
    body: "Ambient 70 to 90 dB clinical environments. Background chatter and equipment hum stripped.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="20" y="8" width="8" height="20" rx="4" stroke="currentColor" />
        <path d="M14 22v2a10 10 0 0 0 20 0v-2" stroke="currentColor" />
        <path d="M24 34v6" stroke="currentColor" />
        <path d="M18 40h12" stroke="currentColor" />
      </svg>
    ),
  },
  {
    key: "structure",
    title: "Medical structuring",
    body: "Speech sectioned into history, diagnosis, plan, prescriptions, and codes. Sourced from your template.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 10h18l6 6v22a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2Z" stroke="currentColor" />
        <path d="M30 10v6h6" stroke="currentColor" />
        <path d="M16 22h16M16 28h16M16 34h10" stroke="currentColor" />
      </svg>
    ),
  },
  {
    key: "verification",
    title: "Doctor verification",
    body: "Clinician edits, approves, and signs. Clinical responsibility stays with the treating physician.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M24 8 10 14v9c0 9 5.5 14.4 14 17 8.5-2.6 14-8 14-17v-9L24 8Z" stroke="currentColor" />
        <path d="m18 23 5 5 8-9" stroke="currentColor" />
      </svg>
    ),
  },
  {
    key: "hmis",
    title: "HMIS integration",
    body: "Push to EHR or HMIS via API, on-prem deployment, or paste-ready report. No re-keying.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="6" y="10" width="14" height="10" rx="2" stroke="currentColor" />
        <rect x="28" y="10" width="14" height="10" rx="2" stroke="currentColor" />
        <rect x="17" y="28" width="14" height="10" rx="2" stroke="currentColor" />
        <path d="M13 20v3a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3v-3" stroke="currentColor" />
        <path d="M24 26v2" stroke="currentColor" />
      </svg>
    ),
  },
];

export function FlowDiagram() {
  return (
    <div className="relative">
      {/* Horizontal layout on desktop. Vertical stack on mobile with vertical connector. */}
      <ol className="grid gap-6 md:grid-cols-5 md:gap-3 lg:gap-4">
        {STEPS.map((step, i) => (
          <li key={step.key} className="relative">
            {/* Connector arrow: horizontal between cards on desktop, hidden on the last card */}
            {i < STEPS.length - 1 ? (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -right-3 hidden w-3 items-center justify-center md:flex lg:-right-4 lg:w-4"
              >
                <span className="block h-px w-full bg-gradient-to-r from-indigo/30 to-magenta/30" />
                <svg
                  viewBox="0 0 12 12"
                  className="absolute right-0 h-3 w-3 text-magenta/60"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M2 6h7m-2-3 3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
            ) : null}

            <div className="group relative flex h-full flex-col gap-3 rounded-2xl border border-indigo/10 bg-white p-5 shadow-card transition-transform duration-200 ease-clinical hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-grad-accent text-white">
                  <span className="block h-5 w-5">{step.icon}</span>
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-magenta">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-1 font-display text-base font-bold leading-snug text-navy">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate">{step.body}</p>

              {/* subtle accent stripe at the bottom */}
              <span
                aria-hidden
                className="absolute inset-x-5 bottom-0 h-[2px] origin-left scale-x-0 rounded-full bg-grad-accent opacity-0 transition-all duration-500 ease-clinical group-hover:scale-x-100 group-hover:opacity-100"
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
