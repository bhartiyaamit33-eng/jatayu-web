import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";

export const ComplianceBand: GlobalConfig = {
  slug: "compliance-band",
  label: "Compliance Band",
  access: { read: () => true },
  hooks: { afterChange: [revalidateCmsTag] },
  fields: [
    {
      name: "items",
      type: "array",
      minRows: 1,
      labels: { singular: "Compliance card", plural: "Compliance cards" },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
        { name: "href", type: "text", required: true, defaultValue: "/security" },
      ],
    },
  ],
};
