import Link from "next/link";
import {
  getAudienceSplit,
  getAwards,
  getComplianceBand,
  getDeploymentModes,
  getFaqs,
  getFeaturedSpecialties,
  getFounderNote,
  getHomeHero,
  getHomeMetrics,
  getHomepageConciseAnswer,
  getHowItWorksSteps,
  getLogoWall,
  getSiteMeta,
  getSpotlightCaseStudy,
  getTestimonials,
} from "@/lib/cms";
import { HeroVisual } from "@/components/home/HeroVisual";
import { JsonLd } from "@/components/seo/JsonLd";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

const heroVideoSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;

export async function HomeSections() {
  const [
    siteMeta,
    homeHero,
    homeMetrics,
    audienceSplit,
    homepageConcise,
    faqs,
    featuredSpecialties,
    spotlightCase,
    testimonials,
    deploymentModes,
    complianceBand,
    founderNote,
    awards,
    logoWall,
    howItWorksSteps,
  ] = await Promise.all([
    getSiteMeta(),
    getHomeHero(),
    getHomeMetrics(),
    getAudienceSplit(),
    getHomepageConciseAnswer(),
    getFaqs(),
    getFeaturedSpecialties(),
    getSpotlightCaseStudy(),
    getTestimonials(),
    getDeploymentModes(),
    getComplianceBand(),
    getFounderNote(),
    getAwards(),
    getLogoWall(),
    getHowItWorksSteps(),
  ]);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
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

  const metrics = (homeMetrics.metrics ?? []) as Array<{
    key: string;
    value: string;
    label: string;
    sourceRef: string;
  }>;

  return (
    <>
      <JsonLd data={faqLd} />
      <JsonLd data={softwareLd} />

      <section className="relative overflow-hidden border-b border-indigo/10 bg-grad-hero pb-16 pt-24 md:pb-20 md:pt-28">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(52,86,164,0.12)_0%,transparent_70%)] motion-reduce:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(124,68,129,0.1)_0%,transparent_70%)] motion-reduce:hidden"
          aria-hidden
        />

        <div className="container-page flex flex-col items-center text-center">
          <div className="mb-5 flex items-center gap-3">
            <Logo size={48} decorative className="rounded-full bg-white p-1 shadow-sm" />
            <span className="font-display text-sm font-semibold text-indigo">
              Jatayu Healthcare
            </span>
          </div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo/15 bg-white px-4 py-1.5 text-xs font-medium text-navy shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            {homeHero.badge}
          </p>

          <h1 className="max-w-[820px] font-display text-4xl font-extrabold tracking-tight text-navy md:text-5xl xl:text-[4rem] text-balance">
            {(() => {
              const parts = homeHero.headline.split(". ");
              if (parts.length < 2) return homeHero.headline;
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

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate">
            {homeHero.subheadline}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3.5">
            <Button as="link" href={homeHero.primaryCta.href} variant="primary" size="lg">
              {homeHero.primaryCta.label}
            </Button>
            <Button as="link" href={homeHero.secondaryCta.href} variant="secondary" size="lg">
              {homeHero.secondaryCta.label}
            </Button>
          </div>

          <p className="mt-7 max-w-xl text-sm font-medium text-navy/80">
            {homeHero.trustLine}
          </p>

          <figure className="mt-12 w-full max-w-[900px] overflow-hidden rounded-2xl border border-indigo/10 bg-navy/95 shadow-elevated">
            {heroVideoSrc ? (
              <video
                className="aspect-video w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                aria-label="VoiceDocAI product overview film"
              >
                <source src={heroVideoSrc} type="video/mp4" />
              </video>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 px-6 text-center">
                <p className="font-display text-sm font-semibold text-white">
                  Product overview film
                </p>
                <p className="max-w-md text-xs leading-relaxed text-white/70">
                  Add a CDN URL via NEXT_PUBLIC_HERO_VIDEO_URL. Muted by default. No in-browser microphone capture on this site.
                </p>
              </div>
            )}
          </figure>

          <HeroVisual />
        </div>
      </section>

      <section className="border-y border-[#eaecf5] bg-white py-12 md:py-16" aria-labelledby="audience-split-heading">
        <div className="container-page">
          <h2 id="audience-split-heading" className="sr-only">
            Choose your path
          </h2>
          <div className="grid gap-7 md:grid-cols-2">
            <Link
              href={audienceSplit.doctor.href}
              className="group relative rounded-[20px] bg-gradient-to-br from-[#0e1e3d] to-[#1a2d68] p-9 text-white shadow-card transition-transform duration-200 ease-clinical hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-white/15 text-xl" aria-hidden>
                👨‍⚕️
              </div>
              <h3 className="font-display text-2xl font-extrabold tracking-tight">
                {audienceSplit.doctor.title}
              </h3>
              <p className="mt-2 text-sm text-white/80">{audienceSplit.doctor.body}</p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/15 px-5 py-2.5 text-sm font-semibold transition-colors group-hover:bg-white/25">
                {audienceSplit.doctor.cta}
                <span aria-hidden>→</span>
              </span>
            </Link>
            <Link
              href={audienceSplit.hospital.href}
              className="group relative rounded-[20px] bg-gradient-to-br from-[#2a0e3d] to-[#4a1e5e] p-9 text-white shadow-card transition-transform duration-200 ease-clinical hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-white/15 text-xl" aria-hidden>
                  🏥
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white">
                  <span aria-hidden>🇮🇳</span>
                  {audienceSplit.hospital.chip}
                </span>
              </div>
              <h3 className="font-display text-2xl font-extrabold tracking-tight">
                {audienceSplit.hospital.title}
              </h3>
              <p className="mt-2 text-sm text-white/80">{audienceSplit.hospital.body}</p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/15 px-5 py-2.5 text-sm font-semibold transition-colors group-hover:bg-white/25">
                {audienceSplit.hospital.cta}
                <span aria-hidden>→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white pb-12 md:pb-16" aria-labelledby="metrics-heading">
        <div className="container-page">
          <h2 id="metrics-heading" className="sr-only">
            Key outcomes
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {metrics.map((m) => (
              <div
                key={m.key}
                className="text-center lg:border-r lg:border-[#eaecf5] lg:px-3 lg:last:border-r-0"
                title={`Source: ${m.sourceRef}`}
              >
                <p className="font-display text-3xl font-extrabold tracking-tight bg-grad-accent bg-clip-text text-transparent md:text-4xl">
                  {m.value}
                </p>
                <p className="mt-1 text-sm font-medium text-navy/80">{m.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate">
            All metrics are sourced and reviewed.{" "}
            <Link href="/about/facts" className="font-semibold text-indigo hover:underline">
              See the citations
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-canvas py-[var(--section-y)]" aria-labelledby="answer-heading">
        <div className="container-page max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
            {homepageConcise.label}
          </p>
          <h2
            id="answer-heading"
            className="mt-3 font-display text-2xl font-extrabold tracking-tight text-navy md:text-3xl"
          >
            VoiceDocAI in plain language
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy/85">{homepageConcise.body}</p>
        </div>
      </section>

      <section className="bg-white py-[var(--section-y)]" aria-labelledby="logos-heading">
        <div className="container-page text-center">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
            Trusted deployments and pilots
          </p>
          <h2 id="logos-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy">
            Hospitals and partners with consent on file
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4 md:gap-6">
            {(logoWall.logos ?? []).map((logo: { name: string }) => (
              <div
                key={logo.name}
                className="rounded-xl border border-indigo/10 bg-white px-6 py-4 font-display text-sm font-semibold text-navy/85 grayscale transition-all hover:grayscale-0"
              >
                {logo.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-indigo/10 bg-canvas py-[var(--section-y)]" id="how-it-works">
        <div className="container-page">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              From conversation to verified note
            </h2>
            <p className="mt-4 text-slate">
              Illustrative flow. Replace each panel with motion graphic or film segments from the CMS.
            </p>
          </div>
          <ol className="mt-14 space-y-0 divide-y divide-[#eaecf5]">
            {(howItWorksSteps.steps ?? []).map(
              (step: { title: string; body: string }, index: number) => (
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
                    <p className="mt-2 text-sm leading-relaxed text-slate">{step.body}</p>
                  </div>
                  <div className="rounded-xl border border-indigo/10 bg-white p-5 text-center text-xs font-semibold text-indigo">
                    Step {index + 1} visual placeholder
                  </div>
                </li>
              ),
            )}
          </ol>
        </div>
      </section>

      <section className="bg-white py-[var(--section-y)]" aria-labelledby="specialties-heading">
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
            {featuredSpecialties.map((s) => (
              <Link
                key={s.slug}
                href={`/specialties/${s.slug}`}
                className="group rounded-2xl border border-indigo/10 bg-canvas p-6 shadow-card transition-transform duration-200 ease-clinical hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
              >
                <h3 className="font-display text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-slate">{s.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-magenta group-hover:text-purple">
                  Open {s.title.toLowerCase()}
                  <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {spotlightCase ? (
        <section className="border-y border-indigo/10 bg-canvas py-[var(--section-y)]">
          <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
                Case study spotlight
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
                {spotlightCase.institution}
              </h2>
              <blockquote className="mt-6 border-l-4 border-indigo/40 pl-5 text-lg leading-relaxed text-navy/85">
                &ldquo;{spotlightCase.pullQuote}&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-slate">{spotlightCase.metricsLine}</p>
              <div className="mt-6">
                <Button
                  as="link"
                  href={`/case-studies/${spotlightCase.slug}`}
                  variant="primary"
                  size="md"
                >
                  {spotlightCase.linkLabel}
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-indigo/15 bg-white p-8 shadow-card">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo">
                Pilot snapshot
              </p>
              <ul className="mt-4 space-y-3 text-sm text-navy">
                <li>Ambient noise: 70 to 90 dB clinical environments</li>
                <li>Multilingual capture, structured English output</li>
                <li>Verification-first workflow for clinicians</li>
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-gradient-to-b from-white to-pale-blue py-[var(--section-y)]" aria-labelledby="testimonials-heading">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              Evidence from pilots
            </p>
            <h2 id="testimonials-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Clinician feedback we can stand behind
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-navy/80">
              Named testimonials and video reels ship only with signed releases. Until then this section stays factual.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <figure
                key={t.id}
                className="rounded-[18px] border border-indigo/10 bg-white p-7 shadow-card"
              >
                <span className="font-display text-5xl leading-none text-lavender" aria-hidden>
                  &ldquo;
                </span>
                <blockquote className="-mt-3 text-base leading-relaxed text-navy/85">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 text-sm font-bold text-navy">
                  {t.attribution}
                </figcaption>
                {t.role ? <p className="mt-1 text-xs text-slate">{t.role}</p> : null}
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
            {(deploymentModes.modes ?? []).map((d: { title: string; body: string }) => (
              <div
                key={d.title}
                className="rounded-2xl border border-indigo/10 bg-white p-6 shadow-card"
              >
                <h3 className="font-display text-lg font-bold text-navy">{d.title}</h3>
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
              Compliance and trust
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Procurement-ready posture
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-navy/85">
              Each statement links to the Security &amp; Compliance page. Language stays legally precise: HIPAA-aligned, not HIPAA-certified.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {(complianceBand.items ?? []).map(
              (c: { title: string; body: string; href: string }) => (
                <Link
                  key={c.title}
                  href={c.href}
                  className="rounded-2xl border border-indigo/15 bg-white p-6 text-center shadow-card transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
                >
                  <h3 className="font-display text-base font-bold text-navy">{c.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-navy/75">{c.body}</p>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-[var(--section-y)]">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-indigo/20 to-magenta/20" aria-hidden />
            <p className="mt-3 text-xs text-slate">Founder portrait, swap from CMS media library.</p>
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
              &ldquo;{founderNote.quote}&rdquo;
            </p>
            <Button
              as="link"
              href={founderNote.aboutHref}
              variant="link"
              size="md"
              className="mt-6"
            >
              Read our story →
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-indigo/10 bg-canvas py-[var(--section-y)]">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              Awards and recognition
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Incubation and ecosystem partners
            </h2>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {awards.map((a) => (
              <li
                key={a.id}
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
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">FAQ</p>
            <h2 id="faq-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Answers procurement teams ask first
            </h2>
          </div>
          <div className="mt-10 divide-y divide-indigo/10 rounded-2xl border border-indigo/10 bg-canvas">
            {faqs.map((f) => (
              <details key={f.id} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-display text-base font-semibold text-navy [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.question}
                    <span className="text-magenta transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-navy/80">{f.answer}</p>
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
          <p className="mt-4 text-lg text-white/75">
            Hands-free capture, multilingual clinics, HMIS-ready outputs. Confirm trial mechanics with our team before publishing deadlines.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3.5">
            <Button as="link" href="/trial" variant="primary" size="lg">
              Start your 7-day free trial
            </Button>
            <Button as="link" href="/contact" variant="ghost" size="lg">
              Book a 20-minute walkthrough
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
