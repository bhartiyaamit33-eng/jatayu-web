import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
  /** Decorative use (set true when paired with adjacent wordmark text) */
  decorative?: boolean;
};

export function Logo({ size = 36, className, decorative = false }: LogoProps) {
  return (
    <Image
      src="/brand/jatayu-logo.png"
      alt={decorative ? "" : "Jatayu Healthcare Technologies"}
      aria-hidden={decorative || undefined}
      width={size}
      height={size}
      priority
      className={className}
    />
  );
}
