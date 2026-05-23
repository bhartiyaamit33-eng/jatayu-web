"use client";

import Link from "next/link";
import { useRef } from "react";

type AudienceSplit = {
  doctor: { title: string; body: string; cta: string; href: string };
  hospital: {
    title: string;
    body: string;
    cta: string;
    href: string;
    chip?: string;
  };
};

function applyTilt(
  el: HTMLElement,
  e: React.MouseEvent<HTMLElement>,
  spotlight: HTMLElement | null,
) {
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const mxPct = (x / r.width) * 100;
  const myPct = (y / r.height) * 100;
  const rx = (y / r.height - 0.5) * -5;
  const ry = (x / r.width - 0.5) * 5;
  el.style.transform = `translateY(-4px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  if (spotlight) {
    spotlight.style.background = `radial-gradient(circle at ${mxPct}% ${myPct}%, rgba(255,255,255,0.14), transparent 50%)`;
    spotlight.style.opacity = "1";
  }
}

function resetTilt(el: HTMLElement, spotlight: HTMLElement | null) {
  el.style.transform = "";
  if (spotlight) spotlight.style.opacity = "0";
}

function DoctorCard({ data }: { data: AudienceSplit["doctor"] }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const spotRef = useRef<HTMLSpanElement>(null);
  return (
    <Link
      ref={ref}
      href={data.href}
      onMouseMove={(e) => ref.current && applyTilt(ref.current, e, spotRef.current)}
      onMouseLeave={() => ref.current && resetTilt(ref.current, spotRef.current)}
      className="group relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0e1e3d] via-[#1f356c] to-[#2a4a8d] p-9 text-white shadow-card transition-shadow duration-300 ease-clinical will-change-transform hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      style={{ transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease" }}
    >
      <span
        ref={spotRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
      />
      <div className="relative z-[1]">
        <div
          className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] border border-white/20 bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur"
          aria-hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-extrabold tracking-tight">
          {data.title}
        </h3>
        <p className="mt-2 text-sm text-white/80">{data.body}</p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-colors group-hover:bg-white/25">
          {data.cta}
          <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

function HospitalCard({ data }: { data: AudienceSplit["hospital"] }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const spotRef = useRef<HTMLSpanElement>(null);
  return (
    <Link
      ref={ref}
      href={data.href}
      onMouseMove={(e) => ref.current && applyTilt(ref.current, e, spotRef.current)}
      onMouseLeave={() => ref.current && resetTilt(ref.current, spotRef.current)}
      className="group relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#2a0e3d] via-[#5c1f6e] to-[#8b3a9e] p-9 text-white shadow-card transition-shadow duration-300 ease-clinical will-change-transform hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      style={{ transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease" }}
    >
      <span
        ref={spotRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
      />
      <div className="relative z-[1]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div
            className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] border border-white/20 bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur"
            aria-hidden
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21V8l9-5 9 5v13" />
              <path d="M9 21V12h6v9" />
              <path d="M12 6v3" />
              <path d="M10.5 7.5h3" />
            </svg>
          </div>
          {data.chip ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur">
              {data.chip}
            </span>
          ) : null}
        </div>
        <h3 className="font-display text-2xl font-extrabold tracking-tight">
          {data.title}
        </h3>
        <p className="mt-2 text-sm text-white/80">{data.body}</p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-colors group-hover:bg-white/25">
          {data.cta}
          <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export function AudienceCards({ audienceSplit }: { audienceSplit: AudienceSplit }) {
  return (
    <div className="grid gap-7 md:grid-cols-2">
      <DoctorCard data={audienceSplit.doctor} />
      <HospitalCard data={audienceSplit.hospital} />
    </div>
  );
}
