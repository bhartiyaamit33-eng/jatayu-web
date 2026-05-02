import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  conciseAnswer: string;
  children?: ReactNode;
};

export function PageIntro({
  eyebrow,
  title,
  conciseAnswer,
  children,
}: PageIntroProps) {
  return (
    <header className="border-b border-indigo/10 bg-grad-hero pb-16 pt-24 md:pb-20 md:pt-28">
      <div className="container-page">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-navy md:text-5xl text-balance">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl rounded-xl border border-indigo/10 bg-white/70 px-4 py-3 text-sm leading-relaxed text-navy md:text-base">
          <span className="font-semibold text-indigo">Concise answer:</span>{" "}
          {conciseAnswer}
        </p>
        {children}
      </div>
    </header>
  );
}
