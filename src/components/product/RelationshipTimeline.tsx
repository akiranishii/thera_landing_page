import { Bell } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { scenarioMemory } from "@/config/demo-data";

/** Fictional relationship timeline plus the outstanding follow-up (scenario B). */
export function RelationshipTimeline() {
  const { person, timeline, followUp } = scenarioMemory;
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-line bg-card p-4 shadow-card">
        <div className="mb-3 flex items-center gap-3">
          <Avatar name={person.name} tone={person.tone} />
          <div>
            <h4 className="text-[0.9375rem] font-semibold text-heading">{person.name}</h4>
            <p className="text-sm text-body">{person.role}</p>
          </div>
        </div>
        <ol className="relative ml-1.5 space-y-3 border-l border-line pl-4">
          {timeline.map((t, i) => (
            <li key={t.date} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-[1.3rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card ${i === timeline.length - 1 ? "bg-primary" : "bg-accent-light"}`}
              />
              <span className="text-xs text-subtle">{t.date}</span>
              <p className="text-sm font-medium text-heading">{t.label}</p>
              <p className="text-[0.8125rem] text-body">{t.detail}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-line bg-cal-travel/60 p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card text-[#8a5f45]">
          <Bell className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-wider text-[#8a5f45]">Outstanding follow-up</p>
          <p className="text-sm font-medium text-heading">{followUp.title}</p>
          <p className="text-xs text-body">{followUp.status}</p>
        </div>
      </div>
    </div>
  );
}
