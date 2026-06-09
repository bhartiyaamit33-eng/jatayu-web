import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { superAdminOnly } from "@/lib/access";
import { requireMfaVerification } from "@/lib/mfa-hooks";
import { enforceSingleActiveSession } from "@/lib/session-hooks";

const stripMfaSecretUnlessAllowed: CollectionBeforeChangeHook = async ({
  data,
  req,
}) => {
  if (req.context?.allowMfaSecretWrite) return data;
  if (data && "mfaSecret" in data) {
    delete data.mfaSecret;
  }
  return data;
};

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 60 * 60 * 24, // 24 hours; session revoked on browser/tab close
    useSessions: true,
    cookies: {
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["fullName", "email", "role", "mfaEnabled"],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: superAdminOnly,
    update: ({ req, id }) => {
      if (req.user?.role === "super_admin") return true;
      return Boolean(req.user?.id && String(req.user.id) === String(id));
    },
    delete: superAdminOnly,
  },
  hooks: {
    beforeLogin: [requireMfaVerification],
    afterLogin: [enforceSingleActiveSession],
    beforeChange: [stripMfaSecretUnlessAllowed],
  },
  fields: [
    { name: "fullName", type: "text", required: true },
    {
      name: "role",
      type: "select",
      defaultValue: "editor",
      required: true,
      options: [
        { label: "Super admin", value: "super_admin" },
        { label: "Editor", value: "editor" },
      ],
      access: {
        read: ({ req }) => Boolean(req.user),
        update: ({ req }) => req.user?.role === "super_admin",
      },
    },
    {
      name: "mfaEnabled",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Enable via the MFA setup panel on your account page.",
      },
    },
    {
      name: "mfaSecret",
      type: "text",
      admin: { hidden: true },
      access: {
        read: () => false,
        update: ({ req }) => Boolean(req.context?.allowMfaSecretWrite),
      },
    },
    {
      name: "mfaSetup",
      type: "ui",
      admin: {
        components: {
          Field: "/src/components/admin/MfaSetupField#MfaSetupField",
        },
      },
    },
  ],
};
