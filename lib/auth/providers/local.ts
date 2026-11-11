import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import type { AuthProvider, CookieStore, SessionResult, AdminContext, AuthUser } from "../adapter";

const SESSION_NAME = "slafurry_local_session";
const LOCAL_ADMIN_EMAIL = "admin@slafurrystudios.local";
const LOCAL_ADMIN_PASSWORD = "admin";
const LOCAL_ADMIN_SUB = "local-admin-1";

function isProduction(): boolean {
  return process.env.NODE_ENV === "production" || !!process.env.VERCEL;
}

function getSecret(): string {
  const secret = process.env.AUTH_LOCAL_SECRET;
  if (!secret || secret === "dev-local-secret-placeholder" || secret === "your-secret-here") {
    throw new Error("AUTH_LOCAL_SECRET not set (use `openssl rand -base64 32`).");
  }
  return secret;
}

function signSession(payload: Record<string, unknown>): string {
  const secret = getSecret();
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

function verifySession(value: string): { id: string; email: string; name: string } | null {
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, bodyB64, sig] = parts;
  const secret = getSecret();
  const expected = createHmac("sha256", secret).update(`${headerB64}.${bodyB64}`).digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(sig, "base64url"), Buffer.from(expected, "base64url"))) {
      return null;
    }
  } catch {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(bodyB64, "base64url").toString("utf8")) as {
      id: string;
      email: string;
      name: string;
    };
  } catch {
    return null;
  }
}

function getCookie(store: CookieStore, name: string): string | undefined {
  return store.getAll().find((c) => c.name === name)?.value;
}

function clearCookie(store: CookieStore, name: string): void {
  store.setAll([{ name, value: "", options: { path: "/", httpOnly: true, sameSite: "lax", secure: false, maxAge: 0 } }]);
}

export class LocalAuthProvider implements AuthProvider {
  constructor() {
    if (isProduction()) {
      throw new Error(
        "Local auth provider cannot be active in production. Set AUTH_PROVIDER=supabase."
      );
    }
  }

  async getSession(cookies?: CookieStore): Promise<SessionResult> {
    const store = cookies ?? (await defaultCookies());
    const value = getCookie(store, SESSION_NAME);
    if (!value) return { user: null };
    const payload = verifySession(value);
    if (!payload) return { user: null };
    return {
      user: { id: payload.id, email: payload.email ?? null, name: payload.name ?? null },
    };
  }

  async requireAdmin(cookies?: CookieStore): Promise<AdminContext> {
    const session = await this.getSession(cookies);
    if (!session.user) return null;

    let adminUser = await prisma.adminUser.findUnique({
      where: { supabaseUserId: session.user.id },
    });
    if (!adminUser) {
      const adminCount = await prisma.adminUser.count();
      if (adminCount === 0) {
        adminUser = await prisma.adminUser.create({
          data: { supabaseUserId: session.user.id, name: session.user.name ?? "Admin" },
        });
      } else {
        return null;
      }
    }
    return { user: session.user, adminUser: { id: adminUser.id, name: adminUser.name } };
  }

  async signIn(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    if (isProduction()) {
      throw new Error("Local auth provider cannot be active in production.");
    }
    if (email !== LOCAL_ADMIN_EMAIL || password !== LOCAL_ADMIN_PASSWORD) {
      return { ok: false, error: "Email or password is incorrect." };
    }

    let adminUser = await prisma.adminUser.findUnique({
      where: { supabaseUserId: LOCAL_ADMIN_SUB },
    });
    if (!adminUser) {
      adminUser = await prisma.adminUser.create({
        data: { supabaseUserId: LOCAL_ADMIN_SUB, name: "Local Admin" },
      });
    }

  return { ok: true };
}

  async signOut(cookies?: CookieStore): Promise<void> {
    const store = cookies ?? (await defaultCookies());
    clearCookie(store, SESSION_NAME);
  }

  sessionCookie(user: AuthUser): { name: string; value: string; options: Record<string, unknown> } {
    const value = signSession({ id: user.id, email: user.email ?? "", name: user.name ?? "" });
    return { name: SESSION_NAME, value, options: { path: "/", httpOnly: true, sameSite: "lax", secure: false } };
  }
}

async function defaultCookies(): Promise<CookieStore> {
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
