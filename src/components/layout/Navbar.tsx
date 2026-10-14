"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { nav } from "@/config/copy";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || open
          ? "border-b border-line bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/75"
          : "border-b border-transparent bg-bg/0",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:text-heading"
      >
        Skip to content
      </a>
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center rounded-md">
          <Wordmark />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-body transition-colors hover:bg-surface hover:text-heading"
            >
              {l.label}
            </a>
          ))}
          <Button href={nav.cta.href} size="sm" className="ml-2">
            {nav.cta.label}
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button href={nav.cta.href} size="sm" className="px-3.5">
            Early Access
          </Button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full text-heading hover:bg-surface"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Primary"
            className="absolute inset-x-0 top-full border-b border-line bg-bg/95 backdrop-blur-md md:hidden"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <Container className="py-3">
              <ul className="overflow-hidden rounded-2xl border border-line bg-card shadow-card">
                {nav.links.map((l) => (
                  <li key={l.href} className="border-b border-line last:border-b-0">
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3.5 text-[0.9375rem] font-medium text-heading hover:bg-surface"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={nav.cta.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3.5 text-[0.9375rem] font-medium text-primary hover:bg-surface"
                  >
                    {nav.cta.label}
                  </a>
                </li>
              </ul>
            </Container>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
