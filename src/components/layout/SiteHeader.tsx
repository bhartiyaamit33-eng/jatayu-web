"use client";

import Link from "next/link";
import { useState } from "react";
import { mainNavItems } from "@/lib/nav";
import { getLoginUrl } from "@/lib/login-url";
import { siteMeta } from "@/content/site-config";
import { Logo } from "@/components/brand/Logo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const items = mainNavItems();

  return (
    <header className="sticky top-0 z-[100] border-b border-indigo/10 bg-white/90 shadow-nav backdrop-blur-xl">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy focus:shadow-card"
      >
        Skip to content
      </a>
      <div className="container-page flex h-[68px] items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${siteMeta.legalName} home`}
          className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-navy"
        >
          <Logo size={36} decorative />
          <span className="hidden sm:inline">
            Jatayu · {siteMeta.productName}
          </span>
          <span className="sm:hidden">{siteMeta.productName}</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate transition-colors duration-200 ease-clinical hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={getLoginUrl()}
            className="hidden rounded-lg border border-indigo/20 px-[18px] py-2 text-sm font-medium text-navy transition-colors duration-200 ease-clinical hover:border-indigo hover:text-indigo sm:inline-block"
          >
            Login
          </Link>
          <Link
            href="/trial"
            className="rounded-lg bg-grad-accent px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(155,47,145,0.35)] transition-transform duration-200 ease-clinical hover:-translate-y-px"
          >
            Start free trial
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-indigo/15 lg:hidden"
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
          className="border-t border-indigo/10 bg-white lg:hidden"
        >
          <nav
            className="container-page flex flex-col gap-1 py-4"
            aria-label="Mobile primary"
          >
            {items.map((item) => (
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
