import { ChevronDown, MapPin } from "lucide-react";
import { ContactCard } from "./ContactCard";
import { VoiceAssistantPreview } from "./VoiceAssistantPreview";
import { heroScreen } from "@/config/demo-data";
import { cn } from "@/lib/cn";

/**
 * A realistic phone frame showing the "Who's around?" screen.
 * Built entirely with HTML and CSS so it stays crisp at any size.
 */
export function PhoneMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[340px] rounded-[2.6rem] border border-line bg-card p-2.5 shadow-phone",
        className,
      )}
      role="img"
      aria-label="Phone screen titled Who's around, listing three example contacts in San Francisco with suggested actions and a voice command."
    >
      <div className="relative overflow-hidden rounded-[2.1rem] bg-bg">
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-2.5 h-5 w-24 -translate-x-1/2 rounded-full bg-heading" aria-hidden="true" />
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[0.6875rem] font-semibold text-heading" aria-hidden="true">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-heading/70" />
            <span className="h-2 w-2 rounded-full bg-heading/70" />
            <span className="h-2.5 w-5 rounded-sm border border-heading/60" />
          </span>
        </div>

        <div className="px-4 pb-4 pt-2">
          <header className="mb-3">
            <h3 className="text-lg font-semibold tracking-tight text-heading">{heroScreen.title}</h3>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-heading"
            >
              <MapPin className="h-3 w-3 text-primary" />
              City: {heroScreen.city}
              <ChevronDown className="h-3 w-3 text-subtle" />
            </button>
          </header>

          <div className="space-y-2">
            {heroScreen.contacts.map((p) => (
              <ContactCard key={p.id} person={p} compact showPresenceLabel={false} />
            ))}
          </div>

          <VoiceAssistantPreview text={heroScreen.voicePrompt} compact className="mt-3" />
        </div>
        {/* Home indicator */}
        <div className="mx-auto mb-2 h-1 w-24 rounded-full bg-heading/30" aria-hidden="true" />
      </div>
    </div>
  );
}
