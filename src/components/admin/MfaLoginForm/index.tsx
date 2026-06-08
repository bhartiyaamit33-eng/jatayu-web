"use client";

import React, { useState } from "react";
import { Button, toast, useConfig, useTranslation } from "@payloadcms/ui";
import { formatAdminURL, getSafeRedirect } from "payload/shared";
import { useRouter } from "next/navigation";

type LoginStep = "credentials" | "mfa";

export function MfaLoginForm() {
  const { config } = useConfig();
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    admin: {
      routes: { forgot: forgotRoute },
    },
    routes: { admin: adminRoute },
  } = config;

  const redirectParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect")
      : null;

  const redirectTo = getSafeRedirect({
    fallbackTo: adminRoute,
    redirectTo: redirectParam ?? adminRoute,
  });

  const handleCredentials = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await response.json()) as {
        requiresMfa?: boolean;
        challengeToken?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(json.error ?? "Login failed");
      }

      if (json.requiresMfa) {
        setChallengeToken(json.challengeToken ?? "");
        setStep("mfa");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMfa = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          totpCode,
          challengeToken,
        }),
      });
      const json = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(json.error ?? "Invalid authentication code");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Invalid authentication code",
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === "mfa") {
    return (
      <form className="login__form jatayu-mfa-login" onSubmit={handleMfa}>
        <p className="jatayu-mfa-login__hint">
          Enter the 6-digit code from your authenticator app.
        </p>
        <label htmlFor="totp-code">Authentication code</label>
        <input
          id="totp-code"
          inputMode="numeric"
          maxLength={6}
          onChange={(event) => setTotpCode(event.target.value)}
          required
          value={totpCode}
        />
        <Button disabled={loading} size="large" type="submit">
          {loading ? "Verifying…" : "Verify & sign in"}
        </Button>
        <Button
          buttonStyle="secondary"
          disabled={loading}
          onClick={() => {
            setStep("credentials");
            setTotpCode("");
          }}
          type="button"
        >
          Back
        </Button>
      </form>
    );
  }

  return (
    <form className="login__form jatayu-mfa-login" onSubmit={handleCredentials}>
      <div className="login__form__inputWrap">
        <label htmlFor="login-email">{t("general:email")}</label>
        <input
          autoComplete="email"
          id="login-email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
        <label htmlFor="login-password">{t("general:password")}</label>
        <input
          autoComplete="current-password"
          id="login-password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      <a
        className="jatayu-mfa-login__forgot"
        href={formatAdminURL({ adminRoute, path: forgotRoute })}
      >
        {t("authentication:forgotPasswordQuestion")}
      </a>
      <Button disabled={loading} size="large" type="submit">
        {loading ? "Signing in…" : t("authentication:login")}
      </Button>
    </form>
  );
}
