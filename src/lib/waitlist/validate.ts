import { isRole } from "@/config/roles";

export const MAX_EMAIL_LENGTH = 254;

// Pragmatic RFC 5322 subset: local@domain.tld with no spaces or consecutive dots.
const EMAIL_RE = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > MAX_EMAIL_LENGTH) return false;
  if (email.includes("..")) return false;
  return EMAIL_RE.test(email);
}

export interface WaitlistInput {
  email: string;
  role: string | null;
  /** Honeypot field: must be empty for humans. */
  website: string;
  /** Client timestamp (ms) when the form was rendered, used to reject instant bot submissions. */
  startedAt: number | null;
}

export type ParseResult = { ok: true; value: WaitlistInput } | { ok: false; error: string };

/** Validates and normalizes a raw request body. Never trusts the shape of the input. */
export function parseWaitlistBody(body: unknown): ParseResult {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request body." };
  const b = body as Record<string, unknown>;

  const rawEmail = typeof b.email === "string" ? b.email : "";
  const email = normalizeEmail(rawEmail);
  if (!email) return { ok: false, error: "Please enter your email address." };
  if (!isValidEmail(email)) return { ok: false, error: "That email address doesn't look right. Please check it and try again." };

  let role: string | null = null;
  if (b.role !== undefined && b.role !== null && b.role !== "") {
    if (!isRole(b.role)) return { ok: false, error: "Please choose a role from the list." };
    role = b.role;
  }

  const website = typeof b.website === "string" ? b.website : "";
  const startedAt = typeof b.startedAt === "number" && Number.isFinite(b.startedAt) ? b.startedAt : null;

  return { ok: true, value: { email, role, website, startedAt } };
}
