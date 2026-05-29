/**
 * /for-hospitals-and-hmis → /use-cases/medical
 *
 * The hospitals / HMIS framing is now a section inside the Medical use case.
 * Permanent redirect preserves inbound links and SEO equity.
 */
import { permanentRedirect } from "next/navigation";

export const dynamic = "force-static";

export default function ForHospitalsRedirect(): never {
  permanentRedirect("/use-cases/medical");
}
