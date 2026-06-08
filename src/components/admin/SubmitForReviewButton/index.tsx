"use client";

import React, { useState } from "react";
import {
  Button,
  toast,
  useAuth,
  useConfig,
  useDocumentInfo,
} from "@payloadcms/ui";
import { requests } from "@payloadcms/ui/utilities/api";
import { formatAdminURL } from "payload/shared";

export function SubmitForReviewButton() {
  const { user } = useAuth();
  const { config } = useConfig();
  const { id, collectionSlug, globalSlug, savedDocumentData } =
    useDocumentInfo();
  const [loading, setLoading] = useState(false);

  if (!user || user.role === "super_admin") return null;

  const reviewStatus = savedDocumentData?.reviewStatus as string | undefined;
  if (reviewStatus === "pending_review") {
    return (
      <span className="jatayu-review-badge">Pending super-admin review</span>
    );
  }

  const {
    routes: { api: apiRoute },
  } = config;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const path = collectionSlug
        ? (`/${collectionSlug}/${id}` as `/${string}`)
        : (`/globals/${globalSlug}` as `/${string}`);

      const response = await requests.patch(
        formatAdminURL({ apiRoute, path }),
        {
          body: JSON.stringify({ reviewStatus: "pending_review" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { errors?: { message?: string }[] }
          | null;
        throw new Error(
          body?.errors?.[0]?.message ?? "Could not submit for review",
        );
      }

      toast.success("Submitted for super-admin review");
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not submit for review",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      buttonStyle="secondary"
      disabled={loading}
      onClick={handleSubmit}
      size="small"
    >
      {loading ? "Submitting…" : "Submit for review"}
    </Button>
  );
}
