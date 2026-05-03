import type { GlobalConfig } from "payload";

export const LogoWall: GlobalConfig = {
  slug: "logo-wall",
  label: "Logo Wall",
  access: { read: () => true },
  fields: [
    {
      name: "logos",
      type: "array",
      minRows: 1,
      labels: { singular: "Logo", plural: "Logos" },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "consentOnFile", type: "checkbox", defaultValue: false },
      ],
    },
  ],
};
