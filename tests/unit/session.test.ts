import { describe, it, expect } from "vitest";
import {
  LOCAL_SESSION_TTL_SECONDS,
  isSessionFresh,
  signSession,
  verifySession,
} from "@/lib/auth/session";

const SECRET = "test-secret";

describe("local session claims", () => {
  const now = 1_800_000_000_000;
  const nowSeconds = Math.floor(now / 1000);

  it("accepts a token issued within the TTL", () => {
    expect(
      isSessionFresh({ iat: nowSeconds, exp: nowSeconds + LOCAL_SESSION_TTL_SECONDS }, now)
    ).toBe(true);
  });

  it("rejects an expired token", () => {
    expect(isSessionFresh({ iat: nowSeconds - 10, exp: nowSeconds - 1 }, now)).toBe(false);
  });

  it("rejects a token older than the TTL even without exp passing", () => {
    expect(
      isSessionFresh(
        { iat: nowSeconds - LOCAL_SESSION_TTL_SECONDS - 5, exp: nowSeconds + 999 },
        now
      )
    ).toBe(false);
  });

  it("rejects legacy tokens without time claims", () => {
    expect(isSessionFresh({}, now)).toBe(false);
    expect(isSessionFresh({ iat: nowSeconds }, now)).toBe(false);
  });

  it("round-trips a signed payload", () => {
    const value = signSession({ id: "u1", iat: nowSeconds, exp: nowSeconds + 60 }, SECRET);
    expect(verifySession<{ id: string }>(value, SECRET)?.id).toBe("u1");
  });
});
