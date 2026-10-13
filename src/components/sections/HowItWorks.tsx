import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { howItWorks } from "@/config/copy";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28" aria-labelledby="how-title">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={howItWorks.eyebrow} headline={howItWorks.headline} align="center" className="mx-auto max-w-2xl" />
        </Reveal>
        <ol className="relative mt-14 grid gap-10 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Progression line (desktop) */}
          <div aria-hidden="true" className="absolute left-0 right-0 top-5 hidden h-px bg-line lg:block" />
          {howItWorks.steps.map((s, i) => (
            <Reveal as="li" key={s.number} delay={0.08 * i} className="relative flex gap-4 lg:flex-col lg:gap-5">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-card text-xs font-semibold tabular-nums text-primary shadow-card">
                {s.number}
              </span>
              {/* Vertical connector on small screens */}
              {i < howItWorks.steps.length - 1 ? (
                <span aria-hidden="true" className="absolute left-5 top-10 h-[calc(100%+1rem)] w-px bg-line sm:hidden" />
              ) : null}
              <div>
                <h3 className="text-lg font-semibold text-heading">{s.title}</h3>
                <p className="mt-1.5 text-pretty text-[0.9375rem] leading-relaxed text-body">{s.body}</p>
                {"note" in s && s.note ? (
                  <div className="mt-3">
                    <Badge tone="outline">Planned</Badge>
                    <p className="mt-1.5 text-xs leading-5 text-subtle">{s.note}</p>
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
