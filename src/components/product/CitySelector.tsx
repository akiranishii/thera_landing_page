"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { MapPin } from "lucide-react";
import { ContactCard } from "./ContactCard";
import { cities } from "@/config/demo-data";
import { cn } from "@/lib/cn";

/**
 * Location-aware CRM preview: pick a city, see who is relevant there.
 * Contact cards animate between cities; everything is local sample data.
 */
export function CitySelector({ className }: { className?: string }) {
  const [cityId, setCityId] = useState(cities[0].id);
  const reduce = useReducedMotion();
  const city = cities.find((c) => c.id === cityId) ?? cities[0];

  return (
    <div className={cn("rounded-2xl border border-line bg-bg p-3 sm:p-4", className)}>
      <div
        role="tablist"
        aria-label="Choose a city"
        className="grid grid-cols-3 gap-2"
      >
        {cities.map((c) => {
          const selected = c.id === cityId;
          return (
            <button
              key={c.id}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`city-panel-${c.id}`}
              id={`city-tab-${c.id}`}
              onClick={() => setCityId(c.id)}
              className={cn(
                "flex min-h-[3.25rem] flex-col items-start justify-center rounded-xl border px-3 py-2 text-left transition-colors duration-200",
                selected
                  ? "border-primary bg-card shadow-card"
                  : "border-line bg-card/60 hover:border-accent-light hover:bg-card",
              )}
            >
              <span className={cn("flex items-center gap-1 text-[0.8125rem] font-semibold", selected ? "text-heading" : "text-body")}>
                <MapPin className={cn("h-3 w-3", selected ? "text-primary" : "text-subtle")} aria-hidden="true" />
                <span className="sm:hidden">{c.short}</span>
                <span className="hidden sm:inline">{c.name}</span>
              </span>
              <span className="text-[0.6875rem] text-subtle">{c.count} relevant people</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`city-panel-${city.id}`}
        aria-labelledby={`city-tab-${city.id}`}
        className="mt-3"
      >
        <p className="mb-2 flex items-baseline justify-between px-1 text-xs text-subtle">
          <span>
            <span className="font-medium text-heading">{city.name}</span> · {city.count} relevant people
          </span>
          <span>Showing 3</span>
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={city.id}
            className="space-y-2"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {city.contacts.map((p, i) => (
              <motion.li
                key={p.id}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: reduce ? 0 : 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              >
                <ContactCard person={p} />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
