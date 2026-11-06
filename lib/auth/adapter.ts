import { LocalAuthProvider } from "./providers/local";
import { SupabaseAuthProvider } from "./providers/supabase";

export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
};

export type SessionResult = { user: AuthUser | null };

export type AdminContext = {
  user: AuthUser;
  adminUser: { id: string; name: string };
} | null;

export type CookieStore = {
  getAll: () => { name: string; value: string }[];
  setAll: (
    cookies: { name: string; value: string; options?: Record<string, unknown> }[]
  ) => void;
};

export interface AuthProvider {
  getSession(cookies?: CookieStore): Promise<SessionResult>;
  requireAdmin(cookies?: CookieStore): Promise<AdminContext>;
  signIn(
    email: string,
    password: string,
    cookies?: CookieStore
  ): Promise<{ ok: boolean; error?: string }>;
  signOut(cookies?: CookieStore): Promise<void>;
}

let provider: AuthProvider | null = null;

export function setAuthProvider(p: AuthProvider): void {
  provider = p;
}

export function getAuthProvider(): AuthProvider {
  if (provider) return provider;
  provider = process.env.AUTH_PROVIDER === "local" ? new LocalAuthProvider() : new SupabaseAuthProvider();
  return provider;
}

export async function defaultCookies(): Promise<CookieStore> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  return {
    getAll: () => store.getAll(),
    setAll: (cookiesToSet) => {
      const storeAny = store as unknown as {
        setAll?: (c: { name: string; value: string; options?: Record<string, unknown> }[]) => void;
        set?: (n: string, v: string, o?: unknown) => void;
      };
      if (typeof storeAny.setAll === "function") {
        storeAny.setAll(cookiesToSet);
      } else if (typeof storeAny.set === "function") {
        for (const { name, value, options } of cookiesToSet) {
          storeAny.set(name, value, options);
        }
      }
    },
  };
}
