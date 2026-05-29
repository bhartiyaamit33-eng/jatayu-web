/**
 * /for-doctors → /use-cases/medical
 *
 * The site no longer exposes a separate clinicians page; the same content
 * lives consolidated under the Medical use case. Permanent redirect (308)
 * preserves inbound links and SEO equity.
 */
import { permanentRedirect } from "next/navigation";

export const dynamic = "force-static";

export default function ForDoctorsRedirect(): never {
  permanentRedirect("/use-cases/medical");
}
