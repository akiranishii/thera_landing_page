import { CalendarX2, Puzzle, UserRoundX } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { problem } from "@/config/copy";

const icons = [UserRoundX, CalendarX2, Puzzle];

export function Problem() {
  return (
    <section id="problem" className="py-20 sm:py-28" aria-labelledby="problem-title">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={problem.eyebrow} headline={problem.headline} body={problem.body} className="max-w-3xl" />
        </Reveal>
        <ul className="mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {problem.pains.map((p, i) => {
            const Icon = icons[i];
            return (
              <Reveal as="li" key={p.title} delay={i * 0.08} className="flex flex-col gap-3 border-t border-line pt-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="text-balance text-lg font-semibold leading-snug text-heading">{p.title}</h3>
                <p className="text-pretty text-[0.9375rem] leading-relaxed text-body">{p.body}</p>
              </Reveal>
            );
          })}
        </ul>
        <Reveal className="mt-16 sm:mt-20">
          <p className="max-w-2xl text-balance text-xl font-medium leading-snug text-heading sm:text-2xl">
            <span className="serif-emphasis">{problem.transition}</span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
