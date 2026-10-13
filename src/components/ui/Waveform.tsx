import { cn } from "@/lib/cn";

/** Decorative voice waveform. Animates only when `active` and motion is allowed (see globals.css). */
export function Waveform({
  bars = 14,
  active = true,
  className,
  barClassName,
}: {
  bars?: number;
  active?: boolean;
  className?: string;
  barClassName?: string;
}) {
  return (
    <span aria-hidden="true" className={cn("flex h-5 items-center gap-[3px]", className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "block w-[3px] rounded-full bg-primary/70",
            active ? "wave-bar" : "scale-y-[0.35]",
            barClassName,
          )}
          style={{
            height: `${10 + ((i * 7) % 11)}px`,
            animationDelay: `${(i % 7) * 0.09}s`,
            animationDuration: `${0.9 + ((i * 3) % 5) * 0.08}s`,
          }}
        />
      ))}
    </span>
  );
}
