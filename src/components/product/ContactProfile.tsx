"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Bell, CalendarClock, MapPin, NotebookPen, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { contactProfile } from "@/config/demo-data";
import { cn } from "@/lib/cn";

/**
 * A contact profile. When `populated` is true the items captured from the voice note
 * (a note, a follow-up and a timeline entry) animate into place.
 */
export function ContactProfile({ populated, className }: { populated: boolean; className?: string }) {
  const c = contactProfile;
  const reduce = useReducedMotion();
  const enter = reduce ? {} : { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 } };

  return (
    <div className={cn("rounded-2xl border border-line bg-card shadow-card", className)}>
      <div className="flex items-center gap-3 border-b border-line p-4">
        <Avatar name={c.name} tone={c.tone} size="lg" />
        <div className="min-w-0">
          <h4 className="text-base font-semibold text-heading">{c.name}</h4>
          <p className="text-sm text-body">{c.role}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-subtle">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {c.city}
            <span aria-hidden="true">·</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={populated ? "new" : "old"} {...enter} transition={{ duration: 0.25 }}>
                Last interaction: {populated ? c.fromVoiceNote.lastInteraction : c.lastInteraction}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <Section icon={<NotebookPen className="h-3.5 w-3.5" />} title="Recent notes">
          <ul className="space-y-1.5 text-sm text-heading">
            <AnimatePresence initial={false}>
              {populated ? (
                <motion.li
                  key="voice-note"
                  layout
                  {...enter}
                  transition={{ duration: 0.35 }}
                  className="rounded-lg bg-cal-networking/70 px-2.5 py-1.5"
                >
                  <span className="mb-0.5 flex items-center gap-1 text-[0.6875rem] font-medium text-[#2f5d53]">
                    <Sparkles className="h-3 w-3" aria-hidden="true" /> From today&apos;s voice note
                  </span>
                  {c.fromVoiceNote.note}
                </motion.li>
              ) : null}
            </AnimatePresence>
            {c.notes.map((n) => (
              <li key={n} className="px-2.5 py-1 text-body">
                {n}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={<Sparkles className="h-3.5 w-3.5" />} title="Shared interests">
          <div className="flex flex-wrap gap-1.5">
            {c.interests.map((i) => (
              <span key={i} className="rounded-full bg-surface px-2.5 py-1 text-xs text-heading">
                {i}
              </span>
            ))}
          </div>
        </Section>

        <Section icon={<Bell className="h-3.5 w-3.5" />} title="Follow-ups">
          <ul className="space-y-1.5 text-sm">
            <AnimatePresence initial={false}>
              {populated ? (
                <motion.li
                  key="voice-followup"
                  layout
                  {...enter}
                  transition={{ duration: 0.35, delay: reduce ? 0 : 0.15 }}
                  className="flex items-start justify-between gap-2 rounded-lg bg-cal-networking/70 px-2.5 py-1.5"
                >
                  <span className="text-heading">{c.fromVoiceNote.followUp.title}</span>
                  <span className="shrink-0 text-xs text-[#2f5d53]">{c.fromVoiceNote.followUp.due}</span>
                </motion.li>
              ) : null}
            </AnimatePresence>
            {c.followUps.map((f) => (
              <li key={f.title} className="flex items-start justify-between gap-2 px-2.5 py-1">
                <span className="text-body">{f.title}</span>
                <span className="shrink-0 text-xs text-subtle">{f.due}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={<CalendarClock className="h-3.5 w-3.5" />} title="Timeline">
          <ol className="relative ml-1.5 space-y-2 border-l border-line pl-3 text-sm">
            <AnimatePresence initial={false}>
              {populated ? (
                <motion.li key="voice-timeline" layout {...enter} transition={{ duration: 0.35, delay: reduce ? 0 : 0.3 }} className="relative">
                  <Dot active />
                  <span className="text-xs text-[#2f5d53]">{c.fromVoiceNote.timeline.date}</span>
                  <p className="text-heading">{c.fromVoiceNote.timeline.label}</p>
                </motion.li>
              ) : null}
            </AnimatePresence>
            {[...c.timeline].reverse().map((t) => (
              <li key={t.date} className="relative">
                <Dot />
                <span className="text-xs text-subtle">{t.date}</span>
                <p className="text-body">{t.label}</p>
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title}>
      <h5 className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-subtle">
        <span aria-hidden="true">{icon}</span>
        {title}
      </h5>
      {children}
    </section>
  );
}

function Dot({ active = false }: { active?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -left-[1.1rem] top-1.5 h-2 w-2 rounded-full border-2 border-card",
        active ? "bg-primary" : "bg-accent-light",
      )}
    />
  );
}
