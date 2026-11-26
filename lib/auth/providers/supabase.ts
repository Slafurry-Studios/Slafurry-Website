import { createClient } from "@/lib/supabase/server";
import { defaultCookies } from "../adapter";
import { resolveAdminUser } from "../admin-users";
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
    const adminUser = await resolveAdminUser(session.user);
    return adminUser ? { user: session.user, adminUser } : null;
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
