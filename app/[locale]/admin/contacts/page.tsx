import { prisma } from "@/lib/prisma";
import { ContactStatus, ContactCategory } from "@prisma/client";
import { ContactsList } from "@/components/admin/ContactsList";

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>;
}) {
  const { status: rawStatus, category: rawCategory } = await searchParams;

  const activeStatus =
    rawStatus === "READ" || rawStatus === "REPLIED" || rawStatus === "ALL"
      ? rawStatus
      : "NEW";
  const activeCategory =
    rawCategory === "GENERAL" ||
    rawCategory === "BUSINESS" ||
    rawCategory === "PRESS" ||
    rawCategory === "ALL"
      ? rawCategory
      : "ALL";

  const where: Record<string, unknown> = {};
  if (activeStatus !== "ALL") where.status = activeStatus;
  if (activeCategory !== "ALL") where.category = activeCategory;

  const [messages, statusCounts, categoryCounts] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.contactMessage.groupBy({ by: ["category"], _count: { id: true } }),
  ]);

  const statusMap = Object.fromEntries(
    statusCounts.map((c) => [c.status, c._count.id])
  );
  const categoryMap = Object.fromEntries(
    categoryCounts.map((c) => [c.category, c._count.id])
  );
  const total = Object.values(statusMap).reduce((a, b) => a + b, 0);

  return (
    <ContactsList
      activeStatus={activeStatus}
      activeCategory={activeCategory}
      statusMap={statusMap}
      categoryMap={categoryMap}
      total={total}
      messages={messages.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        message: m.message,
        status: m.status,
        category: m.category,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
