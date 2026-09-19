import { prisma } from "@/lib/prisma";
import { AuditLogList } from "@/components/admin/AuditLogList";

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ adminUserId?: string; entityType?: string }>;
}) {
  const { adminUserId, entityType } = await searchParams;

  const where: Record<string, string> = {};
  if (adminUserId) where.adminUserId = adminUserId;
  if (entityType) where.entityType = entityType;

  const [logs, admins, entityTypes] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { adminUser: { select: { id: true, name: true } } },
    }),
    prisma.adminUser.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.auditLog.groupBy({
      by: ["entityType"],
      _count: { id: true },
      orderBy: { entityType: "asc" },
    }),
  ]);

  return (
    <AuditLogList
      logs={logs.map((l) => ({
        id: l.id,
        adminUserId: l.adminUser.id,
        adminUserName: l.adminUser.name,
        action: l.action,
        entityType: l.entityType,
        entityId: l.entityId,
        changes: l.changes,
        createdAt: l.createdAt.toISOString(),
      }))}
      admins={admins}
      entityTypes={entityTypes.map((e) => e.entityType)}
      initialFilters={{ adminUserId: adminUserId ?? "", entityType: entityType ?? "" }}
    />
  );
}
