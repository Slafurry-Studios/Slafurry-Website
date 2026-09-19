import { prisma } from "@/lib/prisma";
import { ContactStatus, ContactCategory, Prisma } from "@prisma/client";
import { ContactsList } from "@/components/admin/ContactsList";

export default async function AdminContactsPage(props: {
  searchParams: Promise<{ page?: string; status?: string; category?: string }>;
}) {
  const { page, status: rawStatus, category: rawCategory } = await props.searchParams;
  const parsedPage = Number.parseInt(page ?? "1", 10);
  const currentPage = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
  const pageSize = 20;

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

  const where: Prisma.ContactMessageWhereInput = {};
  if (activeStatus !== "ALL") where.status = activeStatus;
  if (activeCategory !== "ALL") where.category = activeCategory;

  const [messages, statusCounts, categoryCounts, totalCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactMessage.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.contactMessage.groupBy({ by: ["category"], _count: { id: true } }),
    prisma.contactMessage.count({ where }),
  ]);

  const statusMap = Object.fromEntries(
    statusCounts.map((c) => [c.status, c._count.id])
  );
  const categoryMap = Object.fromEntries(
    categoryCounts.map((c) => [c.category, c._count.id])
  );
  const absoluteTotal = Object.values(statusMap).reduce((a, b) => a + b, 0);
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <ContactsList
      statusMap={statusMap}
      categoryMap={categoryMap}
      total={absoluteTotal}
      page={currentPage}
      totalPages={totalPages}
      activeStatus={activeStatus}
      activeCategory={activeCategory}
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

