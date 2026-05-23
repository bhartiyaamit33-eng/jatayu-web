import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
  /** Decorative use (set true when paired with adjacent wordmark text) */
  decorative?: boolean;
  /** CMS-supplied logo URL. Falls back to /brand/jatayu-logo.png when empty. */
  src?: string | null;
  /** Alt text from the CMS media doc; ignored when decorative is true. */
  alt?: string;
};

const DEFAULT_LOGO_SRC = "/brand/jatayu-logo.png";
const DEFAULT_LOGO_ALT = "Jatayu Healthcare Technologies";

export function Logo({
  size = 36,
  className,
  decorative = false,
  src,
  alt,
}: LogoProps) {
  const finalSrc = src && src.length > 0 ? src : DEFAULT_LOGO_SRC;
  // Remote (CMS) images go through next/image's loader; Next will throw if the
  // domain isn't whitelisted. `unoptimized` keeps it resilient against fresh
  // Azure URLs that aren't in next.config yet.
  const isRemote = finalSrc.startsWith("http://") || finalSrc.startsWith("https://");
  return (
    <Image
      src={finalSrc}
      alt={decorative ? "" : alt ?? DEFAULT_LOGO_ALT}
      aria-hidden={decorative || undefined}
      width={size}
      height={size}
      priority
      unoptimized={isRemote}
      className={className}
    />
  );
}
