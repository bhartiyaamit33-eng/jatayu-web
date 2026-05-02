import Link from "next/link";
import {
  awards,
  caseStudySpotlight,
  complianceBand,
  deploymentModes,
  founderNote,
  homeConciseAnswer,
  homeFaqs,
  homeHero,
  homeMetrics,
  howItWorksSteps,
  logoWall,
  siteMeta,
  specialtiesFeatured,
  testimonials,
} from "@/content/site-config";
import { HeroVisual } from "@/components/home/HeroVisual";
import { JsonLd } from "@/components/seo/JsonLd";

const heroVideoSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;

export function HomeSections() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteMeta.productName,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web, Desktop, Mobile",
    description: siteMeta.defaultDescription,
    publisher: {
      "@type": "Organization",
      name: siteMeta.legalName,
      url: siteMeta.domain,
    },
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <JsonLd data={softwareLd} />

      <section className="relative overflow-hidden border-b border-indigo/10 bg-grad-hero pb-16 pt-28 md:pb-24 md:pt-32">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(52,86,164,0.12)_0%,transparent_70%)] motion-reduce:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(124,68,129,0.1)_0%,transparent_70%)] motion-reduce:hidden"
          aria-hidden
        />

        <div className="container-page flex flex-col items-center text-center">
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo/15 bg-white px-4 py-1.5 text-xs font-medium text-navy shadow-sm">
            <span
              className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#4ade80] motion-reduce:animate-none"
              aria-hidden
            />
            {homeHero.badge}
          </p>

          <h1 className="max-w-[820px] font-display text-4xl font-extrabold tracking-tight text-navy md:text-5xl lg:text-[2.65rem] xl:text-[4.2rem] text-balance">
            {(() => {
              const parts = homeHero.headline.split(". ");
              if (parts.length < 2) {
                return homeHero.headline;
              }
              const [first, ...rest] = parts;
              return (
                <>
                  {first}.
                  <br />
                  <span className="bg-grad-accent bg-clip-text text-transparent">
                    {rest.join(". ").trim()}
                  </span>
                </>
              );
            })()}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
            {homeHero.subheadline}
          </p>

          <p className="mt-6 max-w-2xl rounded-xl border border-indigo/10 bg-white/70 px-4 py-3 text-left text-sm leading-relaxed text-navy md:text-center">
            <span className="font-semibold text-indigo">In one minute:</span>{" "}
            {homeConciseAnswer}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3.5">
            <Link
              href={homeHero.primaryCta.href}
              className="rounded-xl bg-grad-accent px-8 py-3.5 font-display text-base font-semibold text-white shadow-[0_8px_32px_rgba(155,47,145,0.4)] transition-transform duration-200 ease-clinical hover:-translate-y-0.5"
            >
              {homeHero.primaryCta.label}
            </Link>
            <Link
              href={homeHero.secondaryCta.href}
              className="rounded-xl border border-indigo/20 bg-white px-8 py-3.5 font-display text-base font-medium text-navy shadow-sm transition-colors hover:border-indigo hover:text-indigo"
            >
              {homeHero.secondaryCta.label}
            </Link>
          </div>

          <p className="mt-8 max-w-lg text-sm font-medium text-slate">
            {homeHero.trustLine}
          </p>

          <figure className="mt-10 w-full max-w-[900px] overflow-hidden rounded-2xl border border-indigo/10 bg-navy/95 shadow-elevated">
            {heroVideoSrc ? (
              <video
                className="aspect-video w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster=""
                aria-label="VoiceDocAI product overview film"
              >
                <source src={heroVideoSrc} type="video/mp4" />
              </video>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 px-6 text-center">
                <p className="font-display text-sm font-semibold text-white">
                  Hero motion / demo film (CMS)
                </p>
                <p className="max-w-md text-xs leading-relaxed text-white/65">
                  Drop in trimmed cuts of{" "}
                  <span className="font-mono text-white/90">
                    Voicedocai-Demo-full.mp4
                  </span>{" "}
                  via CDN URL — muted by default, no in-browser microphone capture.
                </p>
              </div>
            )}
          </figure>

          <HeroVisual />
        </div>
      </section>

      <section className="border-y border-[#eaecf5] bg-white py-10" aria-labelledby="audience-split-heading">
        <div className="container-page">
          <h2 id="audience-split-heading" className="sr-only">
            Choose your path
          </h2>
          <div className="grid gap-7 md:grid-cols-2">
            <Link
              href="/for-doctors"
              className="group rounded-[20px] bg-gradient-to-br from-[#0e1e3d] to-[#1a2d68] p-9 text-white shadow-card transition-transform duration-200 ease-clinical hover:-translate-y-1"
            >
              <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-white/15 text-xl" aria-hidden>
                👨‍⚕️
              </div>
              <h3 className="font-display text-2xl font-extrabold tracking-tight">
                I am a doctor
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Time saved per day, multilingual clinics, pocket-friendly workflows.
              </p>
              <span className="mt-6 inline-block rounded-lg border border-white/25 bg-white/15 px-[22px] py-2.5 text-sm font-semibold transition-colors group-hover:bg-white/25">
                Explore For Doctors →
              </span>
            </Link>
            <Link
              href="/for-hospitals-and-hmis"
              className="group rounded-[20px] bg-gradient-to-br from-[#2a0e3d] to-[#4a1e5e] p-9 text-white shadow-card transition-transform duration-200 ease-clinical hover:-translate-y-1"
            >
              <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-white/15 text-xl" aria-hidden>
                🏥
              </div>
              <h3 className="font-display text-2xl font-extrabold tracking-tight">
                I am a hospital or HMIS partner
              </h3>
              <p className="mt-2 text-sm text-white/60">
                APIs, data residency, SLAs, on-prem options, audit logs.
              </p>
              <span className="mt-6 inline-block rounded-lg border border-white/25 bg-white/15 px-[22px] py-2.5 text-sm font-semibold transition-colors group-hover:bg-white/25">
                Explore integrations →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-10" aria-labelledby="metrics-heading">
        <div className="container-page">
          <h2 id="metrics-heading" className="sr-only">
            Key outcomes
          </h2>
          <div className="grid grid-cols-2 gap-8 md:gap-10 lg:grid-cols-5">
            {homeMetrics.map((m) => (
              <div
                key={m.id}
                className="text-center lg:border-r lg:border-[#eaecf5] lg:px-2 lg:last:border-r-0"
              >
                <p className="font-display text-3xl font-extrabold tracking-tight bg-grad-accent bg-clip-text text-transparent md:text-4xl">
                  {m.value}
                </p>
                <p className="mt-1 text-sm font-medium text-slate">{m.label}</p>
                <p className="mt-2 font-mono text-[10px] text-slate/70">
                  source: {m.sourceRef}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas py-[var(--section-y)]" aria-labelledby="logos-heading">
        <div className="container-page text-center">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
            Trusted deployments &amp; pilots
          </p>
          <h2 id="logos-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy">
            Hospitals and partners (consent-backed)
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4 md:gap-8">
            {logoWall.map((logo) => (
              <div
                key={logo.name}
                className="rounded-xl border border-indigo/10 bg-white px-6 py-4 font-display text-sm font-semibold text-slate grayscale transition-all hover:grayscale-0"
              >
                {logo.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-indigo/10 bg-white py-[var(--section-y)]" id="how-it-works">
        <div className="container-page">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              From conversation to verified note
            </h2>
            <p className="mt-4 text-slate">
              Illustrative flow—swap with motion graphic or film segments from CMS.
            </p>
          </div>
          <ol className="mt-14 space-y-0 divide-y divide-[#eaecf5]">
            {howItWorksSteps.map((step, index) => (
              <li
                key={step.title}
                className="grid gap-6 py-9 md:grid-cols-[80px_1fr_1fr] md:items-center"
              >
                <span className="hidden text-right font-display text-5xl font-extrabold opacity-25 bg-grad-accent bg-clip-text text-transparent md:block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    {step.body}
                  </p>
                </div>
                <div className="rounded-xl border border-indigo/10 bg-gradient-to-br from-[#EFF8FB] to-[#F0EDF8] p-5 text-center text-xs font-mono text-indigo">
                  CMS visual block · step {index + 1}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-canvas py-[var(--section-y)]" aria-labelledby="specialties-heading">
        <div className="container-page">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              Specialties
            </p>
            <h2 id="specialties-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Templates tuned for Indian practice
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {specialtiesFeatured.map((s) => (
              <Link
                key={s.slug}
                href={`/specialties/${s.slug}`}
                className="rounded-2xl border border-indigo/10 bg-white p-6 shadow-card transition-transform duration-200 ease-clinical hover:-translate-y-1"
              >
                <h3 className="font-display text-lg font-bold text-navy">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate">{s.blurb}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-magenta">
                  View specialty →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-indigo/10 bg-white py-[var(--section-y)]">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              Case study spotlight
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              {caseStudySpotlight.institution}
            </h2>
            <blockquote className="mt-6 border-l-4 border-indigo/30 pl-5 text-lg leading-relaxed text-slate">
              “{caseStudySpotlight.pullQuote}”
            </blockquote>
            <p className="mt-4 font-mono text-xs text-slate">
              {caseStudySpotlight.metricsLine}
            </p>
            <Link
              href={`/case-studies/${caseStudySpotlight.slug}`}
              className="mt-6 inline-flex rounded-lg bg-grad-accent px-5 py-2.5 text-sm font-semibold text-white"
            >
              {caseStudySpotlight.linkLabel}
            </Link>
          </div>
          <div className="rounded-2xl border border-indigo/10 bg-pale-blue p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-indigo">
              Pilot snapshot (CMS)
            </p>
            <ul className="mt-4 space-y-3 text-sm text-navy">
              <li>• Ambient noise: 70–90 dB clinical environments</li>
              <li>• Multilingual capture → structured English output</li>
              <li>• Verification-first workflow for clinicians</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-pale-blue py-[var(--section-y)]" aria-labelledby="testimonials-heading">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              Evidence from pilots
            </p>
            <h2 id="testimonials-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Clinician feedback we can stand behind
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate">
              Named testimonials and video reels ship only with signed releases—this section stays factual until CMS entries are approved.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <figure
                key={i}
                className="rounded-[18px] border border-indigo/10 bg-white p-7 shadow-card"
              >
                <span className="font-display text-5xl leading-none text-lavender" aria-hidden>
                  “
                </span>
                <blockquote className="-mt-3 text-sm leading-relaxed text-slate">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 text-sm font-bold text-navy">
                  {t.attribution}
                </figcaption>
                {t.role ? (
                  <p className="mt-1 text-xs text-slate">{t.role}</p>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas py-[var(--section-y)]" aria-labelledby="deploy-heading">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              Modes of deployment
            </p>
            <h2 id="deploy-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Meet hospitals where they operate
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {deploymentModes.map((d) => (
              <div
                key={d.title}
                className="rounded-2xl border border-indigo/10 bg-white p-6 shadow-card"
              >
                <h3 className="font-display text-lg font-bold text-navy">
                  {d.title}
                </h3>
                <p className="mt-2 text-sm text-slate">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-indigo/10 bg-pale-blue py-[var(--section-y)]">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              Compliance &amp; trust
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Procurement-ready posture
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate">
              Each statement links to the Security &amp; Compliance page—keep language legally precise (HIPAA-aligned vs compliant, ISO status, residency).
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {complianceBand.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="rounded-2xl border border-indigo/10 bg-white p-6 text-center shadow-card transition-transform hover:-translate-y-1"
              >
                <h3 className="font-display text-base font-bold text-navy">
                  {c.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate">{c.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-[var(--section-y)]">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-indigo/20 to-magenta/20" aria-hidden />
            <p className="mt-3 font-mono text-[11px] text-slate">
              Founder portrait slot — CMS media library
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              Founder note
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              {founderNote.name}
            </h2>
            <p className="mt-1 text-sm text-slate">{founderNote.role}</p>
            <p className="mt-6 text-lg leading-relaxed text-navy">
              “{founderNote.quote}”
            </p>
            <Link
              href={founderNote.aboutHref}
              className="mt-6 inline-flex text-sm font-semibold text-magenta"
            >
              Read our story →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-indigo/10 bg-canvas py-[var(--section-y)]">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              Awards &amp; recognition
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Incubation and ecosystem partners
            </h2>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {awards.map((a) => (
              <li
                key={a.name}
                className="rounded-xl border border-indigo/10 bg-white p-5 text-sm font-semibold text-navy shadow-sm"
              >
                {a.name}
                {a.detail ? (
                  <p className="mt-2 text-xs font-normal text-slate">{a.detail}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-[var(--section-y)]" aria-labelledby="faq-heading">
        <div className="container-page max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              FAQ
            </p>
            <h2 id="faq-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Answers procurement teams ask first
            </h2>
          </div>
          <div className="mt-10 divide-y divide-indigo/10 rounded-2xl border border-indigo/10">
            {homeFaqs.map((f) => (
              <details key={f.question} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-display text-base font-semibold text-navy [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.question}
                    <span className="text-magenta transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-grad-cta px-6 py-24 text-center md:px-12">
        <div className="relative z-[2] mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white md:text-5xl text-balance">
            Start your 7-day trial or book a walkthrough
          </h2>
          <p className="mt-4 text-lg text-white/65">
            Hands-free capture, multilingual clinics, HMIS-ready outputs—confirm trial mechanics before publishing deadlines.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3.5">
            <Link
              href="/trial"
              className="rounded-xl bg-grad-accent px-8 py-3.5 font-display text-base font-semibold text-white shadow-[0_8px_32px_rgba(155,47,145,0.4)]"
            >
              Start your 7-day free trial
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-white/25 bg-white/10 px-8 py-3.5 font-display text-base font-medium text-white backdrop-blur-sm hover:bg-white/15"
            >
              Book a 20-minute walkthrough
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
