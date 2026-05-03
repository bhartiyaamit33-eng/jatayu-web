import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-grad-accent text-white shadow-[0_8px_24px_rgba(155,47,145,0.35)] hover:-translate-y-0.5 focus-visible:ring-magenta",
  secondary:
    "border border-indigo/25 bg-white text-navy shadow-sm hover:border-indigo hover:text-indigo focus-visible:ring-indigo",
  ghost:
    "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15 focus-visible:ring-white/60",
  link: "text-magenta hover:text-purple underline-offset-4 hover:underline focus-visible:ring-magenta",
};

const sizeClasses: Record<Size, string> = {
  sm: "rounded-lg px-4 py-2 text-sm",
  md: "rounded-xl px-6 py-2.5 text-sm",
  lg: "rounded-xl px-7 py-3 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-display font-semibold transition-all duration-200 ease-clinical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-60 disabled:cursor-not-allowed";

function classes(variant: Variant, size: Size, className?: string) {
  if (variant === "link") {
    return [
      "inline-flex items-center gap-1.5 font-display font-semibold transition-colors duration-200 ease-clinical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
      sizeClasses[size].replace(/rounded-\S+/, "").replace(/bg-\S+/, "").trim(),
      variantClasses.link,
      className,
    ]
      .filter(Boolean)
      .join(" ");
  }
  return [baseClasses, sizeClasses[size], variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");
}

type LinkProps = {
  as: "link";
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type ExternalProps = {
  as: "a";
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type ButtonProps = {
  as?: "button";
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type Props = LinkProps | ExternalProps | ButtonProps;

export function Button(props: Props) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";
  const cls = classes(variant, size, props.className);

  if (props.as === "link") {
    const { children, href, ...rest } = props;
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  if (props.as === "a") {
    const { children, href, ...rest } = props;
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  const { children, ...rest } = props;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
