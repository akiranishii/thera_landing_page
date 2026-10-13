import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "light";
}) {
  return (
    <p
      className={cn(
        "text-[0.6875rem] font-semibold uppercase tracking-[0.18em]",
        tone === "light" ? "text-accent-light" : "text-primary",
        className,
      )}
    >
      {children}
    </p>
  );
}
