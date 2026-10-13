import { Info } from "lucide-react";
import { cn } from "@/lib/cn";

/** Small, consistent "this is illustrative" note under product visualizations. */
export function DemoLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-start gap-1.5 text-xs leading-5 text-body", className)}>
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
