import { navigationMain } from "@/content/site-config";

export function mainNavItems() {
  return navigationMain.filter((item) => item.showInMainNav);
}
