import { brand } from "@/config/brand";
import { logo } from "@/config/logo";
import { cn } from "@/lib/cn";

/** The mark plus the lowercase wordmark, as a horizontal lockup. */
export function Wordmark({
  className,
  tone = "default",
  size = "md",
}: {
  className?: string;
  tone?: "default" | "light";
  size?: "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold tracking-[-0.03em]",
        // The mark is set larger than the designed lockup (box 1.45 em instead of 1 em) so the
        // symbol carries the brand in the navbar; the wordmark steps up from 20 px to 22 px.
        "gap-[0.32em]",
        size === "lg" ? "text-[1.625rem]" : "text-[1.375rem]",
        tone === "light" ? "text-bg" : "text-heading",
        className,
      )}
    >
      <BrandSymbol className="h-[1.45em] w-[1.45em]" tone={tone} />
      <span>{brand.wordmark}</span>
    </span>
  );
}

/**
 * The "Caldera and Sunken Head" mark.
 * - default: two-tone (ink cliffs, sea-blue sunken head, island dot knocked out), the end state of the
 *   Santorini animation the founder chose. Used in the navbar and footer lockups at 20 px. (The designer's
 *   notes suggest the one-colour crescent for lockups; that is available as tone="light" on dark grounds.)
 * - tone="light": single colour in the light ink, for dark backgrounds.
 * - variant="small": the 16 px cut (no dot, simplified profile) for glyphs of 16–32 px.
 */
export function BrandSymbol({
  className,
  tone = "default",
  variant = "full",
}: {
  className?: string;
  tone?: "default" | "light";
  variant?: "full" | "small";
}) {
  const ink = tone === "light" ? logo.colors.light : logo.colors.ink;
  return (
    <svg viewBox={logo.viewBox} className={cn("shrink-0", className)} aria-hidden="true" focusable="false">
      {variant === "small" ? (
        <path d={logo.small} fill={ink} />
      ) : (
        <>
          {tone === "default" ? <path d={logo.head} fill={logo.colors.sea} /> : null}
          <path d={logo.crescent} fill={ink} fillRule="evenodd" />
        </>
      )}
    </svg>
  );
}
