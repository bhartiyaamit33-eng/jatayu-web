import type { GlobalConfig } from "payload";

export const DeploymentModes: GlobalConfig = {
  slug: "deployment-modes",
  label: "Deployment Modes",
  access: { read: () => true },
  fields: [
    {
      name: "modes",
      type: "array",
      minRows: 1,
      labels: { singular: "Mode", plural: "Modes" },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
  ],
};
