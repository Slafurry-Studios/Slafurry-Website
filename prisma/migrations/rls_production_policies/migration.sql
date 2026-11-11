-- Enable Row Level Security on all tables for production
-- Public read access for content tables; admin-only writes via auth.uid() check

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE "Game" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PlayLink" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MontageVideo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PressRelease" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PressKitAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Achievement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialLink" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Redirect" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PageView" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Public read policies (content visible to everyone)
-- ============================================
CREATE POLICY "Game public read" ON "Game" FOR SELECT USING (true);
CREATE POLICY "PlayLink public read" ON "PlayLink" FOR SELECT USING (true);
CREATE POLICY "MontageVideo public read" ON "MontageVideo" FOR SELECT USING (true);
CREATE POLICY "Post public read" ON "Post" FOR SELECT USING (true);
CREATE POLICY "Comment public read" ON "Comment" FOR SELECT USING ("status" = 'APPROVED');
CREATE POLICY "PressRelease public read" ON "PressRelease" FOR SELECT USING ("isHidden" = false);
CREATE POLICY "PressKitAsset public read" ON "PressKitAsset" FOR SELECT USING ("isHidden" = false);
CREATE POLICY "Achievement public read" ON "Achievement" FOR SELECT USING ("isHidden" = false);
CREATE POLICY "SocialLink public read" ON "SocialLink" FOR SELECT USING ("isHidden" = false);
CREATE POLICY "Redirect public read" ON "Redirect" FOR SELECT USING (true);
CREATE POLICY "SiteSettings public read" ON "SiteSettings" FOR SELECT USING (true);
CREATE POLICY "PageView public read" ON "PageView" FOR SELECT USING (true);

-- ============================================
-- Admin write policies (auth.uid() matches AdminUser.supabaseUserId)
-- ============================================
CREATE POLICY "Game admin write" ON "Game" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
CREATE POLICY "PlayLink admin write" ON "PlayLink" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
CREATE POLICY "MontageVideo admin write" ON "MontageVideo" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
CREATE POLICY "Post admin write" ON "Post" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
CREATE POLICY "Comment admin write" ON "Comment" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
CREATE POLICY "PressRelease admin write" ON "PressRelease" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
CREATE POLICY "PressKitAsset admin write" ON "PressKitAsset" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
CREATE POLICY "ContactMessage admin write" ON "ContactMessage" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
CREATE POLICY "Achievement admin write" ON "Achievement" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
CREATE POLICY "SocialLink admin write" ON "SocialLink" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
CREATE POLICY "Redirect admin write" ON "Redirect" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
CREATE POLICY "SiteSettings admin write" ON "SiteSettings" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);

-- ============================================
-- ContactMessage: public insert (contact form), admin read/write
-- ============================================
CREATE POLICY "ContactMessage public insert" ON "ContactMessage" FOR INSERT WITH CHECK (true);

-- ============================================
-- PageView: public insert (analytics), admin read
-- ============================================
CREATE POLICY "PageView public insert" ON "PageView" FOR INSERT WITH CHECK (true);

-- ============================================
-- AdminUser: admin read/write only
-- ============================================
CREATE POLICY "AdminUser admin read/write" ON "AdminUser" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);

-- ============================================
-- AuditLog: admin read/write only
-- ============================================
CREATE POLICY "AuditLog admin read/write" ON "AuditLog" FOR ALL USING (
  auth.uid()::text IN (SELECT "supabaseUserId" FROM "AdminUser")
);
