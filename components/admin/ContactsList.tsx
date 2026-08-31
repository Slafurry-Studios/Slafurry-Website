"use client";

import { IconClock } from "@tabler/icons-react";
import { ContactActions } from "@/components/admin/ContactActions";
import { DataTable } from "@/components/admin/DataTable";
import type { Column, DataTableFilter } from "@/components/admin/DataTable";

const STATUS_TABS: { key: string; label: string }[] = [
  { key: "NEW", label: "New" },
  { key: "READ", label: "Read" },
  { key: "REPLIED", label: "Replied" },
  { key: "ALL", label: "All" },
];

const CATEGORY_TABS: { key: string; label: string }[] = [
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

type ContactRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  category: string;
  createdAt: string;
};

const COLUMNS: Column<ContactRow>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "message", label: "Message" },
  { key: "status", label: "Status", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "createdAt", label: "Date", sortable: true },
];

const FILTERS: DataTableFilter[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "ALL", label: "All statuses" },
      { value: "NEW", label: "New" },
      { value: "READ", label: "Read" },
      { value: "REPLIED", label: "Replied" },
    ],
  },
  {
    key: "category",
    label: "Category",
    options: [
      { value: "ALL", label: "All categories" },
      { value: "GENERAL", label: "General" },
      { value: "BUSINESS", label: "Business" },
      { value: "PRESS", label: "Press" },
    ],
  },
];

export function ContactsList({
  messages,
  activeStatus,
  activeCategory,
  statusMap,
  categoryMap,
  total,
}: {
  messages: ContactRow[];
  activeStatus: string;
  activeCategory: string;
  statusMap: Record<string, number>;
  categoryMap: Record<string, number>;
  total: number;
}) {
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

      <DataTable
        data={messages}
        searchPlaceholder="Search by name or email..."
        searchKeys={["name", "email", "message"]}
        filters={FILTERS}
        columns={COLUMNS}
        defaultSort={{ key: "createdAt", direction: "desc" }}
        emptyMessage="No messages match these filters."
        headerExtra={
          <>
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
          </>
        }
        renderRow={(msg) => (
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
        )}
      />
    </div>
  );
}
