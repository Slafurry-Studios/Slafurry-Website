-- PageView was publicly readable ("PageView public read" USING (true)), so anyone
-- with the publishable Supabase key could read all analytics rows via the REST
-- API. The app reads analytics through Prisma (admin-only routes), so restrict
-- direct reads to admins. Public INSERT stays as is.
DROP POLICY IF EXISTS "PageView public read" ON "PageView";

CREATE POLICY "PageView admin read" ON "PageView" FOR SELECT USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
