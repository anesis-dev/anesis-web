/**
 * `cn` — utility for merging Tailwind class names.
 *
 * Combines `clsx` (conditional classes) with `tailwind-merge` (deduplicates
 * conflicting Tailwind utilities such as `p-2` vs `p-4`). Use instead of
 * raw string concatenation wherever class names need to be composed.
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
