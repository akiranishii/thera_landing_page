import { Eye, HandMetal, Lock, Plane, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { privacy } from "@/config/copy";

const icons = [Lock, ShieldCheck, Plane, SlidersHorizontal, HandMetal, Eye];

export function Privacy() {
  return (
    <section id="privacy" className="py-20 sm:py-28" aria-labelledby="privacy-title">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={privacy.eyebrow} headline={privacy.headline} body={privacy.intro} className="max-w-3xl" />
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {privacy.principles.map((p, i) => {
            const Icon = icons[i];
            return (
              <Reveal as="li" key={p.title} delay={0.05 * i} className="rounded-2xl border border-line bg-card p-5 shadow-card">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-heading">{p.title}</h3>
                <p className="mt-1.5 text-pretty text-[0.9375rem] leading-relaxed text-body">{p.body}</p>
              </Reveal>
            );
          })}
        </ul>
        <Reveal className="mt-8">
          <p className="max-w-2xl text-sm leading-6 text-subtle">{privacy.footnote}</p>
        </Reveal>
      </Container>
    </section>
  );
}
