import { getPatientConsent } from "@/lib/cms";

export async function PatientConsentBlock() {
  const block = await getPatientConsent();
  const bullets = (block.bullets ?? []) as string[];

  return (
    <section
      className="rounded-2xl border border-indigo/15 bg-pale-blue p-8 shadow-card"
      aria-labelledby="patient-consent-heading"
    >
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo">
        Consent and clinical responsibility
      </p>
      <h2
        id="patient-consent-heading"
        className="mt-2 font-display text-xl font-bold text-navy md:text-2xl"
      >
        {block.title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy/85">{block.body}</p>
      <ul className="mt-5 space-y-2 text-sm text-navy/85">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span
              className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-magenta"
              aria-hidden
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
