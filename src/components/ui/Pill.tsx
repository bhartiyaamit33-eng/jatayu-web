import type { ReactNode } from "react";

type Tone = "neutral" | "info" | "success" | "warning";

const toneClasses: Record<Tone, string> = {
  neutral: "border-indigo/15 bg-white text-navy",
  info: "border-indigo/30 bg-pale-blue text-indigo",
  success: "border-emerald-300/50 bg-emerald-50 text-emerald-800",
  warning: "border-amber-300 bg-amber-50 text-amber-900",
};

type PillProps = {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Pill({ tone = "neutral", icon, children, className }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[tone]} ${className ?? ""}`}
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      {children}
    </span>
  );
}
