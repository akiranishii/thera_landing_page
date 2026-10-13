import { cn } from "@/lib/cn";

export function Container({
  className,
  children,
  wide = false,
}: {
  className?: string;
  children: React.ReactNode;
  /** Slightly wider measure, used by the hero composition. */
  wide?: boolean;
}) {
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", wide ? "max-w-7xl" : "max-w-6xl", className)}>
      {children}
    </div>
  );
}
