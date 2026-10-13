import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import { earlyAccess } from "@/config/copy";

export function EarlyAccess() {
  return (
    <section id="early-access" className="pb-20 pt-6 sm:pb-28 sm:pt-10" aria-labelledby="early-access-title">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-card px-6 py-14 shadow-card sm:px-12 sm:py-20 lg:px-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(234,240,244,0.9),transparent_70%)]"
            />
            <div className="relative mx-auto max-w-2xl">
              <SectionHeading
                eyebrow={earlyAccess.eyebrow}
                headline={earlyAccess.headline}
                body={earlyAccess.supporting}
                align="center"
              />
              <div className="mt-10">
                <WaitlistForm />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
