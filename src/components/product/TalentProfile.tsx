import { BadgeCheck, GitBranch, Lightbulb, Route, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { TalentProfile as Profile } from "@/config/demo-data";
import { cn } from "@/lib/cn";

/** A compact technical-talent card used in the "new connections" scenario. */
export function TalentProfileCard({ profile, className }: { profile: Profile; className?: string }) {
  return (
    <article className={cn("rounded-xl border border-line bg-card p-4 shadow-card", className)} aria-label={profile.name}>
      <div className="flex items-start gap-3">
        <Avatar name={profile.name} tone={profile.tone} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <h4 className="text-[0.9375rem] font-semibold text-heading">{profile.name}</h4>
            {profile.fit === "verified" ? (
              <Badge tone="mint" icon={<BadgeCheck className="h-3 w-3" aria-hidden="true" />}>
                Verified contribution
              </Badge>
            ) : (
              <Badge tone="outline" icon={<Lightbulb className="h-3 w-3" aria-hidden="true" />}>
                Inferred fit
              </Badge>
            )}
          </div>
          <p className="text-sm text-body">{profile.headline}</p>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-[0.8125rem] sm:grid-cols-2">
        <Field label="Specialization" value={profile.specialization} />
        <Field
          label="Example contribution"
          value={profile.contribution}
          hint={
            <span className="mt-0.5 inline-flex items-center gap-1 text-[0.6875rem] text-subtle">
              <GitBranch className="h-3 w-3" aria-hidden="true" />
              {profile.evidence.verified ? "Verified source: " : "Source: "}
              {profile.evidence.label}
            </span>
          }
        />
        <Field label="Potential mutual connection" value={profile.mutual} icon={<Route className="h-3 w-3" />} />
        <Field label="Why meet" value={profile.why} icon={<Sparkles className="h-3 w-3" />} />
      </dl>
    </article>
  );
}

function Field({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-[0.6875rem] uppercase tracking-wider text-subtle">
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        {label}
      </dt>
      <dd className="text-heading">
        {value}
        {hint ? <div>{hint}</div> : null}
      </dd>
    </div>
  );
}
