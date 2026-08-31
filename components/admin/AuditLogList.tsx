"use client";

import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { IconHistory } from "@tabler/icons-react";
import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import type { Column, DataTableFilter } from "@/components/admin/DataTable";

type AuditLogRow = {
  id: string;
  adminUserId: string;
  adminUserName: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: unknown;
  createdAt: string;
};

type AdminOption = { id: string; name: string };

const ACTION_STYLE: Record<string, string> = {
  CREATE:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  UPDATE:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  DELETE:
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const COLUMNS: Column<AuditLogRow>[] = [
  { key: "createdAt", label: "Time", sortable: true },
  { key: "adminUserName", label: "Admin", sortable: true },
  { key: "action", label: "Action", sortable: true },
  { key: "entityType", label: "Entity", sortable: true },
  { key: "entityId", label: "Entity ID" },
];

function DiffViewer({ changes }: { changes: unknown }) {
  if (!changes || typeof changes !== "object")
    return <span className="text-muted-foreground">—</span>;

  const { before, after } = changes as {
    before: Record<string, unknown> | null;
    after: Record<string, unknown> | null;
  };

  if (!before && !after)
    return <span className="text-muted-foreground">—</span>;

  const keys = [
    ...new Set([
      ...Object.keys(before ?? {}),
      ...Object.keys(after ?? {}),
    ]),
  ];

  return (
    <div className="space-y-0.5 text-xs max-h-48 overflow-auto">
      {keys.map((key) => (
        <div key={key} className="flex gap-2">
          <span className="font-mono text-muted-foreground min-w-[100px] shrink-0">
            {key}
          </span>
          {before?.[key] !== undefined && (
            <span className="text-red-500 line-through break-all">
              {formatValue(before[key])}
            </span>
          )}
          {after?.[key] !== undefined && (
            <span className="text-emerald-600 break-all">
              {formatValue(after[key])}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "null";
  if (typeof val === "string") return val || '""';
  if (typeof val === "boolean" || typeof val === "number") return String(val);
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

export function AuditLogList({
  logs,
  admins,
  entityTypes,
  initialFilters,
}: {
  logs: AuditLogRow[];
  admins: AdminOption[];
  entityTypes: string[];
  initialFilters: { adminUserId: string; entityType: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLog, setSelectedLog] = useState<AuditLogRow | null>(null);

  const filters: DataTableFilter[] = [
    {
      key: "adminUserName",
      label: "Admin",
      options: admins.map((a) => ({ value: a.name, label: a.name })),
    },
    {
      key: "entityType",
      label: "Entity Type",
      options: entityTypes.map((e) => ({ value: e, label: e })),
    },
    {
      key: "action",
      label: "Action",
      options: [
        { value: "CREATE", label: "Create" },
        { value: "UPDATE", label: "Update" },
        { value: "DELETE", label: "Delete" },
      ],
    },
  ];

  const handleFilterChange = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    router.push(`?${next.toString()}`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center gap-3">
        <IconHistory size={32} className="text-muted-foreground" />
        <div>
          <h1 className="font-heading text-3xl tracking-tight">
            Audit Log
          </h1>
          <p className="text-sm text-muted-foreground">
            Read-only history of all admin mutations.
          </p>
        </div>
      </div>

      <DataTable
        data={logs}
        searchPlaceholder="Search by entity ID..."
        searchKeys={["entityId"]}
        filters={filters}
        activeFilters={{
          ...(initialFilters.adminUserId && {
            adminUserName:
              admins.find((a) => a.id === initialFilters.adminUserId)?.name ??
              "",
          }),
          ...(initialFilters.entityType && {
            entityType: initialFilters.entityType,
          }),
        }}
        onFilterChange={handleFilterChange}
        columns={COLUMNS}
        defaultSort={{ key: "createdAt", direction: "desc" }}
        emptyMessage="No audit log entries found."
        renderRow={(log) => {
          const row = log as unknown as AuditLogRow;
          return (
            <button
              key={row.id}
              onClick={() =>
                setSelectedLog(selectedLog?.id === row.id ? null : row)
              }
              className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-left transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        ACTION_STYLE[row.action] ?? ""
                      }`}
                    >
                      {row.action}
                    </span>
                    <span className="font-mono text-sm font-medium">
                      {row.entityType}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      by {row.adminUserName}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground truncate">
                    {row.entityId}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(row.createdAt).toLocaleString()}
                </span>
              </div>

              {selectedLog?.id === row.id && (
                <div className="mt-3 rounded-lg bg-muted p-3 border-t border-border">
                  <DiffViewer changes={row.changes} />
                </div>
              )}
            </button>
          );
        }}
      />
    </div>
  );
}
