"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      className="rounded-lg border border-indigo/20 px-5 py-2.5 text-sm font-semibold text-navy"
      onClick={() => window.print()}
    >
      Print this page
    </button>
  );
}
