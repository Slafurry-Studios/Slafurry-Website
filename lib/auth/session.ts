import { createHmac, timingSafeEqual } from "crypto";

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
