"use client";

import React, { useState } from "react";
import { Button, toast, useAuth } from "@payloadcms/ui";

export function MfaSetupField() {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(Boolean(user?.mfaEnabled));

  if (!user) return null;

  const startEnroll = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/mfa/enroll", {
        method: "POST",
        credentials: "include",
      });
      const json = (await response.json()) as {
        qrCode?: string;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(json.error ?? "Could not start MFA setup");
      }
      setQrCode(json.qrCode ?? null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not start MFA setup",
      );
    } finally {
      setLoading(false);
    }
  };

  const activate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/mfa/activate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(json.error ?? "Invalid authentication code");
      }
      setEnabled(true);
      setQrCode(null);
      setCode("");
      toast.success("Multi-factor authentication enabled");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Invalid authentication code",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jatayu-mfa-setup">
      <h3>Multi-factor authentication</h3>
      <p>
        Scan a QR code with Google Authenticator, Microsoft Authenticator, Authy,
        or any TOTP app. Free to use — no SMS charges.
      </p>

      {enabled ? (
        <p className="jatayu-mfa-setup__enabled">MFA is enabled on your account.</p>
      ) : null}

      {!enabled && !qrCode ? (
        <Button buttonStyle="secondary" disabled={loading} onClick={startEnroll}>
          {loading ? "Preparing…" : "Set up authenticator app"}
        </Button>
      ) : null}

      {!enabled && qrCode ? (
        <div className="jatayu-mfa-setup__enroll">
          <img alt="MFA QR code" src={qrCode} />
          <label htmlFor="mfa-code">Enter the 6-digit code</label>
          <input
            id="mfa-code"
            inputMode="numeric"
            maxLength={6}
            onChange={(event) => setCode(event.target.value)}
            value={code}
          />
          <Button disabled={loading || code.length < 6} onClick={activate}>
            {loading ? "Verifying…" : "Enable MFA"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
