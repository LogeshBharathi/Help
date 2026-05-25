/** Minimal className merge helper (recovered from production bundle). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
