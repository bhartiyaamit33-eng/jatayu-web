import type { GlobalConfig } from "payload";

export const HomeHero: GlobalConfig = {
  slug: "home-hero",
  label: "Home Hero",
  access: { read: () => true },
  fields: [
    { name: "badge", type: "text", required: true },
    { name: "headline", type: "text", required: true, admin: { description: "Use a period after the first sentence; the second sentence is auto-styled with the brand gradient." } },
    { name: "subheadline", type: "textarea", required: true },
    { name: "trustLine", type: "textarea", required: true },
    {
      name: "primaryCta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "secondaryCta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
};
