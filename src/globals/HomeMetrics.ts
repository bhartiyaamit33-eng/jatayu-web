import type { GlobalConfig } from "payload";

export const HomeMetrics: GlobalConfig = {
  slug: "home-metrics",
  label: "Home Metrics Strip",
  access: { read: () => true },
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
        { name: "sourceRef", type: "text", required: true, admin: { description: "Citation, e.g. KEM-Pilot-2025-Q3" } },
      ],
    },
  ],
};
