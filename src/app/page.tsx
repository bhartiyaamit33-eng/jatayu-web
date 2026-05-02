import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: siteMeta.defaultTitle,
  description: siteMeta.defaultDescription,
  alternates: { canonical: siteMeta.domain },
};

export default function HomePage() {
  return <HomeSections />;
}
