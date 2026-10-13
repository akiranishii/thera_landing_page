"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, LoaderCircle, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { earlyAccess } from "@/config/copy";
import { roles } from "@/config/roles";
import { isValidEmail, normalizeEmail } from "@/lib/waitlist/validate";
import { cn } from "@/lib/cn";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; status: "created" | "exists" }
  | { kind: "error"; message: string };

export function WaitlistForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  // Set when the form mounts in the browser; used by the API to reject instant bot submissions.
  const startedAt = useRef<number | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [touched, setTouched] = useState(false);
  const reduce = useReducedMotion();
  const copy = earlyAccess.form;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const normalized = normalizeEmail(email);
  const emailInvalid = touched && !isValidEmail(normalized);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true);
    if (!isValidEmail(normalized)) {
      setState({ kind: "error", message: "Please enter a valid email address." });
      return;
    }
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, role: role || null, website, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; status: "created" | "exists" }
        | { ok: false; error: string }
        | null;
      if (res.ok && data && data.ok) {
        setState({ kind: "success", status: data.status });
      } else {
        setState({
          kind: "error",
          message: (data && !data.ok && data.error) || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setState({ kind: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  if (state.kind === "success") {
    return (
      <motion.div
        role="status"
        className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-line bg-bg p-6 text-center"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cal-networking text-[#2f5d53]">
          <Check className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-base font-medium text-heading">{state.status === "exists" ? copy.alreadyOnList : copy.success}</p>
      </motion.div>
    );
  }

  const submitting = state.kind === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto max-w-md" aria-describedby={`${id}-note`}>
      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-medium text-heading">
            {copy.emailLabel}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder={copy.emailPlaceholder}
            aria-invalid={emailInvalid || undefined}
            aria-describedby={emailInvalid ? `${id}-email-error` : undefined}
            disabled={submitting}
            className={cn(
              "h-12 w-full rounded-xl border bg-card px-4 text-base text-heading placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-60",
              emailInvalid ? "border-[#b4604f]" : "border-line",
            )}
          />
          {emailInvalid ? (
            <p id={`${id}-email-error`} className="mt-1.5 text-sm text-[#9a4e3f]">
              Please enter a valid email address.
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${id}-role`} className="mb-1.5 block text-sm font-medium text-heading">
            {copy.roleLabel}
          </label>
          <div className="relative">
            <select
              id={`${id}-role`}
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={submitting}
              className="h-12 w-full appearance-none rounded-xl border border-line bg-card px-4 pr-10 text-base text-heading focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
            >
              <option value="">{copy.rolePlaceholder}</option>
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Honeypot: hidden from people, tempting for bots. */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input
            id={`${id}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={submitting} aria-busy={submitting}>
          {submitting ? (
            <>
              <LoaderCircle className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
              {copy.submitting}
            </>
          ) : (
            <>
              {copy.submit}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>

        <AnimatePresence>
          {state.kind === "error" ? (
            <motion.p
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-[#e7cfc9] bg-[#fbf3f1] px-3.5 py-2.5 text-sm text-[#7a3f33]"
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {state.message}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <p id={`${id}-note`} className="text-center text-xs leading-5 text-subtle">
          {copy.privacyNote}
        </p>
      </div>
    </form>
  );
}
