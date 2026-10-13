import { brand } from "@/config/brand";
import { cn } from "@/lib/cn";

/** The lowercase wordmark plus the small intersection symbol. */
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
        "inline-flex items-center gap-2 font-semibold tracking-[-0.03em]",
        size === "lg" ? "text-2xl" : "text-xl",
        tone === "light" ? "text-bg" : "text-heading",
        className,
      )}
    >
      <BrandSymbol className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} tone={tone} />
      <span>{brand.wordmark}</span>
    </span>
  );
}

/** Two overlapping circles: presence, intersection, connection. */
export function BrandSymbol({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "light";
}) {
  const stroke = tone === "light" ? "#F7F9FA" : "#223848";
  const fill = tone === "light" ? "#C4D5E0" : "#466680";
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <circle cx="9" cy="12" r="6.5" stroke={stroke} strokeWidth="1.6" />
      <circle cx="15" cy="12" r="6.5" stroke={stroke} strokeWidth="1.6" />
      <path d="M12 6.9a6.5 6.5 0 0 1 0 10.2 6.5 6.5 0 0 1 0-10.2z" fill={fill} />
    </svg>
  );
}
