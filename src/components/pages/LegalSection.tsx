import type { ReactNode } from "react";

/**
 * LegalSection
 * ------------
 * Shared styling for sections inside long-form legal pages
 * (/privacy, /terms, /cancellation).
 *
 * Each section gets:
 *   - An optional `id` so the table of contents can deep-link to it.
 *   - A consistent heading hierarchy (h2 default, override with `as`).
 *   - Prose-friendly spacing for paragraphs, lists, and sub-headings.
 *
 * Long legal text is kept narrow (max-w-3xl in the parent) for line-length
 * readability — wide columns of legal copy are unreadable.
 */
type LegalSectionProps = {
  id?: string;
  number?: string;
  heading: string;
  as?: "h2" | "h3";
  children: ReactNode;
};

export function LegalSection({
  id,
  number,
  heading,
  as = "h2",
  children,
}: LegalSectionProps) {
  const Heading = as;
  const headingClass =
    as === "h2"
      ? "font-display text-xl font-bold text-navy md:text-2xl"
      : "font-display text-lg font-semibold text-navy";

  return (
    <section id={id} className="scroll-mt-28">
      <Heading className={headingClass}>
        {number ? (
          <span className="mr-2 text-magenta">{number}</span>
        ) : null}
        {heading}
      </Heading>
      <div className="mt-3 space-y-4 text-sm leading-relaxed text-navy/85 md:text-[15px] [&_a]:font-semibold [&_a]:text-indigo [&_a:hover]:underline [&_strong]:font-semibold [&_strong]:text-navy [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5">
        {children}
      </div>
    </section>
  );
}
