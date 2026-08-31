import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { Prisma } from "@prisma/client";

// ─── Types ──────────────────────────────────────────────────────
export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

export type AuditDiff = {
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
};

export type WithAuditOptions = {
  /** The action being performed. */
  action: AuditAction;
  /** Entity type name — e.g. "Game", "Post", "Achievement". */
  entityType: string;
  /**
   * Extract the entity ID from the request URL.
   * For CREATE: return null — the ID is extracted from the response body.
   * For UPDATE/DELETE: use `extractIdFromUrl(request)`.
   */
  getEntityId: (request: Request) => string | null;
  /**
   * Called before the handler runs with the resolved entity ID.
   * Return the current entity state for diffing. Return null to skip diffing.
   */
  getBefore?: (entityId: string) => Promise<Record<string, unknown> | null>;
  /**
   * Called after the handler runs with the resolved entity ID and parsed response body.
   * Return the new entity state for diffing.
   * For CREATE: `(id, body) => body as Record<string, unknown>`
   * For UPDATE: `(id) => snapshot(prisma.game, { id })`
   */
  getAfter?: (
    entityId: string,
    responseBody: unknown
  ) => Promise<Record<string, unknown> | null>;
};

// ─── Helpers ────────────────────────────────────────────────────

/** Get the current Supabase user ID from the session cookie. */
async function getSupabaseUserId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Find the AdminUser record by Supabase user ID.
 * If not found, create a stub record so audit logs can still reference an admin.
 */
async function getOrCreateAdminUser(supabaseUserId: string) {
  let admin = await prisma.adminUser.findUnique({
    where: { supabaseUserId },
  });
  if (!admin) {
    admin = await prisma.adminUser.create({
      data: {
        supabaseUserId,
        name: "Admin",
      },
    });
  }
  return admin;
}

/** Shallow-compute a diff between two objects. Only includes changed keys. */
function computeDiff(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null
): AuditDiff {
  if (!before && !after) return { before: null, after: null };
  if (!before) return { before: null, after };
  if (!after) return { before, after: null };

  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const diffBefore: Record<string, unknown> = {};
  const diffAfter: Record<string, unknown> = {};
  let hasChanges = false;

  for (const key of allKeys) {
    const bVal = before[key];
    const aVal = after[key];
    if (typeof bVal === "function" || typeof aVal === "function") continue;
    if (JSON.stringify(bVal) !== JSON.stringify(aVal)) {
      diffBefore[key] = bVal ?? null;
      diffAfter[key] = aVal ?? null;
      hasChanges = true;
    }
  }

  if (!hasChanges) return { before: null, after: null };
  return { before: diffBefore, after: diffAfter };
}

// ─── Main wrapper ───────────────────────────────────────────────

/**
 * Wraps a Next.js route handler to automatically write an AuditLog entry.
 *
 * @example
 * ```ts
 * // CREATE
 * export const POST = withAudit(handler, {
 *   action: "CREATE",
 *   entityType: "Game",
 *   getEntityId: () => null,
 *   getAfter: async (_id, body) => body as Record<string, unknown>,
 * });
 *
 * // UPDATE
 * export const PUT = withAudit(handler, {
 *   action: "UPDATE",
 *   entityType: "Game",
 *   getEntityId: (req) => extractIdFromUrl(req),
 *   getBefore: async (id) => snapshot(prisma.game, { id }),
 *   getAfter: async (id) => snapshot(prisma.game, { id }),
 * });
 *
 * // DELETE
 * export const DELETE = withAudit(handler, {
 *   action: "DELETE",
 *   entityType: "Game",
 *   getEntityId: (req) => extractIdFromUrl(req),
 *   getBefore: async (id) => snapshot(prisma.game, { id }),
 * });
 * ```
 */
export function withAudit<TContext>(
  handler: (
    request: Request,
    context: TContext
  ) => Promise<NextResponse>,
  options: WithAuditOptions
) {
  return async (
    request: Request,
    context?: TContext
  ): Promise<NextResponse> => {
    const { action, entityType, getBefore, getAfter, getEntityId } = options;

    // 1. Pre-resolve entity ID from the request URL
    let entityId = getEntityId(request);

    // 2. Capture "before" state (for UPDATE/DELETE)
    let beforeState: Record<string, unknown> | null = null;
    if (getBefore && entityId) {
      beforeState = await getBefore(entityId);
    }

    // 3. Run the actual handler
    const response = await handler(request, context as TContext);

    // 4. Only audit successful mutations
    if (response.status >= 400) return response;

    // 5. Clone the response so we can read the body without consuming it
    const clonedResponse = response.clone();
    let responseBody: unknown = null;
    try {
      responseBody = await clonedResponse.json();
    } catch {
      return response;
    }

    // 6. For CREATE: extract entity ID from response body if not from URL
    if (!entityId && responseBody && typeof responseBody === "object") {
      entityId = String((responseBody as Record<string, unknown>).id ?? "");
    }
    if (!entityId) return response;

    // 7. Capture "after" state (for CREATE/UPDATE)
    let afterState: Record<string, unknown> | null = null;
    if (getAfter) {
      afterState = await getAfter(entityId, responseBody);
    }

    // 8. Compute diff
    const diff = computeDiff(beforeState, afterState);

    // 9. Skip audit if nothing changed (e.g. UPDATE with identical data)
    if (action === "UPDATE" && !diff.before && !diff.after) return response;

    // 10. Get admin user (non-blocking — failures don't break the response)
    const supabaseUserId = await getSupabaseUserId();
    if (!supabaseUserId) return response;

    const adminUser = await getOrCreateAdminUser(supabaseUserId);

    // 11. Write audit log (fire-and-forget)
    prisma.auditLog
      .create({
        data: {
          adminUserId: adminUser.id,
          action,
          entityType,
          entityId,
          changes: diff as unknown as Prisma.InputJsonValue,
        },
      })
      .catch((err) => console.error("Audit log write failed:", err));

    return response;
  };
}

// ─── Utilities ──────────────────────────────────────────────────

/**
 * Extract the last path segment from a request URL.
 * Works for routes like `/api/admin/games/[id]` → returns the `[id]` value.
 */
export function extractIdFromUrl(request: Request): string | null {
  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last || last === "route") return null;
  return last;
}

/**
 * Fetch a Prisma record as a plain object for audit diffing.
 * Returns null if not found.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function snapshot(
  model: { findUnique: (args: any) => Promise<any> },
  where: Record<string, unknown>
): Promise<Record<string, unknown> | null> {
  const record = await model.findUnique({ where });
  if (!record) return null;

  const plain: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(record)) {
    if (typeof val === "function") continue;
    if (val instanceof Date) {
      plain[key] = val.toISOString();
    } else if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      continue;
    } else {
      plain[key] = val;
    }
  }
  return plain;
}
