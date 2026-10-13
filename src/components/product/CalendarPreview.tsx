import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/cn";

type Kind = "meeting" | "free" | "networking" | "personal" | "travel";

const kindStyle: Record<Kind, string> = {
  meeting: "bg-cal-meeting",
  networking: "bg-cal-networking",
  personal: "bg-cal-personal",
  travel: "bg-cal-travel",
  free: "border border-dashed border-primary/50 bg-transparent",
};

/** A compact day agenda, used as the floating card in the hero and in the demo. */
export function CalendarPreview({
  day,
  items,
  className,
  title = "Calendar",
}: {
  day: string;
  items: ReadonlyArray<{ time: string; label: string; kind: Kind }>;
  className?: string;
  title?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-line bg-card p-4 shadow-float", className)}>
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-subtle">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {title}
        </span>
        <span className="text-xs font-semibold text-heading">{day}</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.time + item.label} className="flex items-center gap-2.5">
            <span className="w-10 shrink-0 text-[0.6875rem] tabular-nums text-subtle">{item.time}</span>
            <span
              className={cn(
                "flex-1 truncate rounded-md px-2 py-1 text-xs",
                kindStyle[item.kind],
                item.kind === "free" ? "text-primary" : "text-heading",
              )}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
