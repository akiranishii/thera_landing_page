import { CalendarCheck, MapPinned, NotebookPen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DemoLabel } from "@/components/ui/DemoLabel";
import { CitySelector } from "@/components/product/CitySelector";
import { SchedulingDemo } from "@/components/product/SchedulingDemo";
import { VoiceNoteDemo } from "@/components/product/VoiceNoteDemo";
import { features } from "@/config/copy";
import { cn } from "@/lib/cn";

function FeaturePanel({
  index,
  icon: Icon,
  label,
  headline,
  body,
  children,
  flip = false,
  id,
}: {
  index: string;
  icon: typeof NotebookPen;
  label: string;
  headline: string;
  body: string;
  children: React.ReactNode;
  flip?: boolean;
  id: string;
}) {
  return (
    <Reveal as="article" className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
      <div className={cn("lg:sticky lg:top-28", flip && "lg:order-2")} id={id}>
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-subtle">{index}</span>
          {label}
        </div>
        <h3 className="mt-4 text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] text-heading sm:text-[2rem]">
          {headline}
        </h3>
        <p className="mt-4 max-w-md text-pretty text-[1.0625rem] leading-relaxed text-body">{body}</p>
      </div>
      <div className={cn("min-w-0", flip && "lg:order-1")}>{children}</div>
    </Reveal>
  );
}

export function Features() {
  return (
    <section id="product" className="bg-surface/50 py-20 sm:py-28" aria-labelledby="features-title">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={features.eyebrow} headline={features.headline} align="center" className="mx-auto max-w-2xl" />
        </Reveal>

        <div className="mt-16 space-y-24 sm:mt-20 sm:space-y-32">
          <FeaturePanel
            id="remember"
            index="01"
            icon={NotebookPen}
            label={features.remember.label}
            headline={features.remember.headline}
            body={features.remember.body}
          >
            <VoiceNoteDemo />
          </FeaturePanel>

          <FeaturePanel
            id="around"
            index="02"
            icon={MapPinned}
            label={features.around.label}
            headline={features.around.headline}
            body={features.around.body}
            flip
          >
            <div className="space-y-3">
              <CitySelector />
              <DemoLabel>{features.around.disclaimer}</DemoLabel>
            </div>
          </FeaturePanel>

          <FeaturePanel
            id="meet"
            index="03"
            icon={CalendarCheck}
            label={features.meet.label}
            headline={features.meet.headline}
            body={features.meet.body}
          >
            <SchedulingDemo />
          </FeaturePanel>
        </div>
      </Container>
    </section>
  );
}
