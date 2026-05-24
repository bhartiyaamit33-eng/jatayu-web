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
    // Push schema on connect so fresh Azure deployments auto-provision tables.
    // For a hardened production cutover, set this to false and run
    // `payload migrate` as a one-off job.
    push: true,
  }),
  cors: [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"].filter(
    Boolean,
  ),
  csrf: [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"].filter(
    Boolean,
  ),
});
