import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteMeta } from "@/content/site-config";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.domain),
  title: {
    default: siteMeta.defaultTitle,
    template: `%s · ${siteMeta.productName}`,
  },
  description: siteMeta.defaultDescription,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteMeta.legalName,
    title: siteMeta.defaultTitle,
    description: siteMeta.defaultDescription,
    url: siteMeta.domain,
    images: [
      {
        url: "/brand/jatayu-logo.png",
        width: 500,
        height: 500,
        alt: siteMeta.legalName,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteMeta.defaultTitle,
    description: siteMeta.defaultDescription,
    images: ["/brand/jatayu-logo.png"],
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  name: siteMeta.legalName,
  url: siteMeta.domain,
  description: siteMeta.defaultDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <JsonLd data={organizationLd} />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
