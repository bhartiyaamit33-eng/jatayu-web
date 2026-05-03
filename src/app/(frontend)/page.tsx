import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { getSiteMeta } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const siteMeta = await getSiteMeta();
  return {
    title: siteMeta.defaultTitle,
    description: siteMeta.defaultDescription,
    alternates: { canonical: siteMeta.domain },
  };
}

export default function HomePage() {
  return <HomeSections />;
}
