import type { GlobalConfig } from "payload";

export const HowItWorksSteps: GlobalConfig = {
  slug: "how-it-works-steps",
  label: "How It Works Steps",
  access: { read: () => true },
  fields: [
    {
      name: "steps",
      type: "array",
      minRows: 1,
      labels: { singular: "Step", plural: "Steps" },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
  ],
};
