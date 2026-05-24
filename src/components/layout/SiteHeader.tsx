"use client";

import Link from "next/link";
import { useState } from "react";
import { headerNavItems, mainNavItems } from "@/lib/nav";
import { getLoginUrl } from "@/lib/login-url";
import { siteMeta } from "@/content/site-config";
import { Logo } from "@/components/brand/Logo";

type SiteHeaderProps = {
  logoUrl?: string | null;
  logoAlt?: string;
};

export function SiteHeader({ logoUrl, logoAlt }: SiteHeaderProps = {}) {
  const [open, setOpen] = useState(false);
  const headerItems = headerNavItems();
  const mobileItems = mainNavItems();

  return (
    <header className="sticky top-0 z-[100] border-b border-indigo/10 bg-white/90 shadow-nav backdrop-blur-xl">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy focus:shadow-card"
      >
        Skip to content
      </a>
      <div className="flex h-16 items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          aria-label={`${siteMeta.legalName} home`}
          className="flex shrink-0 items-center gap-2.5 font-display text-base font-bold tracking-tight text-navy"
        >
          <Logo size={32} decorative src={logoUrl} alt={logoAlt} />
          <span className="hidden whitespace-nowrap sm:inline">
            Jatayu · {siteMeta.productName}
          </span>
          <span className="whitespace-nowrap sm:hidden">{siteMeta.productName}</span>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-7 xl:flex"
          aria-label="Primary"
        >
          {headerItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-slate transition-colors duration-200 ease-clinical hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={getLoginUrl()}
            className="hidden whitespace-nowrap rounded-lg border border-indigo/20 px-4 py-2 text-sm font-medium text-navy transition-colors duration-200 ease-clinical hover:border-indigo hover:text-indigo sm:inline-block"
          >
            Login
          </Link>
          <Link
            href="/trial"
            className="whitespace-nowrap rounded-lg bg-grad-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(155,47,145,0.35)] transition-transform duration-200 ease-clinical hover:-translate-y-px sm:px-5"
          >
            Start free trial
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-indigo/15 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5" aria-hidden>
              <span className="block h-0.5 w-5 bg-navy" />
              <span className="block h-0.5 w-5 bg-navy" />
              <span className="block h-0.5 w-5 bg-navy" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-indigo/10 bg-white xl:hidden"
        >
          <nav
            className="container-page flex flex-col gap-1 py-4"
            aria-label="Mobile primary"
          >
            {mobileItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-navy hover:bg-pale-blue"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={getLoginUrl()}
              className="rounded-lg px-3 py-3 text-sm font-medium text-indigo hover:bg-pale-blue"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
