import Link from "next/link";
import { footerColumns, siteMeta } from "@/content/site-config";
import { Logo } from "@/components/brand/Logo";

type SiteFooterProps = {
  logoUrl?: string | null;
  logoAlt?: string;
};

export function SiteFooter({ logoUrl, logoAlt }: SiteFooterProps = {}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#09152e] px-6 py-14 text-white/60 md:px-12">
      <div className="container-page grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
            <span className="rounded-lg bg-white p-1.5">
              <Logo size={32} decorative src={logoUrl} alt={logoAlt} />
            </span>
            Jatayu Healthcare
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
            {siteMeta.productName}: voice-first clinical documentation for
            Indian healthcare. Hands-free, pocket-friendly, built for verification
            before filing.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-white">
            Product
          </h2>
          <ul className="mt-4 space-y-2">
            {footerColumns.product.map((l) => (
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
        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-white">
            Company
          </h2>
          <ul className="mt-4 space-y-2">
            {footerColumns.company.map((l) => (
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
        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-white">
            Legal
          </h2>
          <ul className="mt-4 space-y-2">
            {footerColumns.legal.map((l) => (
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
      <div className="container-page mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:justify-between">
        <span>
          © {year} {siteMeta.legalName}. All rights reserved.
        </span>
        <span>Made for Indian clinicians and hospital IT teams.</span>
      </div>
    </footer>
  );
}
