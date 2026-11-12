import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { LocalAuthProvider } from "@/lib/auth/providers/local";
import { LOCAL_SESSION_COOKIE, signSession } from "@/lib/auth/session";

type Env = Record<string, string | undefined>;
const env = process.env as Env;

describe("LocalAuthProvider (guard production)", () => {
  const origNodeEnv = env.NODE_ENV;
  const origVercel = env.VERCEL;

  beforeEach(() => {
    delete env.NODE_ENV;
    delete env.VERCEL;
  });

  afterEach(() => {
    env.NODE_ENV = origNodeEnv;
    env.VERCEL = origVercel;
  });

  it("throws when NODE_ENV=production", () => {
    env.NODE_ENV = "production";
    expect(() => new LocalAuthProvider()).toThrow(
      "Local auth provider cannot be active in production"
    );
  });

  it("throws when VERCEL is set", () => {
    env.VERCEL = "1";
    expect(() => new LocalAuthProvider()).toThrow(
      "Local auth provider cannot be active in production"
    );
  });

  it("does not throw in development", () => {
    env.NODE_ENV = "development";
    expect(() => new LocalAuthProvider()).not.toThrow();
  });
});

describe("LocalAuthProvider session cookie", () => {
  const origSecret = env.AUTH_LOCAL_SECRET;
  const origNodeEnv = env.NODE_ENV;
  const origVercel = env.VERCEL;

  beforeEach(() => {
    delete env.NODE_ENV;
    delete env.VERCEL;
    env.AUTH_LOCAL_SECRET = "test-secret";
  });

  afterEach(() => {
    env.NODE_ENV = origNodeEnv;
    env.VERCEL = origVercel;
    env.AUTH_LOCAL_SECRET = origSecret;
  });

  it("uses a __Host- prefixed, Secure, HttpOnly, SameSite=Lax cookie", () => {
    const provider = new LocalAuthProvider();
    const cookie = provider.sessionCookie({ id: "u1", email: null, name: null });
    expect(cookie.name).toBe(LOCAL_SESSION_COOKIE);
    expect(cookie.name.startsWith("__Host-")).toBe(true);
    expect(cookie.options).toMatchObject({
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  });

  it("rejects a signed token without exp/iat claims", async () => {
    const provider = new LocalAuthProvider();
    const legacy = signSession({ id: "u1" }, "test-secret");
    const store = {
      getAll: () => [{ name: LOCAL_SESSION_COOKIE, value: legacy }],
      setAll: () => {},
    };
    expect(await provider.getSession(store)).toEqual({ user: null });
  });

  it("rejects an expired token", async () => {
    const provider = new LocalAuthProvider();
    const now = Math.floor(Date.now() / 1000);
    const expired = signSession({ id: "u1", iat: now - 120, exp: now - 60 }, "test-secret");
    const store = {
      getAll: () => [{ name: LOCAL_SESSION_COOKIE, value: expired }],
      setAll: () => {},
    };
    expect(await provider.getSession(store)).toEqual({ user: null });
  });
});
