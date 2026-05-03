import type { GlobalConfig } from "payload";

export const HomepageConciseAnswer: GlobalConfig = {
  slug: "homepage-concise-answer",
  label: "Homepage Concise Answer (AEO)",
  access: { read: () => true },
  fields: [
    { name: "label", type: "text", required: true, defaultValue: "What it is" },
    { name: "body", type: "textarea", required: true, admin: { description: "Plain-English answer used by Google AEO and as the home 'What it is' section." } },
  ],
};
