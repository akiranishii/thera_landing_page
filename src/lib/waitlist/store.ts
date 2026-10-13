import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface WaitlistEntry {
  email: string;
  role: string | null;
  source: string;
  userAgent: string | null;
  createdAt: string;
}

export type SaveResult = { status: "created" } | { status: "exists" };

export interface WaitlistStore {
  readonly name: "supabase" | "file";
  save(entry: WaitlistEntry): Promise<SaveResult>;
}

export class WaitlistStoreError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "WaitlistStoreError";
  }
}

/* ---------- Supabase (PostgREST over fetch; no client library needed) ---------- */

function supabaseStore(url: string, serviceKey: string, table: string): WaitlistStore {
  const endpoint = `${url.replace(/\/+$/, "")}/rest/v1/${encodeURIComponent(table)}`;
  return {
    name: "supabase",
    async save(entry) {
      let res: Response;
      try {
        res = await fetch(endpoint, {
          method: "POST",
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            email: entry.email,
            role: entry.role,
            source: entry.source,
            user_agent: entry.userAgent,
            created_at: entry.createdAt,
          }),
          cache: "no-store",
        });
      } catch (err) {
        throw new WaitlistStoreError("Could not reach the waitlist database.", err);
      }
      if (res.status === 201 || res.status === 200 || res.status === 204) return { status: "created" };
      const text = await res.text().catch(() => "");
      // PostgREST reports a unique-constraint violation as 409 with Postgres code 23505.
      if (res.status === 409 && text.includes("23505")) return { status: "exists" };
      throw new WaitlistStoreError(`Waitlist database rejected the entry (${res.status}).`, text);
    },
  };
}

/* ---------- Local JSON-lines file (development, or a server with a persistent disk) ---------- */

function fileStore(filePath: string): WaitlistStore {
  // The path is configuration, not a module reference; tell the bundler not to trace it.
  const abs = path.resolve(/*turbopackIgnore: true*/ process.cwd(), filePath);
  return {
    name: "file",
    async save(entry) {
      await mkdir(path.dirname(abs), { recursive: true });
      let existing = "";
      try {
        existing = await readFile(abs, "utf8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
          throw new WaitlistStoreError("Could not read the waitlist file.", err);
        }
      }
      for (const line of existing.split("\n")) {
        if (!line.trim()) continue;
        try {
          const row = JSON.parse(line) as { email?: string };
          if (row.email === entry.email) return { status: "exists" };
        } catch {
          /* ignore malformed lines */
        }
      }
      try {
        await appendFile(abs, JSON.stringify(entry) + "\n", "utf8");
      } catch (err) {
        throw new WaitlistStoreError("Could not write to the waitlist file.", err);
      }
      return { status: "created" };
    },
  };
}

/* ---------- Resolution ---------- */

/**
 * Picks the configured store, or returns null when nothing is configured.
 *
 * - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY → Supabase (table from SUPABASE_WAITLIST_TABLE, default "waitlist").
 * - WAITLIST_STORE=file → JSON lines at WAITLIST_FILE (default data/waitlist.jsonl).
 * - Otherwise, outside production, the file store is used so local development works out of the box.
 * - Otherwise null: the API returns 503 and the form shows an error instead of a fake success.
 */
export function getWaitlistStore(env: NodeJS.ProcessEnv = process.env): WaitlistStore | null {
  const url = env.SUPABASE_URL?.trim();
  const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (url && key) return supabaseStore(url, key, env.SUPABASE_WAITLIST_TABLE?.trim() || "waitlist");

  const explicitFile = env.WAITLIST_STORE?.trim().toLowerCase() === "file";
  if (explicitFile || env.NODE_ENV !== "production") {
    return fileStore(env.WAITLIST_FILE?.trim() || "data/waitlist.jsonl");
  }
  return null;
}
