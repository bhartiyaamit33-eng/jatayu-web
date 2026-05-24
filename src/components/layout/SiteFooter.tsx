import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { SocialIcon, SOCIAL_PLATFORM_LABEL } from "@/components/brand/SocialIcon";
import { getSiteFooter } from "@/lib/cms";
import { siteMeta } from "@/content/site-config";

type SiteFooterProps = {
  logoUrl?: string | null;
  logoAlt?: string;
};

/**
 * SiteFooter
 * ----------
 * Dark footer at the bottom of every public page. Everything inside it —
 * tagline, link columns, social buttons, copyright strapline — comes from
 * the `site-footer` CMS global (see src/globals/SiteFooter.ts).
 *
 * Office addresses stay in `siteMeta.offices` (file-based) since they're
 * also surfaced on /contact and we want one source of truth for them.
 *
 * The `logoUrl` / `logoAlt` props are passed in by the layout (which
 * already reads siteMeta for the header) so we don't double-fetch.
 */
export async function SiteFooter({ logoUrl, logoAlt }: SiteFooterProps = {}) {
  const footer = await getSiteFooter();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#09152e] px-6 py-14 text-white/60 md:px-12">
      {/* Top row: brand + 3 link columns */}
      <div className="container-page grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand block */}
        <div>
          <div className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
            <span className="rounded-lg bg-white p-1.5">
              <Logo size={32} decorative src={logoUrl} alt={logoAlt} />
            </span>
            Jatayu Healthcare
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
            {footer.tagline}
          </p>

          {/* Social media buttons — sit under the tagline so they read as
              "this is who we are, here's where to find us". */}
          {footer.socialLinks.length > 0 ? (
            <ul
              className="mt-5 flex flex-wrap items-center gap-2.5"
              aria-label="Follow Jatayu Healthcare on social media"
            >
              {footer.socialLinks.map((s) => {
                const label = `${SOCIAL_PLATFORM_LABEL[s.platform]}`;
                return (
                  <li key={`${s.platform}-${s.href}`}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Jatayu on ${label}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/65 transition-colors hover:border-white/40 hover:bg-white/5 hover:text-white"
                    >
                      <SocialIcon platform={s.platform} title={label} size={16} />
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        {/* Product column */}
        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-white">
            Product
          </h2>
          <ul className="mt-4 space-y-2">
            {footer.productLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/60 transition-colors hover:text-white/85"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company column */}
        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-white">
            Company
          </h2>
          <ul className="mt-4 space-y-2">
            {footer.companyLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/60 transition-colors hover:text-white/85"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal column */}
        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-white">
            Legal
          </h2>
          <ul className="mt-4 space-y-2">
            {footer.legalLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/60 transition-colors hover:text-white/85"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Office addresses — site-wide visibility above the copyright bar. */}
      <div className="container-page mt-12 grid gap-6 border-t border-white/10 pt-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-white">
            Our locations
          </h2>
          <p className="mt-3 text-xs text-white/55">
            Walk-ins by appointment only.
          </p>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2">
          {siteMeta.offices.map((office) => (
            <li key={office.city}>
              <p className="font-display text-sm font-semibold text-white">
                {office.city}
              </p>
              <address className="mt-1.5 not-italic text-xs leading-relaxed text-white/65">
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

      {/* Bottom row: copyright + editor-controlled strapline */}
      <div className="container-page mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:justify-between">
        <span>
          © {year} {siteMeta.legalName}. All rights reserved.
        </span>
        <span>{footer.bottomStrapline}</span>
      </div>
    </footer>
  );
}
