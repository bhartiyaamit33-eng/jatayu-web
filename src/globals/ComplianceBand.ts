import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublishGlobal,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

export const ComplianceBand: GlobalConfig = {
  slug: "compliance-band",
  label: "Compliance Band",
  versions: { drafts: true },
  access: { read: publishedOnlyForPublic, update: editorsUpdate },
  hooks: {
    beforeChange: [blockEditorPublishGlobal],
    afterChange: [revalidateCmsTag],
  },
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
