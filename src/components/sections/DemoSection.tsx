import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InteractiveDemo } from "@/components/product/InteractiveDemo";
import { demo } from "@/config/copy";

export function DemoSection() {
  return (
    <section id="demo" className="py-20 sm:py-28" aria-labelledby="demo-title">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={demo.eyebrow} headline={demo.headline} body={demo.supporting} align="center" className="mx-auto max-w-2xl" />
        </Reveal>
        <Reveal className="mt-12 sm:mt-16" delay={0.1}>
          <InteractiveDemo />
        </Reveal>
      </Container>
    </section>
  );
}
