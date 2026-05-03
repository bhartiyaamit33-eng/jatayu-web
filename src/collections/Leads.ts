import type { CollectionConfig } from "payload";

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "workEmail",
    defaultColumns: ["fullName", "workEmail", "hospitalOrCompany", "country", "createdAt", "status"],
    description: "Trial signups submitted from /trial. Reach out within one business day.",
  },
  access: {
    /** Only authenticated CMS users see leads. The public /api/trial route uses an
     * override on the server side to create them without needing auth. */
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "fullName", type: "text", required: true },
    { name: "workEmail", type: "email", required: true, index: true },
    { name: "phone", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      options: [
        { label: "Doctor", value: "doctor" },
        { label: "Hospital admin", value: "hospital_admin" },
        { label: "EHR or HMIS partner", value: "ehr_partner" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "specialty", type: "text" },
    { name: "hospitalOrCompany", type: "text", required: true },
    { name: "country", type: "text", required: true },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Qualified", value: "qualified" },
        { label: "Converted", value: "converted" },
        { label: "Not a fit", value: "not_a_fit" },
      ],
    },
    { name: "notes", type: "textarea" },
    { name: "source", type: "text", defaultValue: "trial-form", admin: { readOnly: true } },
    {
      name: "consent",
      type: "group",
      admin: { description: "Captured at submission time. Read-only after creation." },
      fields: [
        { name: "termsAcceptedAt", type: "date", admin: { readOnly: true } },
        { name: "ip", type: "text", admin: { readOnly: true } },
        { name: "userAgent", type: "text", admin: { readOnly: true } },
      ],
    },
  ],
  timestamps: true,
};
