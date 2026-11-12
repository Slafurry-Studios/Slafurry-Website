import { createHmac, timingSafeEqual } from "crypto";

/** `__Host-` prefix requires Secure, Path=/ and no Domain attribute. */
export const LOCAL_SESSION_COOKIE = "__Host-slafurry_local_session";

/** Absolute lifetime of a local session token. There is no sliding refresh. */
export const LOCAL_SESSION_TTL_SECONDS = 60 * 60;

export function base64url(data: Buffer): string {
  return data.toString("base64url");
}

export function signSession(
  payload: Record<string, unknown>,
  secret: string
): string {
  const header = base64url(Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = base64url(Buffer.from(JSON.stringify(payload)));
  const sig = createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${sig}`;
}

export function verifySession<T = Record<string, unknown>>(
  value: string,
  secret: string
): T | null {
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, bodyB64, sig] = parts;
  const expected = createHmac("sha256", secret)
    .update(`${headerB64}.${bodyB64}`)
    .digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(sig, "base64url"), Buffer.from(expected, "base64url"))) {
      return null;
    }
  } catch {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(bodyB64, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export type SessionTimeClaims = { iat?: number; exp?: number };

/**
 * A token is fresh when it carries both `iat` and `exp`, has not expired and
 * was issued within the TTL window. Tokens without claims (issued before this
 * hardening) are rejected so old cookies cannot outlive the change.
 */
export function isSessionFresh(claims: SessionTimeClaims, nowMs = Date.now()): boolean {
  const now = Math.floor(nowMs / 1000);
  if (typeof claims.iat !== "number" || typeof claims.exp !== "number") return false;
  if (now >= claims.exp) return false;
  if (now - claims.iat > LOCAL_SESSION_TTL_SECONDS) return false;
  return true;
}
