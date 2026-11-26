import { prisma } from "@/lib/prisma";

export type HitResult = { count: number; resetAtMs: number };

/**
 * Which store counts hits. Postgres is shared by every serverless instance, so
 * limits hold site-wide; memory is per instance and is what dev and tests use.
 * Override with RATE_LIMIT_STORE=postgres|memory.
 */
export function rateLimitStore(): "postgres" | "memory" {
  const forced = process.env.RATE_LIMIT_STORE;
  if (forced === "postgres" || forced === "memory") return forced;
  return process.env.NODE_ENV === "production" ? "postgres" : "memory";
}

// ─── Memory store: sliding window, per instance ─────────────────────────────

const buckets = new Map<string, number[]>();

export function memoryHit(bucketKey: string, max: number, windowMs: number, now = Date.now()): HitResult {
  const cutoff = now - windowMs;
  const hits = (buckets.get(bucketKey) ?? []).filter((t) => t > cutoff);
  // Blocked attempts aren't recorded, so a client can't extend its own lockout.
  const allowed = hits.length < max;
  if (allowed) hits.push(now);
  buckets.set(bucketKey, hits);

  if (buckets.size > 10_000) {
    for (const [key, timestamps] of buckets) {
      const kept = timestamps.filter((t) => t > cutoff);
      if (kept.length === 0) buckets.delete(key);
      else buckets.set(key, kept);
    }
  }

  // Report a count above max once blocked, matching the Postgres store.
  return { count: allowed ? hits.length : max + 1, resetAtMs: (hits[0] ?? now) + windowMs };
}

// ─── Postgres store: fixed window, shared ───────────────────────────────────

/**
 * One atomic upsert per check: starts a new window when the old one has
 * expired, otherwise increments. Requires the "RateLimit" table
 * (prisma/migrations/20261126120000_add_rate_limit).
 */
export async function postgresHit(bucketKey: string, windowMs: number, now = Date.now()): Promise<HitResult> {
  const nowDate = new Date(now);
  const resetAt = new Date(now + windowMs);
  const rows = await prisma.$queryRaw<{ count: number; resetAt: Date }[]>`
    INSERT INTO "RateLimit" ("key", "count", "resetAt")
    VALUES (${bucketKey}, 1, ${resetAt})
    ON CONFLICT ("key") DO UPDATE SET
      "count"   = CASE WHEN "RateLimit"."resetAt" <= ${nowDate} THEN 1 ELSE "RateLimit"."count" + 1 END,
      "resetAt" = CASE WHEN "RateLimit"."resetAt" <= ${nowDate} THEN ${resetAt} ELSE "RateLimit"."resetAt" END
    RETURNING "count", "resetAt"
  `;

  // Occasionally clear windows that ended over a day ago so the table stays small.
  if (Math.random() < 0.01) {
    const stale = new Date(now - 24 * 60 * 60 * 1000);
    prisma.$executeRaw`DELETE FROM "RateLimit" WHERE "resetAt" < ${stale}`.catch(() => {});
  }

  const row = rows[0];
  return { count: Number(row.count), resetAtMs: row.resetAt.getTime() };
}

let warnedFallback = false;

/** Counts one attempt for `bucketKey`, using the configured store. */
export async function hit(bucketKey: string, max: number, windowMs: number): Promise<HitResult> {
  if (rateLimitStore() === "postgres") {
    try {
      return await postgresHit(bucketKey, windowMs);
    } catch (error) {
      // Fail open to the per-instance limiter rather than blocking logins and
      // forms while the database is unreachable.
      if (!warnedFallback) {
        warnedFallback = true;
        console.error("[rate-limit] Postgres store failed, using in-memory fallback:", error);
      }
    }
  }
  return memoryHit(bucketKey, max, windowMs);
}
