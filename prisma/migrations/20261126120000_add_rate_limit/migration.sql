-- Shared rate-limit counters for login, comment, contact and analytics
-- (lib/security/rate-limit.ts). Keys hold a scope plus a hashed IP, never the IP.
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "RateLimit_resetAt_idx" ON "RateLimit"("resetAt");

-- Only the app's own database role (Prisma) touches this table. With RLS on and
-- no policies, the public Supabase API can neither read nor write it.
ALTER TABLE "RateLimit" ENABLE ROW LEVEL SECURITY;
