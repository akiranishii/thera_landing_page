"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Clock, Footprints, MapPin, MessageSquareText, X } from "lucide-react";
import { AssistantNote } from "./AssistantNote";
import { CalendarWeek, type ProposalState } from "./CalendarWeek";
import { Button } from "@/components/ui/Button";
import { DemoLabel } from "@/components/ui/DemoLabel";
import { calendarWeek } from "@/config/demo-data";
import { features } from "@/config/copy";

/**
 * "Make the meeting happen" demonstration: the assistant proposes a slot, you review it,
 * preview it on the calendar, and approve it. Nothing leaves the page.
 */
export function SchedulingDemo() {
  const [proposal, setProposal] = useState<ProposalState>("hidden");
  const [reviewing, setReviewing] = useState(false);
  const reduce = useReducedMotion();
  const p = calendarWeek.proposal;

  const approve = () => {
    setProposal("approved");
    setReviewing(false);
  };
  const reset = () => {
    setProposal("hidden");
    setReviewing(false);
  };

  return (
    <div className="space-y-3">
      <CalendarWeek proposal={proposal} />

      <AnimatePresence mode="wait" initial={false}>
        {proposal === "approved" ? (
          <motion.div
            key="approved"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-card p-4"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cal-networking text-[#2f5d53]">
              <Check className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-heading">Approved in this preview</p>
              <p className="text-xs text-subtle">In the product, {"“"}approve{"”"} would send the message and hold the time. Here, nothing is sent.</p>
            </div>
            <Button variant="secondary" size="sm" onClick={reset}>
              Reset
            </Button>
          </motion.div>
        ) : reviewing ? (
          <motion.div
            key="review"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-line bg-card p-4"
            role="region"
            aria-label="Review suggestion"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-heading">{p.title}</p>
                <p className="text-xs text-subtle">Proposed by your assistant · needs your approval</p>
              </div>
              <button
                type="button"
                onClick={() => setReviewing(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-subtle hover:bg-surface hover:text-heading"
                aria-label="Close review"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <Row icon={<Clock className="h-3.5 w-3.5" />} label="When" value={p.when} />
              <Row icon={<MapPin className="h-3.5 w-3.5" />} label="Where" value={p.where} />
              <Row icon={<Footprints className="h-3.5 w-3.5" />} label="Travel" value={p.travel} />
              <Row icon={<Clock className="h-3.5 w-3.5" />} label="Buffer" value={p.buffer} />
            </dl>
            <div className="mt-3 rounded-xl bg-surface/70 p-3">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
                Draft message to Alex
              </p>
              <p className="text-sm text-heading">{p.message}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={approve}>
                <Check className="h-4 w-4" aria-hidden="true" />
                Approve (preview)
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setProposal("ghost")}>
                {features.meet.previewCta}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setReviewing(false)}>
                Not now
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="suggestion"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AssistantNote
              actions={
                <>
                  <Button size="sm" onClick={() => setReviewing(true)}>
                    {features.meet.reviewCta}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setProposal((s) => (s === "ghost" ? "hidden" : "ghost"))}
                    aria-pressed={proposal === "ghost"}
                  >
                    {proposal === "ghost" ? "Hide preview" : features.meet.previewCta}
                  </Button>
                </>
              }
            >
              {features.meet.suggestion}
            </AssistantNote>
          </motion.div>
        )}
      </AnimatePresence>

      <DemoLabel>{features.meet.disclaimer}</DemoLabel>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-subtle" aria-hidden="true">
        {icon}
      </span>
      <div>
        <dt className="text-[0.6875rem] uppercase tracking-wider text-subtle">{label}</dt>
        <dd className="text-heading">{value}</dd>
      </div>
    </div>
  );
}
