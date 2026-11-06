"use server";

import { getAuthProvider } from "@/lib/auth/adapter";
import { cookies } from "next/headers";

function buildCookieStore(store: Awaited<ReturnType<typeof cookies>>) {
  return {
    getAll: () => store.getAll(),
    setAll: (cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
      const setAll = (store as unknown as { setAll?: (c: any[]) => void }).setAll;
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
  const provider = getAuthProvider();
  const store = buildCookieStore(await cookies());
  return provider.signIn(email, password, store);
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
