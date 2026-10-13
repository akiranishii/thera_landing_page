import { ArrowRight, CircleHelp, MapPin, Plane } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { presenceLabel, type Person, type Presence } from "@/config/demo-data";

const presenceTone: Record<Presence, "mint" | "lavender" | "outline"> = {
  based: "mint",
  visiting: "lavender",
  unconfirmed: "outline",
};

function PresenceIcon({ presence }: { presence: Presence }) {
  const cls = "h-3 w-3";
  if (presence === "based") return <MapPin className={cls} aria-hidden="true" />;
  if (presence === "visiting") return <Plane className={cls} aria-hidden="true" />;
  return <CircleHelp className={cls} aria-hidden="true" />;
}

/**
 * A single person in a "who's around" list.
 * `compact` is used inside the phone mockup; the default size is used in full-width panels.
 */
export function ContactCard({
  person,
  compact = false,
  className,
  showPresenceLabel = true,
}: {
  person: Person;
  compact?: boolean;
  className?: string;
  showPresenceLabel?: boolean;
}) {
  return (
    <article
      className={cn(
        "rounded-xl border border-line bg-card",
        compact ? "p-3" : "p-4 shadow-card",
        className,
      )}
      aria-label={`${person.name}, ${person.role}`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={person.name} tone={person.tone} size={compact ? "sm" : "md"} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <h4 className={cn("font-semibold text-heading", compact ? "text-[0.8125rem]" : "text-[0.9375rem]")}>
              {person.name}
            </h4>
            {showPresenceLabel ? (
              <Badge tone={presenceTone[person.presence]} icon={<PresenceIcon presence={person.presence} />}>
                {presenceLabel[person.presence]}
              </Badge>
            ) : null}
          </div>
          <p className={cn("text-body", compact ? "text-xs" : "text-sm")}>{person.role}</p>
          <p className={cn("mt-1 text-heading/80", compact ? "text-[0.6875rem]" : "text-[0.8125rem]")}>
            {person.presenceDetail}
          </p>
          {person.meta ? (
            <p className={cn("text-subtle", compact ? "text-[0.6875rem]" : "text-[0.8125rem]")}>{person.meta}</p>
          ) : null}
          <div className={cn("flex flex-wrap items-center justify-between gap-x-2 gap-y-1", compact ? "mt-2" : "mt-3")}>
            <span className={cn("text-subtle", compact ? "text-[0.6875rem]" : "text-xs")}>Suggested action</span>
            <span
              className={cn(
                "ml-auto inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-surface font-medium text-primary",
                compact ? "px-2.5 py-1 text-[0.6875rem]" : "px-3 py-1.5 text-xs",
              )}
            >
              {person.action}
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
