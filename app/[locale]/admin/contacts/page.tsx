import { prisma } from "@/lib/prisma";
import { ContactStatus, ContactCategory } from "@prisma/client";
import { IconClock, IconMail } from "@tabler/icons-react";
import { ContactActions } from "@/components/admin/ContactActions";

const STATUS_TABS: { key: ContactStatus | "ALL"; label: string }[] = [
  { key: "NEW", label: "New" },
  { key: "READ", label: "Read" },
  { key: "REPLIED", label: "Replied" },
  { key: "ALL", label: "All" },
];

const CATEGORY_TABS: { key: ContactCategory | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "GENERAL", label: "General" },
  { key: "BUSINESS", label: "Business" },
  { key: "PRESS", label: "Press" },
];

const STATUS_STYLE: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  READ: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  REPLIED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const CATEGORY_STYLE: Record<string, string> = {
  GENERAL:
    "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  BUSINESS:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  PRESS:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
};

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

  function statusHref(s: string) {
    return `/admin/contacts?status=${s}${activeCategory !== "ALL" ? `&category=${activeCategory}` : ""}`;
  }
  function categoryHref(c: string) {
    return `/admin/contacts?category=${c}${activeStatus !== "ALL" ? `&status=${activeStatus}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl tracking-tight">Contact Inbox</h1>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {total} total
        </span>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
        {STATUS_TABS.map((tab) => {
          const count =
            tab.key === "ALL" ? total : (statusMap[tab.key] ?? 0);
          return (
            <a
              key={tab.key}
              href={statusHref(tab.key)}
              className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
                activeStatus === tab.key
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                  {count}
                </span>
              )}
            </a>
          );
        })}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => {
          const count =
            tab.key === "ALL" ? total : (categoryMap[tab.key] ?? 0);
          return (
            <a
              key={tab.key}
              href={categoryHref(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === tab.key
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "border border-neutral-300 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              {tab.label}
              {count > 0 && <span className="opacity-60">{count}</span>}
            </a>
          );
        })}
      </div>

      {/* Messages */}
      {messages.length === 0 && (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <IconMail
            size={32}
            className="mx-auto mb-3 text-neutral-300 dark:text-neutral-600"
          />
          <p className="text-sm text-neutral-500">No messages match these filters.</p>
        </div>
      )}

      {messages.length > 0 && (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border bg-white p-4 transition-shadow hover:shadow-sm dark:bg-neutral-900 ${
                msg.status === "NEW"
                  ? "border-blue-200 dark:border-blue-900/50"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{msg.name}</span>
                    <span className="text-xs text-neutral-400">{msg.email}</span>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${STATUS_STYLE[msg.status]}`}
                    >
                      {msg.status}
                    </span>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${CATEGORY_STYLE[msg.category]}`}
                    >
                      {msg.category}
                    </span>
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
                    {msg.message}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-xs text-neutral-400">
                    <IconClock size={12} />
                    {new Date(msg.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <ContactActions contactId={msg.id} currentStatus={msg.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
