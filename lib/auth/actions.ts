"use server";

import { getAuthProvider } from "@/lib/auth/adapter";
import { checkRateLimit } from "@/lib/actions/form-guards";
import { createHash } from "crypto";
import { cookies, headers } from "next/headers";

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

async function getClientIp(): Promise<string> {
  try {
    const headersList = await headers();
    return (
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headersList.get("x-real-ip") ??
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

function logFailedLogin(ipHash: string, outcome: string): void {
  console.warn(
    JSON.stringify({
      event: "admin_login_failed",
      ipHash,
      outcome,
      timestamp: new Date().toISOString(),
    })
  );
}

function buildCookieStore(store: Awaited<ReturnType<typeof cookies>>) {
  return {
    getAll: () => store.getAll(),
    setAll: (cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
      const setAll = (store as unknown as {
        setAll?: (c: { name: string; value: string; options?: Record<string, unknown> }[]) => void;
      }).setAll;
      if (typeof setAll === "function") {
        setAll(cookiesToSet);
      } else {
        for (const { name, value, options } of cookiesToSet) {
          (store as unknown as { set: (n: string, v: string, o?: unknown) => void }).set(name, value, options);
        }
      }
    },
  };
}

export async function signIn(email: string, password: string) {
  const ip = await getClientIp();
  const ipHash = hashIp(ip);

  const limit = await checkRateLimit("admin-login", LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS, ip);
  if (!limit.allowed) {
    logFailedLogin(ipHash, "rate_limited");
    return { ok: false, error: "Too many attempts. Try again later." };
  }

  const provider = getAuthProvider();
  const store = buildCookieStore(await cookies());
  const result = await provider.signIn(email, password, store);

  if (!result.ok) {
    logFailedLogin(ipHash, "invalid_credentials");
  }

  return result;
}

export async function signOut() {
  const provider = getAuthProvider();
  const store = buildCookieStore(await cookies());
  return provider.signOut(store);
}

export async function getSession() {
  const provider = getAuthProvider();
  const store = buildCookieStore(await cookies());
  return provider.getSession(store);
}

export async function requireAdmin() {
  const provider = getAuthProvider();
  const store = buildCookieStore(await cookies());
  return provider.requireAdmin(store);
}
