import { cn } from "@/lib/cn";

type Tone = "neutral" | "primary" | "mint" | "warm" | "lavender" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-surface text-body",
  primary: "bg-primary text-white",
  mint: "bg-cal-networking text-[#2f5d53]",
  warm: "bg-cal-travel text-[#7a553f]",
  lavender: "bg-cal-personal text-[#4f4677]",
  outline: "border border-line bg-card text-body",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  icon,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium leading-5",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
