"use client";

import { useEffect, useRef, useState } from "react";

const TRANSCRIPT_LINES = [
  "Patient is a forty-two-year-old male presenting with fever of one-oh-two Fahrenheit for three days, associated with mild dry cough and generalised body ache.",
  "No history of travel. No known drug allergies. On examination, throat mildly congested, chest clear, abdomen soft and non-tender.",
  "Prescribing paracetamol five hundred milligram three times daily for five days, along with cetirizine ten milligram at night. Advised rest and hydration.",
  "Patient ko bukhar teen din se hai. Paracetamol shuru karte hain. Follow up panch din baad.",
];

const NOTE_FIELDS = [
  {
    label: "Chief Complaint",
    text: "Fever (102°F) for 3 days with dry cough and body ache.",
  },
  {
    label: "History of Present Illness",
    text: "42-year-old male, no travel history, no known allergies. Fever onset 3 days ago with dry cough and generalised body ache.",
  },
  {
    label: "Vitals and Examination",
    text: "Temp 102°F. Throat mildly congested. Chest clear. Abdomen soft, non-tender.",
  },
  {
    label: "Assessment and Plan",
    text: "Viral URTI. Symptomatic management. Review in 5 days if no improvement.",
  },
  {
    label: "Prescription",
    text: "Tab. Paracetamol 500mg TDS for 5 days. Tab. Cetirizine 10mg HS for 5 days. Rest and hydration.",
  },
];

const STATUS_STATES = [
  "Listening · Hindi detected",
  "Structuring clinical note...",
  "Note ready. Push to HMIS.",
];

const WAVE_BAR_COUNT = 56;

