"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth, useConfig, useTranslation } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useRouter } from "next/navigation";

export function AccountMenu() {
  const { user, logOut } = useAuth();
  const { config } = useConfig();
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const {
    admin: {
      routes: { account: accountRoute, logout: logoutRoute },
    },
    routes: { admin: adminRoute },
  } = config;

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  if (!user) return null;

  const displayName =
    (user.fullName as string | undefined) ||
    (user.email as string | undefined) ||
    "Account";
  const roleLabel =
    user.role === "super_admin" ? "Super admin" : "Editor";

  const accountHref = formatAdminURL({ adminRoute, path: accountRoute });
  const logoutHref = formatAdminURL({ adminRoute, path: logoutRoute });

  const handleLogout = async () => {
    setOpen(false);
    await logOut();
    router.push(logoutHref);
  };

  return (
    <div className="jatayu-account-menu" ref={rootRef}>
      <button
        type="button"
        className="jatayu-account-menu__trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="jatayu-account-menu__avatar" aria-hidden>
          {displayName.charAt(0).toUpperCase()}
        </span>
      </button>

      {open ? (
        <div className="jatayu-account-menu__panel" role="menu">
          <div className="jatayu-account-menu__identity">
            <p className="jatayu-account-menu__name">{displayName}</p>
            <p className="jatayu-account-menu__email">{user.email as string}</p>
            <p className="jatayu-account-menu__role">{roleLabel}</p>
          </div>

          <a
            className="jatayu-account-menu__item"
            href={accountHref}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            {t("authentication:account")}
          </a>

          <button
            type="button"
            className="jatayu-account-menu__item jatayu-account-menu__item--danger"
            role="menuitem"
            onClick={handleLogout}
          >
            {t("authentication:logOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
