/**
 * KEM pilot data visualisations rebuilt as inline SVG / CSS.
 * Source numbers (KEM pilot dec 2025):
 *   Manual ~5 min vs VoiceDocAI ~1 min documentation time.
 *   Specialties: Dermatology 20, Paediatrics 5, Orthopaedics 24,
 *                Surgical Gastroenterology 23, Radiology 28 (= 100%).
 *   Languages:   English 42, Hindi 26, Marathi 8, Eng-Hin Mix 18, Hindi-Marathi Mix 5 (≈ 99%).
 *   Clinician ratings (5-point):
 *     Adoption 4.7, Multilingual 4.6, Noise handling 4.2, Speed 4.1.
 */

const SPECIALTY = [
  { label: "Radiology", value: 28, color: "#2F5597" },
  { label: "Paediatrics", value: 5, color: "#7C4481" },
  { label: "Surgical Gastroenterology", value: 23, color: "#8B3A9E" },
  { label: "Orthopaedics", value: 24, color: "#243F86" },
  { label: "Dermatology", value: 20, color: "#5F6B7A" },
];

const LANGUAGE = [
  { label: "English", value: 42, color: "#243F86" },
  { label: "Hindi", value: 26, color: "#7C4481" },
  { label: "Marathi", value: 8, color: "#8B3A9E" },
  { label: "Eng-Hin Mix", value: 18, color: "#2F5597" },
  { label: "Hindi-Marathi Mix", value: 5, color: "#D0D1EC" },
];

const RATINGS = [
  { label: "Ease of adoption", score: 4.7 },
  { label: "Multilingual capture", score: 4.6 },
  { label: "Noise handling", score: 4.2 },
  { label: "Documentation speed", score: 4.1 },
];

/* Slice math: build SVG path arcs for a 100% pie */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function PieChart({ data, ariaLabel }: { data: typeof SPECIALTY; ariaLabel: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cursor = 0;
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
      <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0" role="img" aria-label={ariaLabel}>
        <circle cx="60" cy="60" r="54" fill="white" stroke="#EEF4FF" strokeWidth="1" />
        {data.map((d) => {
          const start = (cursor / total) * 360;
          cursor += d.value;
          const end = (cursor / total) * 360;
          return (
            <path
              key={d.label}
              d={arcPath(60, 60, 50, start, end)}
              fill={d.color}
              stroke="white"
              strokeWidth="1.5"
            />
          );
        })}
        <circle cx="60" cy="60" r="22" fill="white" />
      </svg>
      <ul className="grid w-full gap-1.5 text-xs">
        {data.map((d) => (
          <li key={d.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-navy/85">
              <span
                className="inline-block h-2 w-2 rounded-sm"
                style={{ backgroundColor: d.color }}
                aria-hidden
              />
              {d.label}
            </span>
            <span className="font-mono text-navy/70">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimeSavedBar() {
  return (
    <svg viewBox="0 0 220 160" className="h-auto w-full" role="img" aria-label="Manual 5 minutes vs VoiceDocAI 1 minute">
      {/* Y axis ticks */}
      {[0, 1, 2, 3, 4, 5].map((y) => (
        <g key={y}>
          <line x1="38" y1={140 - y * 22} x2="200" y2={140 - y * 22} stroke="#EEF4FF" strokeWidth="1" />
          <text x="30" y={140 - y * 22 + 4} fontSize="9" fill="#5F6B7A" textAnchor="end" fontFamily="ui-monospace, monospace">
            {y}
          </text>
        </g>
      ))}
      {/* Manual: 5 min */}
      <rect x="62" y={140 - 5 * 22} width="40" height={5 * 22} rx="4" fill="#243F86" />
      <text x="82" y="155" fontSize="9" textAnchor="middle" fill="#13233F" fontFamily="ui-monospace, monospace">
        Manual
      </text>
      <text x="82" y={140 - 5 * 22 - 6} fontSize="10" textAnchor="middle" fill="#243F86" fontWeight="700">
        5 min
      </text>
      {/* VoiceDocAI: 1 min */}
      <rect x="140" y={140 - 1 * 22} width="40" height={1 * 22} rx="4" fill="#8B3A9E" />
      <text x="160" y="155" fontSize="9" textAnchor="middle" fill="#13233F" fontFamily="ui-monospace, monospace">
        VoiceDocAI
      </text>
      <text x="160" y={140 - 1 * 22 - 6} fontSize="10" textAnchor="middle" fill="#8B3A9E" fontWeight="700">
        1 min
      </text>
      {/* Axis label */}
      <text x="12" y="76" fontSize="9" fill="#5F6B7A" transform="rotate(-90 12 76)" fontFamily="ui-monospace, monospace">
        Minutes
      </text>
    </svg>
  );
}

function RatingsCard() {
  return (
    <ul className="space-y-3">
      {RATINGS.map((r) => {
        const pct = (r.score / 5) * 100;
        return (
          <li key={r.label}>
            <div className="flex items-center justify-between text-xs text-navy/85">
              <span>{r.label}</span>
              <span className="font-mono text-navy">{r.score.toFixed(1)} / 5</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-pale-blue">
              <div
                className="h-full rounded-full bg-grad-accent"
                style={{ width: `${pct}%` }}
                aria-hidden
              />
            </div>
          </li>
        );
      })}
      <li className="pt-2 text-[11px] font-semibold text-navy/70">
        9 / 9 clinicians recommended continued use.
      </li>
    </ul>
  );
}

export function KemCharts() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <figure className="rounded-2xl border border-indigo/15 bg-white p-5 shadow-card">
        <figcaption className="text-[11px] font-bold uppercase tracking-[0.14em] text-magenta">
          Time per report
        </figcaption>
        <p className="mt-1 text-sm font-semibold text-navy">
          Documentation time, manual vs VoiceDocAI
        </p>
        <div className="mt-3">
          <TimeSavedBar />
        </div>
      </figure>

      <figure className="rounded-2xl border border-indigo/15 bg-white p-5 shadow-card">
        <figcaption className="text-[11px] font-bold uppercase tracking-[0.14em] text-magenta">
          Clinician ratings
        </figcaption>
        <p className="mt-1 text-sm font-semibold text-navy">
          Average 5-point scale (n = 9)
        </p>
        <div className="mt-3">
          <RatingsCard />
        </div>
      </figure>

      <figure className="rounded-2xl border border-indigo/15 bg-white p-5 shadow-card">
        <figcaption className="text-[11px] font-bold uppercase tracking-[0.14em] text-magenta">
          Specialty distribution
        </figcaption>
        <p className="mt-1 text-sm font-semibold text-navy">Reports across 5 departments</p>
        <div className="mt-3">
          <PieChart data={SPECIALTY} ariaLabel="Specialty distribution of reports across Dermatology, Paediatrics, Orthopaedics, Surgical Gastroenterology, Radiology" />
        </div>
      </figure>

      <figure className="rounded-2xl border border-indigo/15 bg-white p-5 shadow-card">
        <figcaption className="text-[11px] font-bold uppercase tracking-[0.14em] text-magenta">
          Language distribution
        </figcaption>
        <p className="mt-1 text-sm font-semibold text-navy">Conversations captured</p>
        <div className="mt-3">
          <PieChart data={LANGUAGE} ariaLabel="Language distribution across English, Hindi, Marathi, English-Hindi Mix, Hindi-Marathi Mix" />
        </div>
      </figure>
    </div>
  );
}
