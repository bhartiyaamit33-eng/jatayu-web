const BAR_HEIGHTS = [
  8, 14, 22, 30, 38, 28, 18, 10, 24, 36, 28, 16, 12, 20, 32, 38, 24, 14, 8, 18,
  28, 34, 22, 12, 8, 20, 30, 38, 26, 16,
];

export function HeroVisual() {
  return (
    <div className="relative z-[2] mt-16 w-full max-w-[900px]">
      <div className="rounded-[20px] border border-indigo/12 bg-white p-6 shadow-elevated">
        <div className="mb-5 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
          <p className="mx-auto font-mono text-[11px] text-slate">
            VoiceDocAI - clinical documentation (illustration, not live audio)
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[14px] border border-indigo/10 bg-canvas p-[18px]">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo/70">
              Conversation waveform
            </p>
            <div className="flex h-12 items-end gap-[3px]" aria-hidden>
              {BAR_HEIGHTS.map((h, i) => (
                <span
                  key={i}
                  className="wave-bar w-[3px] rounded-sm bg-gradient-to-t from-purple to-magenta"
                  style={{
                    height: h,
                    animationDelay: `${i * 0.07}s`,
                  }}
                />
              ))}
            </div>
            <p className="mt-3 text-sm italic leading-relaxed text-slate">
              Multilingual speech becomes structured English fields-filtered for
              ward noise, written for HMIS handoff.
            </p>
          </div>
          <div className="rounded-[14px] border border-indigo/10 bg-canvas p-[18px]">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo/70">
              Structured draft note
            </p>
            <div className="flex flex-col gap-2">
              {[92, 76, 88, 52, 84, 68, 82].map((w, i) => (
                <div
                  key={i}
                  className="h-2.5 rounded bg-indigo/12"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-emerald-300/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
              <span aria-hidden>✓</span> Ready for clinician review
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
