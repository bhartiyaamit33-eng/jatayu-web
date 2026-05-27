import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublishGlobal,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

export const HowItWorksSteps: GlobalConfig = {
  slug: "how-it-works-steps",
  label: "How It Works Steps",
  versions: { drafts: true },
  access: { read: publishedOnlyForPublic, update: editorsUpdate },
  hooks: {
    beforeChange: [blockEditorPublishGlobal],
    afterChange: [revalidateCmsTag],
  },
  fields: [
    {
      name: "flowDiagram",
      label: "Single full-flow diagram (used when individual step visuals are not yet supplied)",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "steps",
      type: "array",
      minRows: 1,
      labels: { singular: "Step", plural: "Steps" },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
        { name: "visual", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
