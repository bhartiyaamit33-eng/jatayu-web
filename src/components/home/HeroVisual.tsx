"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * HeroVisual
 * ----------
 * The animated demo console on the right side of the homepage hero.
 *
 * Story it tells (Nov 2025 redesign):
 *   1. Visitor lands → conversation starts playing as chat bubbles.
 *   2. Each turn types out, in its real language (Hindi / English / Arabic).
 *   3. After the last turn finishes, the structured clinical note fills in,
 *      showing how the system combines multilingual input into one record.
 *   4. Three language buttons across the top let the visitor jump to any
 *      conversation; we also auto-advance through them on a loop.
 *
 * The single patient encounter (chemotherapy nausea/weakness) is intentional —
 * all three conversations are *the same case*, just demonstrating how the
 * system handles switching between languages within one consultation.
 */

// ---------------------------------------------------------------------------
// Demo content
// ---------------------------------------------------------------------------

type Speaker = "patient" | "doctor";

type ConversationMessage = {
  speaker: Speaker;
  /** Two-letter ISO-ish code for the `dir` attribute and typing animation. */
  langCode: "hi" | "en" | "ar";
  /** Human label shown beside the message bubble. */
  langLabel: string;
  text: string;
};

type Conversation = {
  id: "hindi" | "english" | "arabic";
  /** Label shown on the language toggle button. */
  buttonLabel: string;
  /** What goes inside the status pill while this conversation is playing. */
  listeningLabel: string;
  messages: ConversationMessage[];
};

/**
 * One clinical encounter, three language demos. All three converge into the
 * same structured note below — the point of the visual is that the system
 * understands the patient's case regardless of which language the patient
 * and doctor speak in.
 */
const CONVERSATIONS: Conversation[] = [
  {
    id: "hindi",
    buttonLabel: "हिंदी",
    listeningLabel: "Listening · Hindi detected",
    messages: [
      {
        speaker: "patient",
        langCode: "hi",
        langLabel: "Hindi",
        text: "हेलो डॉक्टर, मेरा कीमोथेरेपी चल रहा है और उसकी वजह से मुझे मितली और कमजोरी हो रही है।",
      },
      {
        speaker: "doctor",
        langCode: "hi",
        langLabel: "Hindi",
        text: "हाँ, आपको पैक्लिटैक्सेल दवा के रेजीमेन की वजह से यह हो सकता है।",
      },
    ],
  },
  {
    id: "english",
    buttonLabel: "English",
    listeningLabel: "Listening · English detected",
    messages: [
      {
        speaker: "doctor",
        langCode: "en",
        langLabel: "English",
        text: "When was your last chemotherapy protocol, and when is the next one scheduled?",
      },
      {
        speaker: "patient",
        langCode: "en",
        langLabel: "English",
        text: "My last protocol was last week, and the next one is scheduled for next Monday. I hope there is not much traffic then.",
      },
    ],
  },
  {
    id: "arabic",
    buttonLabel: "العربية",
    listeningLabel: "Listening · Arabic detected",
    messages: [
      {
        speaker: "doctor",
        langCode: "ar",
        langLabel: "Arabic",
        text: "حسنًا، سأصف لك دواء Ondem للغثيان، وأيضًا Becosules للضعف.",
      },
      {
        speaker: "patient",
        langCode: "ar",
        langLabel: "Arabic",
        text: "حسنًا دكتور، شكرًا لك. أفراد عائلتي أيضًا ينصحونني بأخذ قسط أكبر من الراحة.",
      },
      {
        speaker: "doctor",
        langCode: "ar",
        langLabel: "Arabic",
        text: "نعم بالتأكيد، خذ قسطًا من الراحة واشرب كمية أكبر من الماء.",
      },
    ],
  },
];

const COMBINED_NOTE = [
  {
    label: "Chief Complaint",
    text: "Nausea and weakness during ongoing chemotherapy.",
  },
  {
    label: "History of Present Illness",
    text: "Patient currently on Paclitaxel chemotherapy regimen. Last cycle was 7 days prior; next cycle is scheduled for next Monday.",
  },
  {
    label: "Assessment and Plan",
    text: "Symptoms consistent with side effects of Paclitaxel. Continue scheduled chemotherapy regimen with symptomatic support.",
  },
  {
    label: "Prescription",
    text: "Tab. Ondem 4 mg PRN for nausea. Tab. Becosules once daily for general support.",
  },
  {
    label: "Advice",
    text: "Adequate rest. Increased oral fluid intake.",
  },
];

// ---------------------------------------------------------------------------
// Timing knobs (tweak here, not in the JSX)
// ---------------------------------------------------------------------------

