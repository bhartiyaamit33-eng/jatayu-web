import { navigationMain } from "@/content/site-config";

export function mainNavItems() {
  return navigationMain.filter((item) => item.showInMainNav);
}

/**
 * Curated subset for the top header bar. Keep to ≤ 6 items and use short
 * labels so the bar never wraps on common laptop widths (1280px+). Everything
 * else (Home, Specialties, Blog, About, Contact) lives in the footer.
 */
const HEADER_NAV = [
  { label: "Product", href: "/product" },
  { label: "For Doctors", href: "/for-doctors" },
  { label: "For Hospitals", href: "/for-hospitals-and-hmis" },
  { label: "Pricing", href: "/pricing" },
  { label: "Customers", href: "/case-studies" },
  { label: "Security", href: "/security" },
] as const;

export function headerNavItems(): ReadonlyArray<{ label: string; href: string }> {
  return HEADER_NAV;
}
