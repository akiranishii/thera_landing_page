import { Gem, HeartHandshake, Sun } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { philosophy } from "@/config/copy";

const icons = [Gem, HeartHandshake, Sun];

export function Philosophy() {
  return (
    <section id="philosophy" className="bg-ink py-20 text-bg sm:py-28" aria-labelledby="philosophy-title">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <SectionHeading eyebrow={philosophy.eyebrow} headline={philosophy.headline} tone="light" />
            <div className="mt-8 space-y-5 text-pretty text-lg leading-relaxed text-accent-light">
              {philosophy.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <ul className="space-y-4 lg:pt-12">
            {philosophy.principles.map((p, i) => {
              const Icon = icons[i];
              return (
                <Reveal as="li" key={p.title} delay={0.08 * i} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-bg">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-bg">{p.title}</h3>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-accent-light">{p.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
