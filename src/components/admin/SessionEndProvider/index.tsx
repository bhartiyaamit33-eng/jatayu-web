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

    // pagehide fires on tab close AND same-origin navigations (e.g. Account link).
    // Only revoke the session when the tab is actually going away, not on in-app nav.
    let skipLogoutOnHide = false;

    const markInternalNavigation = () => {
      skipLogoutOnHide = true;
    };

    const onDocumentClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin === window.location.origin) {
          markInternalNavigation();
        }
      } catch {
        // ignore malformed href
      }
    };

    const wrapHistoryMethod = (
      method: "pushState" | "replaceState",
    ): typeof history.pushState => {
      const original = history[method].bind(history);
      return (...args: Parameters<typeof history.pushState>) => {
        markInternalNavigation();
        return original(...args);
      };
    };

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = wrapHistoryMethod("pushState");
    history.replaceState = wrapHistoryMethod("replaceState");

    const onPageHide = (event: PageTransitionEvent) => {
      if (event.persisted) return;
      if (skipLogoutOnHide) {
        skipLogoutOnHide = false;
        return;
      }
      navigator.sendBeacon(
        logoutUrl,
        new Blob([], { type: "application/json" }),
      );
    };

    document.addEventListener("click", onDocumentClick, true);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("pagehide", onPageHide);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [apiRoute, userSlug]);

  return <>{children}</>;
}
