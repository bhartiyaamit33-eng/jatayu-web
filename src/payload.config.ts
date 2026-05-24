import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { azureStorage } from "@payloadcms/storage-azure";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Products } from "./collections/Products";
import { TeamMembers } from "./collections/TeamMembers";
import { Specialties } from "./collections/Specialties";
import { CaseStudies } from "./collections/CaseStudies";
import { Testimonials } from "./collections/Testimonials";
import { Awards } from "./collections/Awards";
import { HomeFaqs } from "./collections/HomeFaqs";
import { TrialEmails } from "./collections/TrialEmails";
import { Leads } from "./collections/Leads";

import { SiteMeta } from "./globals/SiteMeta";
import { HomeHero } from "./globals/HomeHero";
import { HomeMetrics } from "./globals/HomeMetrics";
import { AudienceSplit } from "./globals/AudienceSplit";
import { PatientConsent } from "./globals/PatientConsent";
import { ComplianceBand } from "./globals/ComplianceBand";
import { DeploymentModes } from "./globals/DeploymentModes";
import { FounderNote } from "./globals/FounderNote";
import { LogoWall } from "./globals/LogoWall";
import { HowItWorksSteps } from "./globals/HowItWorksSteps";
import { HomepageConciseAnswer } from "./globals/HomepageConciseAnswer";
import { ProductsPage } from "./globals/ProductsPage";
import { ForDoctorsPage } from "./globals/ForDoctorsPage";
import { ForHospitalsPage } from "./globals/ForHospitalsPage";
import { SiteFooter } from "./globals/SiteFooter";
import { AboutPage } from "./globals/AboutPage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// In production, persist media uploads to Azure Blob Storage. Locally and in
// CI builds (where AZURE_STORAGE_CONNECTION_STRING is unset) Payload falls
// back to disk via the Media collection's `staticDir`.
const azureConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const azureContainer = process.env.AZURE_STORAGE_CONTAINER_NAME ?? "media";
const azureAccountUrl = process.env.AZURE_STORAGE_ACCOUNT_BASEURL;

const plugins =
  process.env.NODE_ENV === "production" && azureConnectionString && azureAccountUrl
    ? [
        azureStorage({
          enabled: true,
          collections: { media: true },
          allowContainerCreate: false,
          baseURL: `${azureAccountUrl}/${azureContainer}`,
          connectionString: azureConnectionString,
          containerName: azureContainer,
        }),
      ]
    : [];

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " · Jatayu CMS",
      icons: [
        { rel: "icon", type: "image/png", sizes: "256x256", url: "/icon.png" },
        { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-icon.png" },
      ],
    },
  },
  collections: [
    Users,
    Media,
    Posts,
    Products,
    TeamMembers,
    Specialties,
    CaseStudies,
    Testimonials,
    Awards,
    HomeFaqs,
    TrialEmails,
    Leads,
  ],
  globals: [
    SiteMeta,
    HomeHero,
    HomeMetrics,
    AudienceSplit,
    PatientConsent,
    ComplianceBand,
    DeploymentModes,
    FounderNote,
    LogoWall,
    HowItWorksSteps,
    HomepageConciseAnswer,
    ProductsPage,
    ForDoctorsPage,
    ForHospitalsPage,
    SiteFooter,
    AboutPage,
  ],
  editor: lexicalEditor({}),
  plugins,
  sharp,
  secret: process.env.PAYLOAD_SECRET ?? "dev-secret-change-me-in-prod",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI ??
        "postgres://jatayu:jatayu_dev_password@localhost:5432/jatayu_cms",
    },
    // Schema-sync policy:
    //   - In local dev (NODE_ENV !== "production") push the schema on connect
    //     so new fields/collections "just work" while iterating.
    //   - In production keep push OFF. The Next.js standalone runtime image
    //     does not include drizzle-kit, so `push: true` silently no-ops there
    //     instead of doing what it says — which has bitten us before. With
    //     push:false the prod container queries whatever schema is in place,
    //     and we sync schema deliberately via `npm run sync-prod-schema`
    //     before any deploy that introduces schema changes.
    push: process.env.NODE_ENV !== "production",
  }),
  cors: [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"].filter(
    Boolean,
  ),
  csrf: [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"].filter(
    Boolean,
  ),
});
