import { NextResponse } from "next/server";
import { getWaitlistStore, WaitlistStoreError } from "@/lib/waitlist/store";
import { parseWaitlistBody } from "@/lib/waitlist/validate";
import { rateLimit } from "@/lib/waitlist/rate-limit";

/** Minimum time between the form rendering and submission; faster than this is almost certainly a bot. */
const MIN_FILL_MS = 1500;

type Ok = { ok: true; status: "created" | "exists" };
type Fail = { ok: false; error: string; code: string };

function fail(status: number, code: string, error: string, headers?: HeadersInit) {
  return NextResponse.json<Fail>({ ok: false, error, code }, { status, headers });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const limited = rateLimit(`waitlist:${ip}`);
  if (!limited.allowed) {
    return fail(429, "rate_limited", "Too many attempts. Please try again in a few minutes.", {
      "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)),
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "invalid_json", "Invalid request.");
  }

  const parsed = parseWaitlistBody(body);
  if (!parsed.ok) return fail(400, "invalid_input", parsed.error);
  const input = parsed.value;

  // Basic spam prevention: honeypot field and time-to-submit.
  if (input.website) return fail(400, "rejected", "Submission rejected.");
  if (input.startedAt !== null && Date.now() - input.startedAt < MIN_FILL_MS) {
    return fail(400, "rejected", "Submission rejected. Please try again.");
  }

  const store = getWaitlistStore();
  if (!store) {
    console.error(
      "[waitlist] No store configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or WAITLIST_STORE=file). See .env.example.",
    );
    return fail(503, "not_configured", "Early access signups aren't available right now. Please try again later.");
  }

  try {
    const result = await store.save({
      email: input.email,
      role: input.role,
      source: "website",
      userAgent: request.headers.get("user-agent")?.slice(0, 512) ?? null,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json<Ok>({ ok: true, status: result.status }, { status: result.status === "created" ? 201 : 200 });
  } catch (err) {
    const detail = err instanceof WaitlistStoreError ? `${err.message} ${String(err.cause ?? "")}` : String(err);
    console.error(`[waitlist] Save failed via ${store.name}: ${detail}`);
    return fail(500, "save_failed", "We couldn't save your signup. Please try again in a moment.");
  }
}
