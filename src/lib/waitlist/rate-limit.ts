/**
 * Small in-memory sliding-window rate limiter.
 *
 * Good enough to blunt casual abuse. On serverless platforms each instance keeps its own
 * window, so treat this as a first line of defense rather than a guarantee; the database's
 * unique constraint on email is the real backstop against duplicates.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit = 10, windowMs = 10 * 60 * 1000): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const cutoff = now - windowMs;
  const hits = (buckets.get(key) ?? []).filter((t) => t > cutoff);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { allowed: false, retryAfterMs: hits[0] + windowMs - now };
  }
  hits.push(now);
  buckets.set(key, hits);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => t <= cutoff)) buckets.delete(k);
    }
  }
  return { allowed: true, retryAfterMs: 0 };
}
