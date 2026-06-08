import type { Field } from "payload";

export const reviewStatusField: Field = {
  name: "reviewStatus",
  type: "select",
  defaultValue: "none",
  options: [
    { label: "None", value: "none" },
    { label: "Pending review", value: "pending_review" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ],
  admin: {
    position: "sidebar",
    description:
      "Editors submit drafts for review. Super admins publish after approval.",
    readOnly: true,
  },
};

export const reviewStatusValues = [
  "none",
  "pending_review",
  "approved",
  "rejected",
] as const;

export type ReviewStatus = (typeof reviewStatusValues)[number];
