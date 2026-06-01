import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublishGlobal,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

export const HomeMetrics: GlobalConfig = {
  slug: "home-metrics",
  label: "Home Metrics Strip",
  versions: { drafts: true },
  access: { read: publishedOnlyForPublic, update: editorsUpdate },
  hooks: {
    beforeChange: [blockEditorPublishGlobal],
    afterChange: [revalidateCmsTag],
  },
  fields: [
    {
      name: "metrics",
      type: "array",
      minRows: 1,
      maxRows: 8,
      labels: { singular: "Metric", plural: "Metrics" },
      fields: [
        { name: "key", type: "text", required: true, admin: { description: "Stable id, e.g. ttd-reduction" } },
        { name: "value", type: "text", required: true, admin: { description: "What renders large, e.g. 40-60% or 22 mins/day" } },
        { name: "label", type: "text", required: true },
        { name: "sourceRef", type: "text", required: true, admin: { description: "Citation, e.g. KEM-Deployment-2025-Q4" } },
      ],
    },
  ],
};
