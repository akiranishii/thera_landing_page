import { cn } from "@/lib/cn";
import type { Tone } from "@/config/demo-data";

const tones: Record<Tone, string> = {
  0: "bg-cal-meeting text-primary",
  1: "bg-cal-personal text-[#5a4f86]",
  2: "bg-cal-networking text-[#3f6d62]",
  3: "bg-cal-travel text-[#8a5f45]",
  4: "bg-accent-light text-heading",
};

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  name,
  tone = 0,
  size = "md",
  className,
}: {
  name: string;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims = size === "sm" ? "h-8 w-8 text-[0.6875rem]" : size === "lg" ? "h-14 w-14 text-base" : "h-10 w-10 text-xs";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide",
        dims,
        tones[tone],
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
