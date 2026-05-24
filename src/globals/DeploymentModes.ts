import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";

export const DeploymentModes: GlobalConfig = {
  slug: "deployment-modes",
  label: "Deployment Modes",
  access: { read: () => true },
  hooks: { afterChange: [revalidateCmsTag] },
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