/** Per-character type delay (ms). Small jitter is added on top. */
const TYPING_BASE_MS = 24;
/** Pause between two consecutive messages (ms). */
const MESSAGE_GAP_MS = 600;
/** Pause between the last message finishing and the note starting to fill in. */
const NOTE_DELAY_MS = 900;
/** How long each note field takes to "fill" after the previous one starts. */
const NOTE_STAGGER_MS = 320;
/** How long the completed state holds before we move to the next conversation. */
const HOLD_MS = 6500;
/** Bars in the waveform strip. */
const WAVE_BAR_COUNT = 56;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroVisual() {
  const [activeId, setActiveId] = useState<Conversation["id"]>("hindi");
  /** How many characters of each message have been "typed" so far. */
  const [messageProgress, setMessageProgress] = useState<number[]>([]);
  /** Per-field visibility flags for the right-hand note. */
  const [notesVisible, setNotesVisible] = useState<boolean[]>(
    new Array(COMBINED_NOTE.length).fill(false),
  );
  /** "listening" | "structuring" | "ready" — drives the status pill copy. */
  const [phase, setPhase] = useState<"listening" | "structuring" | "ready">(
    "listening",
  );

  // Suppress auto-advance once the visitor clicks a language pill. Lets them
  // dwell on whichever language they're interested in.
  const userPickedRef = useRef(false);

  const activeConversation = useMemo(
    () => CONVERSATIONS.find((c) => c.id === activeId) ?? CONVERSATIONS[0],
    [activeId],
  );

  // ----- main animation loop ------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(() => resolve(), ms);
        timers.push(t);
      });

    const run = async () => {
      // Reset for the active conversation.
      setPhase("listening");
      setMessageProgress(new Array(activeConversation.messages.length).fill(0));
      setNotesVisible(new Array(COMBINED_NOTE.length).fill(false));

      // Type each message in turn.
      for (let m = 0; m < activeConversation.messages.length; m++) {
        const message = activeConversation.messages[m];
        for (let ch = 1; ch <= message.text.length; ch++) {
          if (cancelled) return;
          // Bias to a steady rate but jitter a little so it feels less robotic.
          await wait(TYPING_BASE_MS + Math.random() * 20);
          setMessageProgress((prev) => {
            if (prev[m] === ch) return prev;
            const next = [...prev];
            next[m] = ch;
            return next;
          });
        }
        await wait(MESSAGE_GAP_MS);
      }

      // Conversation finished — generate the note.
      if (cancelled) return;
      setPhase("structuring");
      await wait(NOTE_DELAY_MS);

      for (let i = 0; i < COMBINED_NOTE.length; i++) {
        if (cancelled) return;
        await wait(NOTE_STAGGER_MS);
        setNotesVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }
      setPhase("ready");

      // Hold the finished frame, then advance to the next language (unless
      // the visitor explicitly picked one).
      await wait(HOLD_MS);
      if (cancelled || userPickedRef.current) return;
      const idx = CONVERSATIONS.findIndex((c) => c.id === activeConversation.id);
      const next = CONVERSATIONS[(idx + 1) % CONVERSATIONS.length];
      setActiveId(next.id);
    };

    run();

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [activeConversation]);

  // ----- waveform animation -------------------------------------------------
  // The waveform is purely decorative — it lives in its own ref-driven block
  // because we don't want React reconciliation on 56 bars at 60fps.
  const waveformRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

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
      b.style.background = "linear-gradient(180deg, #607ADC 0%, #9B2F91 100%)";
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

  // ----- handlers -----------------------------------------------------------
  const handlePickLanguage = (id: Conversation["id"]) => {
    userPickedRef.current = true;
    setActiveId(id);
  };

  const statusCopy =
    phase === "ready"
      ? "Note ready. Push to HMIS."
      : phase === "structuring"
        ? "Structuring clinical note…"
        : activeConversation.listeningLabel;

  return (
    <div className="relative z-[2] w-full">
      {/* Soft pink glow behind the console */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-12 -inset-y-10 -z-10 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(255,107,214,0.16),transparent_60%)] blur-2xl"
      />

      <div className="overflow-hidden rounded-[24px] border border-indigo/10 bg-white/95 shadow-[0_24px_60px_rgba(11,26,54,0.14),0_8px_24px_rgba(36,63,134,0.08)] backdrop-blur">
        {/* Top bar — language pills replace the macOS-style window dots. */}
        <div className="flex flex-wrap items-center gap-2 border-b border-indigo/10 bg-canvas/60 px-5 py-3">
          <p className="mr-2 font-mono text-[11px] tracking-wide text-slate">
            VoiceDocAI · Clinical Documentation
          </p>

          <div
            className="flex items-center gap-1.5"
            role="tablist"
            aria-label="Demo language"
          >
            {CONVERSATIONS.map((c) => {
              const isActive = c.id === activeConversation.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handlePickLanguage(c.id)}
                  className={
                    isActive
                      ? "rounded-full bg-navy px-3 py-1 text-[11px] font-semibold text-white"
                      : "rounded-full border border-indigo/15 bg-white px-3 py-1 text-[11px] font-semibold text-navy/70 transition-colors hover:bg-indigo/5 hover:text-navy"
                  }
                >
                  {c.buttonLabel}
                </button>
              );
            })}
          </div>

          <span
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-magenta/25 bg-magenta/10 px-2.5 py-1 text-[11px] font-semibold text-magenta"
            aria-live="polite"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-magenta"
              style={{ animation: "pulse 1.5s ease-in-out infinite" }}
              aria-hidden
            />
            {statusCopy}
          </span>
        </div>

        {/* Body — two columns */}
        <div className="grid min-h-[460px] md:grid-cols-2">
          {/* LEFT: live conversation */}
          <div className="flex flex-col gap-4 border-b border-indigo/10 bg-gradient-to-b from-pale-blue/40 to-transparent p-7 md:border-b-0 md:border-r">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo">
              <span
                className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-md bg-gradient-to-br from-indigo/15 to-magenta/15 text-[10px]"
                aria-hidden
              >
                🎙
              </span>
              Conversation
            </p>

            {/* Waveform — visual sound cue, kept from the previous design */}
            <div
              ref={waveformRef}
              className="relative flex h-[64px] items-center justify-center gap-[4px] overflow-hidden rounded-[14px] border border-indigo/10 bg-white/55 px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              aria-hidden
            />

            {/* Chat bubbles. Each message reveals char-by-char via messageProgress. */}
            <ul className="relative flex-1 space-y-3 overflow-hidden rounded-[14px] border border-indigo/10 bg-white/55 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              {activeConversation.messages.map((msg, i) => {
                const progress = messageProgress[i] ?? 0;
                const visibleText = msg.text.slice(0, progress);
                const remainingText = msg.text.slice(progress);
                const isTyping = progress > 0 && progress < msg.text.length;
                const isStarted = progress > 0;
                const isPatient = msg.speaker === "patient";

                return (
                  <li
                    key={i}
                    className={
                      isPatient
                        ? "flex flex-col items-start"
                        : "flex flex-col items-end"
                    }
                    style={{
                      opacity: isStarted ? 1 : 0.25,
                      transform: isStarted ? "translateY(0)" : "translateY(4px)",
                      transition: "opacity 200ms ease, transform 200ms ease",
                    }}
                  >
                    <span
                      className={
                        "mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] " +
                        (isPatient ? "text-indigo" : "text-magenta")
                      }
                    >
                      {isPatient ? "Patient" : "Doctor"} · {msg.langLabel}
                    </span>
                    <div
                      dir={msg.langCode === "ar" ? "rtl" : "ltr"}
                      className={
                        "max-w-[95%] rounded-[14px] px-3.5 py-2 text-[13.5px] leading-relaxed " +
                        (isPatient
                          ? "rounded-tl-sm bg-white text-ink shadow-sm"
                          : "rounded-tr-sm bg-navy text-white shadow-sm")
                      }
                    >
                      {visibleText}
                      {isTyping ? (
                        <span
                          className={
                            "mx-0.5 inline-block h-[1em] w-0.5 translate-y-[2px] align-middle " +
                            (isPatient ? "bg-magenta" : "bg-white")
                          }
                          style={{ animation: "blink 1s step-end infinite" }}
                          aria-hidden
                        />
                      ) : null}
                      {/* Reserve final size up front so the bubble never resizes mid-type */}
                      <span aria-hidden className="opacity-0">
                        {remainingText || (progress === 0 ? msg.text : " ")}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* RIGHT: generated clinical note */}
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
              {COMBINED_NOTE.map((f, i) => {
                const shown = notesVisible[i];
                return (
                  <div key={f.label} className="relative">
                    {/* Real content stays in the layout at all times so the note
                        box keeps a fixed height instead of growing as fields fill. */}
                    <div
                      className="transition-all duration-500 ease-clinical"
                      style={{
                        opacity: shown ? 1 : 0,
                        transform: shown ? "translateY(0)" : "translateY(8px)",
                      }}
                    >
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-magenta">
                        {f.label}
                      </p>
                      <p className="text-[13.5px] leading-relaxed text-ink">
                        {f.text}
                      </p>
                    </div>
                    {/* Skeleton shimmer overlaid until this field is generated. */}
                    {!shown ? (
                      <div
                        className="pointer-events-none absolute inset-0 flex flex-col gap-1.5 pt-[18px]"
                        aria-hidden
                      >
                        <div
                          className="h-2 w-[90%] rounded bg-[linear-gradient(90deg,rgba(36,63,134,0.08)_25%,rgba(155,47,145,0.10)_50%,rgba(36,63,134,0.08)_75%)] bg-[length:200%_100%]"
                          style={{ animation: "shimmer 1.4s ease-in-out infinite" }}
                        />
                        <div
                          className="h-2 w-[60%] rounded bg-[linear-gradient(90deg,rgba(36,63,134,0.08)_25%,rgba(155,47,145,0.10)_50%,rgba(36,63,134,0.08)_75%)] bg-[length:200%_100%]"
                          style={{ animation: "shimmer 1.4s ease-in-out infinite" }}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <div className="mt-1 flex items-center gap-2.5">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 transition-all duration-500 ease-clinical"
                  style={{
                    opacity: phase === "ready" ? 1 : 0,
                    transform: phase === "ready" ? "translateY(0)" : "translateY(8px)",
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
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 50%; }
          100% { background-position: -200% 50%; }
        }
      `}</style>
    </div>
  );
}
