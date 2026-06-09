import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { azureStorage } from "@payloadcms/storage-azure";
import { gcsStorage } from "@payloadcms/storage-gcs";

import { Users } from "./collections/Users";
import { AuditLogs } from "./collections/AuditLogs";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Products } from "./collections/Products";
import { TeamMembers } from "./collections/TeamMembers";
import { UseCases } from "./collections/UseCases";
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
import { HomeSectionsContent } from "./globals/HomeSectionsContent";
import { ProductsPage } from "./globals/ProductsPage";
import { ForDoctorsPage } from "./globals/ForDoctorsPage";
import { ForHospitalsPage } from "./globals/ForHospitalsPage";
import { SiteFooter } from "./globals/SiteFooter";
import { AboutPage } from "./globals/AboutPage";
import { UseCasesPage } from "./globals/UseCasesPage";
import { cmsWorkflowPlugin } from "./plugins/cmsWorkflow";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Media-upload storage backend, selected by which env vars are present:
//
//   1. Google Cloud Storage  — when GCS_BUCKET is set. This is the target
//      backend for the Google Cloud (Cloud Run) deployment. Cloud Run's
//      filesystem is ephemeral, so disk-backed uploads are NOT an option
//      there — GCS must be configured before going live on GCP.
//   2. Azure Blob Storage    — when the Azure vars are set (legacy/transition
//      path while the app still runs on Azure Container Apps).
//   3. Local disk            — neither configured (local dev / CI builds).
//      Falls back to the Media collection's `staticDir`.
//
// Credentials on Cloud Run come from the service account via Application
// Default Credentials (ADC), so no key file is needed in production. For
// local testing against a real bucket, point GCS_KEY_FILENAME at a service
// account JSON key, or run `gcloud auth application-default login`.
const gcsBucket = process.env.GCS_BUCKET;

const azureConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const azureContainer = process.env.AZURE_STORAGE_CONTAINER_NAME ?? "media";
const azureAccountUrl = process.env.AZURE_STORAGE_ACCOUNT_BASEURL;

const plugins = gcsBucket
  ? [
      gcsStorage({
        enabled: true,
        collections: { media: true },
        bucket: gcsBucket,
        options: {
          // projectId / keyFilename are optional: on Cloud Run, ADC supplies
          // both from the attached service account. Only set them for local
          // dev against a real bucket.
          ...(process.env.GCS_PROJECT_ID
            ? { projectId: process.env.GCS_PROJECT_ID }
            : {}),
          ...(process.env.GCS_KEY_FILENAME
            ? { keyFilename: process.env.GCS_KEY_FILENAME }
            : {}),
        },
      }),
    ]
  : process.env.NODE_ENV === "production" &&
      azureConnectionString &&
      azureAccountUrl
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

// Origins trusted for CORS + CSRF. The configured site URL plus the standard
// local dev origins, de-duplicated. Adding the localhost variants is safe in
// production too: cookies are domain-scoped, so a localhost page can never
// carry the production admin cookie.
const trustedOrigins = Array.from(
  new Set(
    [
      process.env.NEXT_PUBLIC_SITE_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ].filter(Boolean) as string[],
  ),
);

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
    components: {
      actions: ["/src/components/admin/AccountMenu#AccountMenu"],
      beforeLogin: ["/src/components/admin/MfaLoginForm#MfaLoginForm"],
      beforeNavLinks: [
        "/src/components/admin/ReviewQueueNavLink#ReviewQueueNavLink",
      ],
      logout: {
        Button: false,
      },
      providers: [
        "/src/components/admin/SessionEndProvider#SessionEndProvider",
      ],
      views: {
        reviewQueue: {
          Component: "/src/components/admin/ReviewQueue#ReviewQueue",
          path: "/review-queue",
          meta: {
            title: "Review queue",
          },
        },
      },
    },
  },
  collections: [
    Users,
    AuditLogs,
    Media,
    Posts,
    Products,
    UseCases,
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
    HomeSectionsContent,
    ProductsPage,
    ForDoctorsPage,
    ForHospitalsPage,
    SiteFooter,
    AboutPage,
    UseCasesPage,
  ],
  editor: lexicalEditor({}),
  plugins: [cmsWorkflowPlugin, ...plugins],
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
  // Trusted origins for CORS and CSRF. Payload only honours the admin login
  // cookie for write/publish requests whose Origin is in the `csrf` list, so
  // this MUST include every origin the admin is actually opened from. We always
  // include the local dev variants (localhost AND 127.0.0.1) in addition to the
  // configured site URL — otherwise opening the admin at 127.0.0.1 (or with
  // NEXT_PUBLIC_SITE_URL pointed at production) silently rejects every save with
  // "You are not allowed to perform this action".
  cors: trustedOrigins,
  csrf: trustedOrigins,
});
