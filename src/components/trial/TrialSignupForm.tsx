"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";
type Errors = Partial<Record<string, string>>;

const FIELD_BASE =
  "mt-2 w-full rounded-lg border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo focus:ring-2 focus:ring-indigo/30";

function fieldClass(hasError: boolean) {
  return `${FIELD_BASE} ${hasError ? "border-red-400 ring-1 ring-red-200" : "border-indigo/15"}`;
}

function validate(payload: Record<string, string>): Errors {
  const errors: Errors = {};
  const required = [
    "fullName",
    "workEmail",
    "phone",
    "role",
    "hospitalOrCompany",
    "country",
    "password",
  ];
  required.forEach((k) => {
    if (!payload[k] || !payload[k].trim()) {
      errors[k] = "Required";
    }
  });
  if (payload.workEmail && !/.+@.+\..+/.test(payload.workEmail)) {
    errors.workEmail = "Use a valid work email";
  }
  if (payload.phone && !/^\+\d{1,4}[\s.-]?\d{6,14}$/.test(payload.phone.trim())) {
    errors.phone = "Include country code, e.g. +91 9876543210";
  }
  if (payload.password && payload.password.length < 10) {
    errors.password = "At least 10 characters";
  }
  return errors;
}

export function TrialSignupForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverMessage, setServerMessage] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerMessage("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, string> = {};
    fd.forEach((v, k) => {
      payload[k] = String(v);
    });
    const validation = validate(payload);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setStatus("error");
      setServerMessage("Please fix the highlighted fields and try again.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: payload.fullName,
          workEmail: payload.workEmail,
          phone: payload.phone,
          role: payload.role,
          specialty: payload.specialty || undefined,
          hospitalOrCompany: payload.hospitalOrCompany,
          country: payload.country,
          password: payload.password,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong on our end. Please try again.");
      }
      setStatus("success");
      setServerMessage(
        "Thanks. Your trial request is in. Check your work email for next steps within a business day.",
      );
      form.reset();
    } catch (err) {
      setStatus("error");
      setServerMessage(err instanceof Error ? err.message : "Submission failed.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-2xl border border-indigo/10 bg-white p-6 shadow-card md:p-8 md:grid-cols-2"
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
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className={fieldClass(Boolean(errors.fullName))}
        />
        {errors.fullName ? (
          <p id="fullName-error" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.fullName}
          </p>
        ) : null}
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
          aria-invalid={Boolean(errors.workEmail)}
          aria-describedby={errors.workEmail ? "workEmail-error" : undefined}
          className={fieldClass(Boolean(errors.workEmail))}
        />
        {errors.workEmail ? (
          <p id="workEmail-error" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.workEmail}
          </p>
        ) : null}
      </div>

      <div>
        <label className="text-xs font-semibold text-navy" htmlFor="phone">
          Phone with country code
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 9876543210"
          pattern="^\+\d{1,4}[\s.\-]?\d{6,14}$"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : "phone-help"}
          className={fieldClass(Boolean(errors.phone))}
        />
        {errors.phone ? (
          <p id="phone-error" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.phone}
          </p>
        ) : (
          <p id="phone-help" className="mt-1.5 text-xs text-slate">
            Start with your country code, for example +91 for India.
          </p>
        )}
      </div>

      <div>
        <label className="text-xs font-semibold text-navy" htmlFor="role">
          Role
        </label>
        <select
          id="role"
          name="role"
          required
          aria-invalid={Boolean(errors.role)}
          aria-describedby={errors.role ? "role-error" : undefined}
          className={fieldClass(Boolean(errors.role))}
          defaultValue=""
        >
          <option value="" disabled>
            Choose one
          </option>
          <option value="doctor">Doctor</option>
          <option value="hospital_admin">Hospital admin</option>
          <option value="ehr_partner">EHR or HMIS partner</option>
          <option value="other">Other</option>
        </select>
        {errors.role ? (
          <p id="role-error" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.role}
          </p>
        ) : null}
      </div>

      <div>
        <label className="text-xs font-semibold text-navy" htmlFor="specialty">
          Specialty <span className="font-normal text-slate">(optional, doctors only)</span>
        </label>
        <input
          id="specialty"
          name="specialty"
          autoComplete="organization-title"
          className={fieldClass(false)}
        />
      </div>

      <div className="md:col-span-2">
        <label className="text-xs font-semibold text-navy" htmlFor="hospitalOrCompany">
          Hospital or company
        </label>
        <input
          id="hospitalOrCompany"
          name="hospitalOrCompany"
          required
          autoComplete="organization"
          aria-invalid={Boolean(errors.hospitalOrCompany)}
          aria-describedby={errors.hospitalOrCompany ? "hosp-error" : undefined}
          className={fieldClass(Boolean(errors.hospitalOrCompany))}
        />
        {errors.hospitalOrCompany ? (
          <p id="hosp-error" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.hospitalOrCompany}
          </p>
        ) : null}
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
          aria-invalid={Boolean(errors.country)}
          aria-describedby={errors.country ? "country-error" : undefined}
          className={fieldClass(Boolean(errors.country))}
        />
        {errors.country ? (
          <p id="country-error" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.country}
          </p>
        ) : null}
      </div>

      <div>
        <label className="text-xs font-semibold text-navy" htmlFor="password">
          Choose a password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : "password-help"}
          className={fieldClass(Boolean(errors.password))}
        />
        {errors.password ? (
          <p id="password-error" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.password}
          </p>
        ) : (
          <p id="password-help" className="mt-1.5 text-xs text-slate">
            At least 10 characters. You can change it later.
          </p>
        )}
      </div>

      <div className="md:col-span-2 flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-grad-accent px-6 py-3 font-display text-sm font-semibold text-white shadow-[0_8px_24px_rgba(155,47,145,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Sending..." : "Request my trial"}
        </button>
        {serverMessage ? (
          <p
            role="status"
            aria-live="polite"
            className={`rounded-lg border px-4 py-3 text-sm ${
              status === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : "border-red-300 bg-red-50 text-red-900"
            }`}
          >
            {serverMessage}
          </p>
        ) : null}
        <p className="text-xs text-slate">
          By requesting access you agree to our terms and acknowledge our privacy notice.
          We will not share your details with third parties.
        </p>
      </div>
    </form>
  );
}
