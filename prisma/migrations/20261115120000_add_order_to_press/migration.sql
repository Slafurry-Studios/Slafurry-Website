-- AlterTable
ALTER TABLE "PressRelease" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PressKitAsset" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- Backfill: renumber existing rows to match prior admin list order
UPDATE "Post" p SET "order" = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" DESC) - 1 AS rn FROM "Post"
) sub
WHERE p.id = sub.id;

UPDATE "PressRelease" p SET "order" = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "publishedAt" DESC) - 1 AS rn FROM "PressRelease"
) sub
WHERE p.id = sub.id;

UPDATE "PressKitAsset" p SET "order" = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "label" ASC) - 1 AS rn FROM "PressKitAsset"
) sub
WHERE p.id = sub.id;
