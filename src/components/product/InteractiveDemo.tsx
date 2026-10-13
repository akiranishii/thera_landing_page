"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Mic, RotateCcw, Sparkles } from "lucide-react";
import { ContactCard } from "./ContactCard";
import { CalendarPreview } from "./CalendarPreview";
import { RelationshipTimeline } from "./RelationshipTimeline";
import { TalentProfileCard } from "./TalentProfile";
import { Avatar } from "@/components/ui/Avatar";
import { BrandSymbol } from "@/components/ui/Wordmark";
import { Waveform } from "@/components/ui/Waveform";
import { DemoLabel } from "@/components/ui/DemoLabel";
import { demo } from "@/config/copy";
import {
  scenarioLocation,
  scenarios,
  talentProfiles,
  type Scenario,
  type ScenarioId,
} from "@/config/demo-data";
import { brand } from "@/config/brand";
import { cn } from "@/lib/cn";

type Phase = "user" | "thinking" | "typing" | "done";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The signature "just ask" demonstration. Fully scripted with local sample data;
 * no model, network request or microphone is involved.
 */
export function InteractiveDemo() {
  const [active, setActive] = useState<ScenarioId>("location");
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<Phase>("user");
  const reduce = useReducedMotion();
  const scenario = scenarios.find((s) => s.id === active) ?? scenarios[0];
  const runKey = `${active}-${run}`;

  const select = (id: ScenarioId) => {
    setPhase("user");
    if (id === active) setRun((r) => r + 1);
    else setActive(id);
  };
  const replay = () => {
    setPhase("user");
    setRun((r) => r + 1);
  };

  const done = phase === "done" || !!reduce;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-card">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <span className="flex items-center gap-2 text-sm font-medium text-heading">
          <BrandSymbol className="h-4 w-4" />
          {brand.name}
        </span>
        <span className="rounded-full bg-surface px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-wider text-primary">
          {demo.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Conversation */}
        <div className="flex flex-col border-b border-line lg:border-b-0 lg:border-r">
          <div className="px-4 pt-4 sm:px-5">
            <p className="mb-2 text-[0.6875rem] font-medium uppercase tracking-wider text-subtle">Try a request</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap" role="group" aria-label="Sample requests">
              {scenarios.map((s) => {
                const selected = s.id === active;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => select(s.id)}
                    aria-pressed={selected}
                    className={cn(
                      "min-h-11 rounded-full border px-4 py-2 text-left text-[0.8125rem] font-medium transition-colors duration-200 sm:text-sm",
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-line bg-card text-heading hover:border-accent-light hover:bg-surface",
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 space-y-3 px-4 py-4 sm:px-5" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={runKey}
                className="space-y-3"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Conversation key={runKey} scenario={scenario} reduce={!!reduce} onPhase={setPhase} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Input bar (illustrative) */}
          <div className="border-t border-line px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2 rounded-full border border-line bg-bg py-1.5 pl-4 pr-1.5">
              <span className="min-w-0 flex-1 truncate text-sm text-subtle">Ask {brand.name} anything about your network…</span>
              <Waveform bars={6} active={phase === "thinking"} className="hidden shrink-0 sm:flex" />
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white"
                title={demo.micHint}
                aria-hidden="true"
              >
                <Mic className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <DemoLabel className="text-[0.6875rem]">{demo.micHint}</DemoLabel>
              <button
                type="button"
                onClick={replay}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-primary hover:bg-surface"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {demo.replay}
              </button>
            </div>
          </div>
        </div>

        {/* Result panel */}
        <div className="bg-bg/60 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-wider text-subtle">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {active === "location" ? "People and availability" : active === "memory" ? "Relationship memory" : "Suggested people"}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.div
                key={`${runKey}-result`}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease }}
              >
                {active === "location" ? <LocationResult reduce={!!reduce} /> : null}
                {active === "memory" ? <RelationshipTimeline /> : null}
                {active === "discover" ? <DiscoverResult reduce={!!reduce} /> : null}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="flex min-h-[14rem] items-center justify-center rounded-xl border border-dashed border-line px-4 text-center text-sm text-subtle"
                initial={false}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
              >
                {phase === "user" ? "Listening…" : "Looking across your relationships and calendar…"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/**
 * One scripted exchange. Mounted fresh (via `key`) for every run, so its state starts clean.
 * Timers drive the phases and report them to the parent through `onPhase`.
 */
function Conversation({
  scenario,
  reduce,
  onPhase,
}: {
  scenario: Scenario;
  reduce: boolean;
  onPhase: (phase: Phase) => void;
}) {
  const words = scenario.response.split(" ");
  const [phase, setLocalPhase] = useState<Phase>(reduce ? "done" : "user");
  const [typed, setTyped] = useState(reduce ? words.length : 0);

  const advance = useCallback(
    (next: Phase) => {
      setLocalPhase(next);
      onPhase(next);
    },
    [onPhase],
  );

  useEffect(() => {
    if (reduce) return;
    const t1 = setTimeout(() => advance("thinking"), 350);
    const t2 = setTimeout(() => advance("typing"), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduce, advance]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typed >= words.length) {
      const t = setTimeout(() => advance("done"), 200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTyped((n) => n + 1), 42);
    return () => clearTimeout(t);
  }, [phase, typed, words.length, advance]);

  return (
    <>
      {/* User bubble */}
      <motion.div
        className="flex items-end justify-end gap-2"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
      >
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-white">{scenario.prompt}</p>
        <Avatar name="You" tone={4} size="sm" />
      </motion.div>

      {/* Assistant bubble */}
      {phase !== "user" ? (
        <motion.div
          className="flex items-end gap-2"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface">
            <BrandSymbol className="h-4 w-4" />
          </span>
          <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-line bg-bg px-4 py-2.5 text-sm text-heading">
            {phase === "thinking" ? (
              <span className="flex items-center gap-1 py-1" aria-label="Thinking">
                <Dot delay={0} />
                <Dot delay={0.15} />
                <Dot delay={0.3} />
              </span>
            ) : (
              <span>
                {words.slice(0, typed).join(" ")}
                {phase === "typing" ? (
                  <span className="pulse-soft ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 bg-primary" aria-hidden="true" />
                ) : null}
              </span>
            )}
          </div>
        </motion.div>
      ) : null}
    </>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="pulse-soft inline-block h-1.5 w-1.5 rounded-full bg-muted"
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    />
  );
}

function Stagger({ children, index, reduce }: { children: React.ReactNode; index: number; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: reduce ? 0 : 0.08 * index, ease }}
    >
      {children}
    </motion.div>
  );
}

function LocationResult({ reduce }: { reduce: boolean }) {
  return (
    <div className="space-y-2">
      {scenarioLocation.contacts.map((p, i) => (
        <Stagger key={p.id} index={i} reduce={reduce}>
          <ContactCard person={p} />
        </Stagger>
      ))}
      <Stagger index={3} reduce={reduce}>
        <CalendarPreview
          title="Availability"
          day={scenarioLocation.availability.day}
          items={scenarioLocation.availability.slots}
          className="shadow-card"
        />
      </Stagger>
    </div>
  );
}

function DiscoverResult({ reduce }: { reduce: boolean }) {
  return (
    <div className="space-y-2">
      {talentProfiles.map((p, i) => (
        <Stagger key={p.id} index={i} reduce={reduce}>
          <TalentProfileCard profile={p} />
        </Stagger>
      ))}
      <p className="pt-1 text-[0.6875rem] leading-5 text-subtle">
        {"“"}Verified contribution{"”"} means the example work is attributed to a public source.{" "}
        {"“"}Inferred fit{"”"} means the match is a suggestion based on interests and paths, not a confirmed fact. All profiles are fictional.
      </p>
    </div>
  );
}
