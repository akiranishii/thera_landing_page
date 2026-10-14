/**
 * Brand configuration.
 *
 * The product name is a working name pending naming clearance. Every piece of
 * copy, metadata and UI reads it from here, so renaming the product is a
 * one-line change (or set NEXT_PUBLIC_BRAND_NAME at build time).
 */
const name = process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "Thera";

export const brand = {
  /** Display name used in prose: "Thera". */
  name,
  /** Lowercase wordmark with the trailing period: "thera." */
  wordmark: `${name.toLowerCase()}.`,
  /** Lowercase name without the period, for things like filenames. */
  slug: name.toLowerCase(),
  tagline: "The Relationship Assistant",
  statement: "Your network, in motion.",
  /** Used by the footer "Contact" link when set; otherwise the link goes to the early-access form. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
  /**
   * Canonical site URL for metadata and Open Graph: NEXT_PUBLIC_SITE_URL when set, otherwise the
   * project's production domain on Vercel (a system variable available at build time), otherwise localhost.
   */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    "http://localhost:3000",
} as const;

export const seo = {
  title: `${brand.name} — ${brand.tagline}`,
  description:
    "A voice-first personal CRM that helps you remember relationships, discover who's around, and make meaningful connections happen.",
} as const;
