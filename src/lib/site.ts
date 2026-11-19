const DEFAULT_SITE_URL = "https://avin1731.xteonlyone.my.id";

export const SITE_NAME = "A-1412";
export const SITE_TITLE = "A-1412 | Avin — Fullstack Developer";
export const SITE_DESCRIPTION =
  "Dynamic interactive portfolio, technical blog, and community guestbook built with Next.js, TypeScript, and Drizzle ORM.";

/**
 * Resolve normalized application base URL from NEXT_PUBLIC_APP_URL with a safe fallback.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;

  try {
    return new URL(raw).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
