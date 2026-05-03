import type { GlobalConfig } from "payload";

export const PatientConsent: GlobalConfig = {
  slug: "patient-consent",
  label: "Patient Consent Block",
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    {
      name: "bullets",
      type: "array",
      labels: { singular: "Bullet", plural: "Bullets" },
      fields: [{ name: "text", type: "text", required: true }],
    },
  ],
};
