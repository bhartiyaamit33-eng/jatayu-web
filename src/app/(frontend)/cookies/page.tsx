import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/pages/PageIntro";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How jatayuhealth.com uses cookies — essential session cookies, privacy-respecting analytics, and how to opt out.",
  alternates: { canonical: `${siteMeta.domain}/cookies` },
};

/**
 * /cookies — simple, customer-facing cookie notice.
 *
 * This page is no longer linked from the footer (replaced with the
 * Cancellation Policy), but keeping it accessible by URL preserves any
 * inbound links and answers a common procurement question.
 */
export default function CookiesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Cookie Policy"
        conciseAnswer="We use a minimal set of cookies to keep this site working and to understand which pages are useful. We do not run third-party advertising trackers."
      />

      <article className="container-page max-w-3xl pb-[var(--section-y)] pt-10 space-y-8 text-sm leading-relaxed text-navy/85 md:text-[15px]">
        <section>
          <h2 className="font-display text-xl font-bold text-navy">
            Essential cookies
          </h2>
          <p className="mt-3">
            These keep the site working — session cookies for the trial signup
            flow, login cookies for the CMS at <code>/admin</code>, and
            preference cookies (for example, light / dark theme on supporting
            pages). Essential cookies cannot be disabled without breaking core
            functionality.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-navy">
            Analytics
          </h2>
          <p className="mt-3">
            We use privacy-respecting analytics to understand which pages are
            useful and where visitors get stuck. We do not collect personally
            identifying information for analytics purposes, and we do not share
            this data with advertising networks.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-navy">
            Third-party services
          </h2>
          <p className="mt-3">
            Embedded media (for example, videos) may set their own cookies when
            you interact with them. The same applies to social-media links if
            you click through to those platforms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-navy">
            Your choices
          </h2>
          <p className="mt-3">
            Most browsers let you block or delete cookies through your privacy
            settings. Blocking essential cookies will prevent some site
            functionality (for example, the trial signup form).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-navy">
            Contact us
          </h2>
          <p className="mt-3">
            Questions about how we use cookies? Write to{" "}
            <Link
              href={`mailto:${siteMeta.salesEmail}`}
              className="font-semibold text-indigo hover:underline"
            >
              {siteMeta.salesEmail}
            </Link>
            . See also our{" "}
            <Link href="/privacy" className="font-semibold text-indigo hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </article>
    </>
  );
}
