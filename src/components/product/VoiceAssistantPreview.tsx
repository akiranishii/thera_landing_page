import { Mic } from "lucide-react";
import { Waveform } from "@/components/ui/Waveform";
import { cn } from "@/lib/cn";

/**
 * The illustrative voice pill. The microphone is decorative: this page never records audio.
 */
export function VoiceAssistantPreview({
  text,
  active = true,
  className,
  compact = false,
}: {
  text: string;
  active?: boolean;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-full border border-line bg-card pr-3 shadow-card",
        compact ? "p-1.5" : "p-2",
        className,
      )}
      title="Illustrative voice interface"
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-primary text-white",
          compact ? "h-8 w-8" : "h-10 w-10",
          active && "pulse-soft",
        )}
      >
        <Mic className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </span>
      <p className={cn("min-w-0 flex-1 truncate text-heading", compact ? "text-xs" : "text-sm")}>
        <span className="sr-only">Sample voice command: </span>
        {"“"}
        {text}
        {"”"}
      </p>
      <Waveform bars={compact ? 8 : 12} active={active} className="shrink-0" />
    </div>
  );
}
