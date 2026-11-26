import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { defaultCookies } from "../adapter";
import type { AuthProvider, CookieStore, SessionResult, AdminContext } from "../adapter";

export class SupabaseAuthProvider implements AuthProvider {
  async getSession(cookies?: CookieStore): Promise<SessionResult> {
    const store = cookies ?? (await defaultCookies());
    const supabase = createClient(store);
    const { data } = await supabase.auth.getUser();
    return {
      user: data.user
        ? { id: data.user.id, email: data.user.email ?? null, name: null }
        : null,
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
          data: { supabaseUserId: session.user.id, name: session.user.email ?? "Admin" },
        });
      } else {
        return null;
      }
    }

    return {
      user: session.user,
      adminUser: { id: adminUser.id, name: adminUser.name },
    };
  }

  async signIn(
    email: string,
    password: string,
    cookies?: CookieStore
  ): Promise<{ ok: boolean; error?: string }> {
    const store = cookies ?? (await defaultCookies());
    const supabase = createClient(store);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: "Invalid email or password." };
    return { ok: true };
  }

  async signOut(cookies?: CookieStore): Promise<void> {
    const store = cookies ?? (await defaultCookies());
    const supabase = createClient(store);
    await supabase.auth.signOut();
  }
}
