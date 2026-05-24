import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";

export const LogoWall: GlobalConfig = {
  slug: "logo-wall",
  label: "Logo Wall",
  access: { read: () => true },
  hooks: { afterChange: [revalidateCmsTag] },
  fields: [
    {
      name: "logos",
      type: "array",
      minRows: 1,
      labels: { singular: "Logo", plural: "Logos" },
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "category",
          type: "select",
          required: true,
          defaultValue: "hospital",
          options: [
            { label: "Hospital partner", value: "hospital" },
            { label: "EHR / HMIS partner", value: "ehr" },
            { label: "Strategic / Government partner", value: "strategic" },
            { label: "Supporter (ecosystem)", value: "supporter" },
          ],
        },
        { name: "consentOnFile", type: "checkbox", defaultValue: false },
        { name: "logo", type: "upload", relationTo: "media" },
        { name: "href", type: "text" },
      ],
    },
    {
      name: "hospitalRowImage",
      label: "Combined hospital partner row (fallback while individual logos arrive)",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "ehrRowImage",
      label: "Combined EHR/HMIS partner row (fallback while individual logos arrive)",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "supportersRowImage",
      label: "Combined supporter ecosystem strip",
      type: "upload",
      relationTo: "media",
    },
  ],
};
