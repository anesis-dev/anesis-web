/**
 * Primary header navigation items.
 *
 * Used by the desktop `Nav` component to render the top-level navigation
 * links. URLs are relative (no leading slash) so they work as `href` prefixes.
 */
import { INav } from "@/types/nav";

export const nav: INav[] = [
  {
    title: "Docs",
    url: "docs",
  },
  {
    title: "Templates",
    url: "templates",
  },
  {
    title: "Addons",
    url: "addons",
  },
];