export function HeroVisual() {
  const waveformRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [transcript, setTranscript] = useState("");
  const [fieldsVisible, setFieldsVisible] = useState<boolean[]>(
    new Array(NOTE_FIELDS.length).fill(false),
  );
  const [ready, setReady] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);

  // Animated waveform — sine envelope with random phase per bar
  useEffect(() => {
    const container = waveformRef.current;
    if (!container) return;

    const bars: HTMLDivElement[] = [];
    const phases: number[] = [];
    const freqs: number[] = [];
    for (let i = 0; i < WAVE_BAR_COUNT; i++) {
      const b = document.createElement("div");
      b.style.width = "3px";
      b.style.borderRadius = "3px";
      b.style.background =
        "linear-gradient(180deg, #607ADC 0%, #9B2F91 100%)";
      b.style.height = "6px";
      b.style.minHeight = "4px";
      b.style.transition = "height 0.12s cubic-bezier(0.16, 1, 0.3, 1)";
      container.appendChild(b);
      bars.push(b);
      phases.push(Math.random() * Math.PI * 2);
      freqs.push(0.7 + Math.random() * 0.8);
    }

    let t = 0;
    const tick = () => {
      t += 0.06;
      const center = WAVE_BAR_COUNT / 2;
      bars.forEach((b, i) => {
        const dist = Math.abs(i - center) / center;
        const envelope = 1 - Math.pow(dist, 1.4) * 0.55;
        const wave = Math.sin(t * freqs[i] + phases[i]);
        const energy = (wave * 0.5 + 0.5) * envelope;
        b.style.height = `${6 + energy * 60}px`;
        b.style.opacity = String((0.45 + energy * 0.55).toFixed(2));
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      bars.forEach((b) => b.remove());
    };
  }, []);

  // Transcript typewriter loop
  useEffect(() => {
    let li = 0;
    let ci = 0;
    let mode: "type" | "hold" | "erase" = "type";
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const step = () => {
      if (cancelled) return;
      const text = TRANSCRIPT_LINES[li];
      if (mode === "type") {
        ci++;
        setTranscript(text.slice(0, ci));
        if (ci >= text.length) {
          mode = "hold";
          timer = setTimeout(step, 1800);
          return;
        }
        timer = setTimeout(step, 28 + Math.random() * 24);
      } else if (mode === "hold") {
        mode = "erase";
        timer = setTimeout(step, 200);
      } else {
        ci -= 6;
        if (ci <= 0) {
          ci = 0;
          li = (li + 1) % TRANSCRIPT_LINES.length;
          mode = "type";
          timer = setTimeout(step, 350);
          return;
        }
        setTranscript(text.slice(0, ci));
        timer = setTimeout(step, 14);
      }
    };
    step();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Clinical note fields stagger + status cycle, looped
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(() => resolve(), ms);
        timers.push(t);
      });

    const loop = async () => {
      while (!cancelled) {
        setFieldsVisible(new Array(NOTE_FIELDS.length).fill(false));
        setReady(false);
        setStatusIdx(0);
        await wait(1200);
        if (cancelled) return;
        setStatusIdx(1);
        for (let i = 0; i < NOTE_FIELDS.length; i++) {
          await wait(250 + i * 150);
          if (cancelled) return;
          setFieldsVisible((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }
        setReady(true);
        setStatusIdx(2);
        await wait(5000);
      }
    };
    loop();

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    // Lives in the right column of the hero grid now (Nov 2025 redesign).
    // No top margin needed — column already aligns vertically with the text;
    // width is fluid so the column controls sizing.
    <div className="relative z-[2] w-full">
      {/* Soft pink glow behind the console */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-12 -inset-y-10 -z-10 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(255,107,214,0.16),transparent_60%)] blur-2xl"
      />

      <div className="overflow-hidden rounded-[24px] border border-indigo/10 bg-white/95 shadow-[0_24px_60px_rgba(11,26,54,0.14),0_8px_24px_rgba(36,63,134,0.08)] backdrop-blur">
        {/* Top bar */}
        <div className="flex items-center gap-2.5 border-b border-indigo/10 bg-canvas/60 px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
          <p className="ml-2 font-mono text-[11px] tracking-wide text-slate">
            VoiceDocAI · Clinical Documentation
          </p>
          <span
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-magenta/25 bg-magenta/10 px-2.5 py-1 text-[11px] font-semibold text-magenta"
            aria-live="polite"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-magenta"
              style={{ animation: "pulse 1.5s ease-in-out infinite" }}
              aria-hidden
            />
            {STATUS_STATES[statusIdx]}
          </span>
        </div>

        {/* Body — two columns */}
        <div className="grid min-h-[460px] md:grid-cols-2">
          {/* LEFT: Doctor speaking */}
          <div className="flex flex-col gap-4 border-b border-indigo/10 bg-gradient-to-b from-pale-blue/40 to-transparent p-7 md:border-b-0 md:border-r">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo">
              <span
                className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-md bg-gradient-to-br from-indigo/15 to-magenta/15 text-[10px]"
                aria-hidden
              >
                🎙
              </span>
              Doctor speaking
            </p>

            {/* Animated waveform */}
            <div
              ref={waveformRef}
              className="relative flex h-[88px] items-center justify-center gap-[4px] overflow-hidden rounded-[14px] border border-indigo/10 bg-white/55 px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              aria-hidden
            />

            {/* Transcript */}
            <div className="relative flex-1 rounded-[14px] border border-indigo/10 bg-white/55 px-[18px] py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <span
                className="absolute left-3.5 top-2.5 font-display text-2xl leading-none text-magenta/25"
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="min-h-[180px] pl-[22px] text-[15px] italic leading-relaxed text-ink">
                {transcript}
                <span
                  className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-[2px] bg-magenta align-middle"
                  style={{ animation: "blink 1s step-end infinite" }}
                  aria-hidden
                />
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-indigo/8 px-3 py-1 text-[11px] font-semibold text-indigo">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="#243F86" strokeWidth="1.2" />
                <path
                  d="M3 5l1.5 1.5L7 4"
                  stroke="#243F86"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              Accent: Hindi · Auto-detected
            </span>
          </div>

          {/* RIGHT: Generated clinical note */}
          <div className="flex flex-col gap-4 bg-gradient-to-b from-magenta/[0.04] to-transparent p-7">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo">
              <span
                className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-md bg-gradient-to-br from-indigo/15 to-magenta/15 text-[10px]"
                aria-hidden
              >
                📋
              </span>
              Clinical note · auto-generated
            </p>

            <div className="flex flex-1 flex-col gap-3.5 rounded-[14px] border border-indigo/10 bg-white p-5 shadow-[0_4px_16px_rgba(11,26,54,0.04)]">
              {NOTE_FIELDS.map((f, i) => (
                <div
                  key={f.label}
                  className="transition-all duration-500 ease-clinical"
                  style={{
                    opacity: fieldsVisible[i] ? 1 : 0,
                    transform: fieldsVisible[i]
                      ? "translateY(0)"
                      : "translateY(8px)",
                  }}
                >
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-magenta">
                    {f.label}
                  </p>
                  {fieldsVisible[i] ? (
                    <p className="text-[13.5px] leading-relaxed text-ink">
                      {f.text}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <div
                        className="h-2 w-[90%] rounded bg-[linear-gradient(90deg,rgba(36,63,134,0.08)_25%,rgba(155,47,145,0.10)_50%,rgba(36,63,134,0.08)_75%)] bg-[length:200%_100%]"
                        style={{ animation: "shimmer 1.4s ease-in-out infinite" }}
                      />
                      <div
                        className="h-2 w-[60%] rounded bg-[linear-gradient(90deg,rgba(36,63,134,0.08)_25%,rgba(155,47,145,0.10)_50%,rgba(36,63,134,0.08)_75%)] bg-[length:200%_100%]"
                        style={{ animation: "shimmer 1.4s ease-in-out infinite" }}
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-1 flex items-center gap-2.5">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 transition-all duration-500 ease-clinical"
                  style={{
                    opacity: ready ? 1 : 0,
                    transform: ready ? "translateY(0)" : "translateY(8px)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1.5 5L4 7.5L8.5 2.5"
                      stroke="#15803d"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Note ready. Push to HMIS.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local keyframes so we don't rely on Tailwind config edits */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.85);
          }
        }
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        @keyframes shimmer {
          0% {
            background-position: 200% 50%;
          }
          100% {
            background-position: -200% 50%;
          }
        }
      `}</style>
    </div>
  );
}
