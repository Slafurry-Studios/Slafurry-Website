import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { LocalAuthProvider } from "@/lib/auth/providers/local";

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

  it("melempar saat NODE_ENV=production", () => {
    env.NODE_ENV = "production";
    expect(() => new LocalAuthProvider()).toThrow(
      "Local auth provider tidak boleh aktif di production"
    );
  });

  it("melempar saat VERCEL di-set", () => {
    env.VERCEL = "1";
    expect(() => new LocalAuthProvider()).toThrow(
      "Local auth provider tidak boleh aktif di production"
    );
  });

  it("tidak melempar saat development", () => {
    env.NODE_ENV = "development";
    expect(() => new LocalAuthProvider()).not.toThrow();
  });
});
