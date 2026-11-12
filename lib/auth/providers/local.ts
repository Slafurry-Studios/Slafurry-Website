import { prisma } from "@/lib/prisma";
import type { AuthProvider, CookieStore, SessionResult, AdminContext, AuthUser } from "../adapter";
import {
  LOCAL_SESSION_COOKIE,
  LOCAL_SESSION_TTL_SECONDS,
  isSessionFresh,
  signSession,
  verifySession,
} from "../session";

const LOCAL_ADMIN_EMAIL = "admin@slafurrystudios.local";
const LOCAL_ADMIN_PASSWORD = "admin";
const LOCAL_ADMIN_SUB = "local-admin-1";

type LocalSessionClaims = {
  id: string;
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
};

const SESSION_COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: true,
};

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

function getCookie(store: CookieStore, name: string): string | undefined {
  return store.getAll().find((c) => c.name === name)?.value;
}

function clearCookie(store: CookieStore, name: string): void {
  store.setAll([{ name, value: "", options: { ...SESSION_COOKIE_OPTIONS, maxAge: 0 } }]);
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
    const value = getCookie(store, LOCAL_SESSION_COOKIE);
    if (!value) return { user: null };
    const payload = verifySession<LocalSessionClaims>(value, getSecret());
    if (!payload || !isSessionFresh(payload)) return { user: null };
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

  async signIn(
    email: string,
    password: string,
    cookies?: CookieStore
  ): Promise<{ ok: boolean; error?: string }> {
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

    const store = cookies ?? (await defaultCookies());
    const session = this.sessionCookie({
      id: LOCAL_ADMIN_SUB,
      email,
      name: adminUser.name,
    });
    store.setAll([session]);

    return { ok: true };
  }

  async signOut(cookies?: CookieStore): Promise<void> {
    const store = cookies ?? (await defaultCookies());
    clearCookie(store, LOCAL_SESSION_COOKIE);
  }

  sessionCookie(user: AuthUser): { name: string; value: string; options: Record<string, unknown> } {
    const now = Math.floor(Date.now() / 1000);
    const value = signSession(
      {
        id: user.id,
        email: user.email ?? "",
        name: user.name ?? "",
        iat: now,
        exp: now + LOCAL_SESSION_TTL_SECONDS,
      },
      getSecret()
    );
    return { name: LOCAL_SESSION_COOKIE, value, options: { ...SESSION_COOKIE_OPTIONS } };
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
