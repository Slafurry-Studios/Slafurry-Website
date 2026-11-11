import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const adminUserId = url.searchParams.get("adminUserId");
    const entityType = url.searchParams.get("entityType");

    const where: Record<string, unknown> = {};
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

    return NextResponse.json({
      logs: logs.map((l) => ({
        id: l.id,
        adminUserName: l.adminUser.name,
        action: l.action,
        entityType: l.entityType,
        entityId: l.entityId,
        changes: l.changes,
        createdAt: l.createdAt.toISOString(),
      })),
      admins,
      entityTypes: entityTypes.map((e) => e.entityType),
    });
  } catch (error) {
    console.error("List audit logs error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
