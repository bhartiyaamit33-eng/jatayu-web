"use client";

import React, { useEffect } from "react";
import { useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";

/**
 * When the admin tab or browser closes, revoke the server-side session so the
 * login cookie cannot be reused on another machine without signing in again.
 */
export function SessionEndProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { config } = useConfig();
  const {
    admin: { user: userSlug },
    routes: { api: apiRoute },
  } = config;

  useEffect(() => {
    const logoutUrl = formatAdminURL({
      apiRoute,
      path: `/${userSlug}/logout`,
    });

    const onPageHide = (event: PageTransitionEvent) => {
      // Skip when the page enters the back/forward cache — the user may return.
      if (event.persisted) return;
      navigator.sendBeacon(
        logoutUrl,
        new Blob([], { type: "application/json" }),
      );
    };

    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [apiRoute, userSlug]);

  return <>{children}</>;
}
