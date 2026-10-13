import { Sparkles } from "lucide-react";
import { BrandSymbol } from "@/components/ui/Wordmark";
import { cn } from "@/lib/cn";

/** A short assistant recommendation card. */
export function AssistantNote({
  children,
  className,
  actions,
  label = "Suggestion",
}: {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  label?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-line bg-surface/70 p-4", className)}>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-primary">
        <BrandSymbol className="h-3.5 w-3.5" />
        {label}
        <Sparkles className="ml-auto h-3.5 w-3.5 text-subtle" aria-hidden="true" />
      </div>
      <p className="text-sm leading-relaxed text-heading">{children}</p>
      {actions ? <div className="mt-3 flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
