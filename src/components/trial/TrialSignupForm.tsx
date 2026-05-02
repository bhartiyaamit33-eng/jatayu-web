"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export function TrialSignupForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const specialty = fd.get("specialty")?.toString().trim();
    const payload = {
      fullName: fd.get("fullName")?.toString().trim(),
      workEmail: fd.get("workEmail")?.toString().trim(),
      phone: fd.get("phone")?.toString().trim(),
      role: fd.get("role")?.toString(),
      specialty: specialty || undefined,
      hospitalOrCompany: fd.get("hospitalOrCompany")?.toString().trim(),
      country: fd.get("country")?.toString().trim(),
      password: fd.get("password")?.toString(),
    };

    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Unable to submit trial request.");
      }
      setStatus("success");
      setMessage(
        "Thank you—your trial request is logged. Wire Postgres + Gmail SMTP to activate provisioning and lifecycle emails.",
      );
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Submission failed.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-2xl border border-indigo/10 bg-white p-8 shadow-card md:grid-cols-2"
      noValidate
    >
      <div className="md:col-span-2">
        <label className="text-xs font-semibold text-navy" htmlFor="fullName">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          autoComplete="name"
          className="mt-2 w-full rounded-lg border border-indigo/15 px-4 py-2.5 text-sm outline-none ring-indigo/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-navy" htmlFor="workEmail">
          Work email
        </label>
        <input
          id="workEmail"
          name="workEmail"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full rounded-lg border border-indigo/15 px-4 py-2.5 text-sm outline-none ring-indigo/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-navy" htmlFor="phone">
          Phone (with country code)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+91 ..."
          className="mt-2 w-full rounded-lg border border-indigo/15 px-4 py-2.5 text-sm outline-none ring-indigo/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-navy" htmlFor="role">
          Role
        </label>
        <select
          id="role"
          name="role"
          required
          className="mt-2 w-full rounded-lg border border-indigo/15 px-4 py-2.5 text-sm outline-none ring-indigo/30 focus:ring-2"
        >
          <option value="">Select…</option>
          <option value="doctor">Doctor</option>
          <option value="hospital_admin">Hospital admin</option>
          <option value="ehr_partner">EHR / HMIS partner</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-navy" htmlFor="specialty">
          Specialty (if doctor)
        </label>
        <input
          id="specialty"
          name="specialty"
          autoComplete="organization-title"
          className="mt-2 w-full rounded-lg border border-indigo/15 px-4 py-2.5 text-sm outline-none ring-indigo/30 focus:ring-2"
        />
      </div>
      <div className="md:col-span-2">
        <label
          className="text-xs font-semibold text-navy"
          htmlFor="hospitalOrCompany"
        >
          Hospital or company
        </label>
        <input
          id="hospitalOrCompany"
          name="hospitalOrCompany"
          required
          autoComplete="organization"
          className="mt-2 w-full rounded-lg border border-indigo/15 px-4 py-2.5 text-sm outline-none ring-indigo/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-navy" htmlFor="country">
          Country
        </label>
        <input
          id="country"
          name="country"
          required
          autoComplete="country-name"
          className="mt-2 w-full rounded-lg border border-indigo/15 px-4 py-2.5 text-sm outline-none ring-indigo/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-navy" htmlFor="password">
          Password (trial account)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className="mt-2 w-full rounded-lg border border-indigo/15 px-4 py-2.5 text-sm outline-none ring-indigo/30 focus:ring-2"
        />
      </div>
      <div className="md:col-span-2 flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-grad-accent px-6 py-3 font-display text-sm font-semibold text-white disabled:opacity-60"
        >
          {status === "loading" ? "Submitting…" : "Start trial request"}
        </button>
        {message ? (
          <p
            className={`text-sm ${status === "success" ? "text-emerald-700" : "text-red-700"}`}
            role="status"
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
