import { BadgeCheck, Compass, Route, Sparkles, Telescope } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { DemoLabel } from "@/components/ui/DemoLabel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { discover } from "@/config/copy";
import { researcherProfile } from "@/config/demo-data";

const icons = { expertise: Telescope, paths: Route, purpose: Compass } as const;

export function Discover() {
  return (
    <section id="discover" className="bg-surface/50 py-20 sm:py-28" aria-labelledby="discover-title">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeading eyebrow={discover.eyebrow} headline={discover.headline} body={discover.body} />
            </Reveal>
            <ul className="mt-10 space-y-6">
              {discover.capabilities.map((c, i) => {
                const Icon = icons[c.icon];
                return (
                  <Reveal as="li" key={c.title} delay={0.06 * i} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-card text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-heading">{c.title}</h3>
                      <p className="mt-1 text-pretty text-[0.9375rem] leading-relaxed text-body">{c.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          <Reveal delay={0.15} className="lg:pt-10">
            <ResearcherProfile />
            <DemoLabel className="mt-3">{discover.disclaimer}</DemoLabel>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function ResearcherProfile() {
  const r = researcherProfile;
  return (
    <article className="rounded-2xl border border-line bg-card shadow-card" aria-label={`Example profile: ${r.name}`}>
      <div className="flex items-center gap-3 border-b border-line p-5">
        <Avatar name={r.name} tone={r.tone} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-heading">{r.name}</h3>
          <p className="text-sm text-body">{r.title}</p>
        </div>
        <Badge tone="mint" icon={<BadgeCheck className="h-3 w-3" aria-hidden="true" />}>
          Verified work
        </Badge>
      </div>
      <dl className="divide-y divide-line">
        {r.rows.map((row) => (
          <div key={row.label} className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-[0.6875rem] font-medium uppercase tracking-wider text-subtle sm:pt-0.5">{row.label}</dt>
            <dd className="text-[0.9375rem] text-heading">
              {row.value}
              {"verified" in row && row.verified ? (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-[#2f5d53]">
                  <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                  verified source
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
      <div className="m-5 mt-2 flex items-start gap-2 rounded-xl bg-surface/70 p-3 text-sm text-heading">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p>{r.why}</p>
      </div>
    </article>
  );
}
