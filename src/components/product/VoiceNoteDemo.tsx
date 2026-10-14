"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Mic, Play, RotateCcw } from "lucide-react";
import { ContactProfile } from "./ContactProfile";
import { Waveform } from "@/components/ui/Waveform";
import { DemoLabel } from "@/components/ui/DemoLabel";
import { features } from "@/config/copy";
import { cn } from "@/lib/cn";

type Phase = "idle" | "listening" | "populated";

/**
 * "Remember everyone" demonstration. A scripted voice note is "transcribed" word by word,
 * then the relevant note, follow-up and timeline entry appear on the contact profile.
 * This is a scripted demo of a proposed feature; it does not use the microphone.
 */
export function VoiceNoteDemo() {
  const words = features.remember.voiceNote.split(" ");
  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(0);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const started = useRef(false);

  const play = () => {
    if (reduce) {
      setShown(words.length);
      setPhase("populated");
      return;
    }
    setShown(0);
    setPhase("listening");
  };

  const reset = () => {
    setShown(0);
    setPhase("idle");
  };

  // Auto-play once when scrolled into view.
  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      const t = setTimeout(play, 500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Word-by-word transcription, then populate.
  useEffect(() => {
    if (phase !== "listening") return;
    if (shown >= words.length) {
      const t = setTimeout(() => setPhase("populated"), 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((s) => s + 1), 95);
    return () => clearTimeout(t);
  }, [phase, shown, words.length]);

  const listening = phase === "listening";
  const populated = phase === "populated";

  return (
    <div ref={ref} className="space-y-3">
      <div className="rounded-2xl border border-line bg-card p-3 shadow-card sm:p-4" aria-live="polite">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors",
              listening ? "bg-primary pulse-soft" : populated ? "bg-cal-networking text-[#2f5d53]" : "bg-primary",
            )}
          >
            <Mic className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.6875rem] font-medium uppercase tracking-wider text-subtle">
              {listening ? "Listening (simulated)" : populated ? "Saved to Maya's profile" : "Voice note"}
            </p>
            <p className="min-h-[1.5rem] text-sm text-heading">
              {phase === "idle" ? (
                <span className="text-subtle">Press play to hear how a quick voice note becomes structured memory.</span>
              ) : (
                <>
                  {"“"}
                  {words.slice(0, shown).join(" ")}
                  {listening && shown < words.length ? <span className="text-subtle">…</span> : "”"}
                </>
              )}
            </p>
          </div>
          <Waveform bars={9} active={listening} className="hidden shrink-0 sm:flex" />
          {phase === "idle" ? (
            <button
              type="button"
              onClick={play}
              className="flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-surface px-3 text-xs font-medium text-heading hover:bg-accent-light/60"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Play example</span>
              <span className="sr-only sm:hidden">Play example</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={populated ? reset : undefined}
              disabled={listening}
              className="flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-surface px-3 text-xs font-medium text-heading hover:bg-accent-light/60 disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Replay</span>
              <span className="sr-only sm:hidden">Replay</span>
            </button>
          )}
        </div>
      </div>

      <ContactProfile populated={populated} />
      <DemoLabel>{features.remember.disclaimer}</DemoLabel>
    </div>
  );
}
