"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DemoLabel } from "@/components/ui/DemoLabel";
import { AssistantNote } from "@/components/product/AssistantNote";
import { CalendarPreview } from "@/components/product/CalendarPreview";
import { PhoneMockup } from "@/components/product/PhoneMockup";
import { hero } from "@/config/copy";
import { heroScreen } from "@/config/demo-data";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        };

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-10 sm:pt-16 lg:pb-24 lg:pt-20" aria-labelledby="hero-title">
      {/* Soft backdrop wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(60%_50%_at_70%_20%,rgba(196,213,224,0.35),transparent_70%)]"
      />
      <Container wide>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="max-w-xl">
            <motion.div {...fade(0)}>
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h1
              id="hero-title"
              className="mt-4 text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] text-heading sm:text-6xl lg:text-[4.25rem]"
              {...fade(0.05)}
            >
              {hero.headline.lead} <span className="serif-emphasis">{hero.headline.emphasis}</span>
            </motion.h1>
            <motion.p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-body sm:text-xl" {...fade(0.12)}>
              {hero.supporting}
            </motion.p>
            <motion.p className="mt-4 text-[0.9375rem] font-medium text-heading" {...fade(0.16)}>
              {hero.underline}
            </motion.p>
            <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" {...fade(0.22)}>
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href={hero.secondaryCta.href} size="lg" variant="secondary">
                {hero.secondaryCta.label}
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </Button>
            </motion.div>
          </div>

          {/* Product visualization */}
          <motion.div className="relative" {...fade(0.2)}>
            <div className="relative mx-auto max-w-[340px]">
              <PhoneMockup />
              {/* Floating cards on larger screens */}
              <motion.div
                className="absolute -left-52 top-24 hidden w-60 xl:block"
                {...(reduce ? {} : { initial: { opacity: 0, x: -12 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7, delay: 0.5, ease } })}
              >
                <CalendarPreview day={heroScreen.calendar.day} items={heroScreen.calendar.items} />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -right-44 hidden w-60 xl:block"
                {...(reduce ? {} : { initial: { opacity: 0, x: 12 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7, delay: 0.65, ease } })}
              >
                <AssistantNote className="bg-card shadow-float" label="Recommendation">
                  {"“"}{heroScreen.recommendation}{"”"}
                </AssistantNote>
              </motion.div>
            </div>

            {/* Same supporting cards, stacked, on small screens */}
            <div className="mx-auto mt-5 grid max-w-[340px] grid-cols-1 gap-3 sm:max-w-xl sm:grid-cols-2 lg:max-w-[340px] lg:grid-cols-1 xl:hidden">
              <CalendarPreview day={heroScreen.calendar.day} items={heroScreen.calendar.items} className="shadow-card" />
              <AssistantNote className="bg-card" label="Recommendation">
                {"“"}{heroScreen.recommendation}{"”"}
              </AssistantNote>
            </div>

            <DemoLabel className="mx-auto mt-4 max-w-[340px] justify-center sm:max-w-xl xl:mx-0 xl:max-w-none xl:justify-end">
              {hero.illustrativeLabel}
            </DemoLabel>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
