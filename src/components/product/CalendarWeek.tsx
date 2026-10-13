"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { calendarWeek, type CalendarEvent, type EventKind } from "@/config/demo-data";
import { cn } from "@/lib/cn";

const kindStyle: Record<EventKind, string> = {
  meeting: "bg-cal-meeting text-heading",
  personal: "bg-cal-personal text-heading",
  networking: "bg-cal-networking text-heading",
  travel: "bg-cal-travel text-heading",
  proposed: "",
};

export type ProposalState = "hidden" | "ghost" | "approved";

const HOUR_PX = 36;

function fmtHour(h: number) {
  const whole = Math.floor(h);
  const suffix = whole >= 12 ? "pm" : "am";
  const display = whole > 12 ? whole - 12 : whole;
  return `${display}${suffix}`;
}

/**
 * A five-day calendar week with colored event blocks and an optional proposed block
 * that slides into place. On narrow screens only Wed–Fri are shown so the blocks stay readable.
 */
export function CalendarWeek({
  proposal = "hidden",
  className,
}: {
  proposal?: ProposalState;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { days, dates, startHour, endHour, events, proposed, focusDay } = calendarWeek;
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const height = (endHour - startHour) * HOUR_PX;

  const top = (e: CalendarEvent) => (e.start - startHour) * HOUR_PX;
  const h = (e: CalendarEvent) => (e.end - e.start) * HOUR_PX;

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line bg-card", className)}>
      {/* Header */}
      <div className="grid grid-cols-[2.5rem_repeat(3,1fr)] border-b border-line sm:grid-cols-[2.75rem_repeat(5,1fr)]">
        <div />
        {days.map((d, i) => (
          <div
            key={d}
            className={cn(
              "py-2 text-center",
              i < 2 && "hidden sm:block",
            )}
          >
            <div className={cn("text-[0.625rem] font-medium uppercase tracking-wider", i === focusDay ? "text-primary" : "text-subtle")}>
              {d}
            </div>
            <div
              className={cn(
                "mx-auto mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                i === focusDay ? "bg-primary text-white" : "text-heading",
              )}
            >
              {dates[i]}
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[2.5rem_repeat(3,1fr)] sm:grid-cols-[2.75rem_repeat(5,1fr)]" style={{ height }}>
        {/* Hour labels */}
        <div className="relative border-r border-line">
          {hours.map((hr) => (
            <span
              key={hr}
              className="absolute right-1.5 -translate-y-1/2 text-[0.5625rem] tabular-nums text-subtle"
              style={{ top: (hr - startHour) * HOUR_PX }}
            >
              {hr === startHour ? "" : fmtHour(hr)}
            </span>
          ))}
        </div>

        {days.map((d, dayIndex) => (
          <div
            key={d}
            className={cn(
              "relative border-r border-line last:border-r-0",
              dayIndex < 2 && "hidden sm:block",
              dayIndex === focusDay && "bg-surface/40",
            )}
          >
            {hours.map((hr) => (
              <div
                key={hr}
                className="absolute inset-x-0 border-t border-line/80"
                style={{ top: (hr - startHour) * HOUR_PX }}
                aria-hidden="true"
              />
            ))}

            {events
              .filter((e) => e.day === dayIndex)
              .map((e) => (
                <div
                  key={e.id}
                  className={cn(
                    "absolute inset-x-0.5 overflow-hidden rounded-md px-1.5 py-1 text-[0.625rem] leading-tight sm:text-[0.6875rem]",
                    kindStyle[e.kind],
                  )}
                  style={{ top: top(e) + 1, height: h(e) - 2 }}
                >
                  <span className={cn("font-medium", e.end - e.start < 1 ? "block truncate" : "line-clamp-2")}>{e.title}</span>
                  {e.end - e.start >= 1.5 ? (
                    <span className="hidden text-[0.5625rem] opacity-70 sm:block">
                      {fmtTime(e.start)} – {fmtTime(e.end)}
                    </span>
                  ) : null}
                </div>
              ))}

            {dayIndex === proposed.day && proposal !== "hidden" ? (
              <motion.div
                key={proposal}
                className={cn(
                  "absolute inset-x-0.5 z-10 rounded-md px-1.5 py-1 text-[0.625rem] leading-tight sm:text-[0.6875rem]",
                  proposal === "approved"
                    ? "bg-primary text-white"
                    : "border border-dashed border-primary bg-card text-primary",
                )}
                style={{ height: h(proposed) - 2 }}
                initial={reduce ? { top: top(proposed) + 1, opacity: 1 } : { top: top(proposed) - 40, opacity: 0, scale: 0.96 }}
                animate={{ top: top(proposed) + 1, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              >
                <span className="flex items-start gap-1 font-medium">
                  {proposal === "approved" ? <Check className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" /> : null}
                  <span className="line-clamp-2">{proposed.title}</span>
                </span>
              </motion.div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-line px-3 py-2 text-[0.625rem] text-subtle">
        <Legend swatch="bg-cal-meeting" label="Meetings" />
        <Legend swatch="bg-cal-personal" label="Personal" />
        <Legend swatch="bg-cal-networking" label="Networking" />
        <Legend swatch="bg-cal-travel" label="Travel" />
        <Legend swatch="border border-dashed border-primary" label="Proposed" />
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("h-2.5 w-2.5 rounded-sm", swatch)} aria-hidden="true" />
      {label}
    </span>
  );
}

function fmtTime(h: number) {
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  const display = whole > 12 ? whole - 12 : whole;
  return `${display}:${mins.toString().padStart(2, "0")}`;
}
