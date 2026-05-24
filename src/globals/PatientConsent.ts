import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";

export const PatientConsent: GlobalConfig = {
  slug: "patient-consent",
  label: "Patient Consent Block",
  access: { read: () => true },
  hooks: { afterChange: [revalidateCmsTag] },
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
