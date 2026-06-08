import type { CollectionConfig } from "payload";
import { superAdminOnly } from "@/lib/access";

export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  labels: {
    singular: "Audit log",
    plural: "Audit logs",
  },
  admin: {
    useAsTitle: "summary",
    defaultColumns: [
      "createdAt",
      "action",
      "userName",
      "collectionSlug",
      "globalSlug",
      "documentTitle",
    ],
    description:
      "Immutable history of CMS changes: who changed what, and when.",
  },
  access: {
    read: superAdminOnly,
    create: () => false,
    update: () => false,
    delete: superAdminOnly,
  },
  fields: [
    {
      name: "action",
      type: "select",
      required: true,
      options: [
        { label: "Create", value: "create" },
        { label: "Update", value: "update" },
        { label: "Delete", value: "delete" },
        { label: "Publish", value: "publish" },
        { label: "Submit for review", value: "submit_review" },
        { label: "Reject", value: "reject" },
      ],
    },
    { name: "collectionSlug", type: "text" },
    { name: "globalSlug", type: "text" },
    { name: "documentId", type: "text" },
    { name: "documentTitle", type: "text", required: true },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: { readOnly: true },
    },
    { name: "userEmail", type: "email", required: true },
    { name: "userName", type: "text", required: true },
    { name: "summary", type: "textarea", required: true },
  ],
};
