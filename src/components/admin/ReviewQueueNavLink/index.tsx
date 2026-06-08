"use client";

import React from "react";
import { Link, useAuth, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";

export function ReviewQueueNavLink() {
  const { user } = useAuth();
  const { config } = useConfig();
  const {
    routes: { admin: adminRoute },
  } = config;

  if (user?.role !== "super_admin") return null;

  return (
    <Link
      className="jatayu-review-nav-link"
      href={formatAdminURL({ adminRoute, path: "/review-queue" })}
      prefetch={false}
    >
      Review queue
    </Link>
  );
}
