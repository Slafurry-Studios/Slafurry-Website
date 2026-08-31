"use client";

import { useState, useMemo, useCallback } from "react";
import {
  IconSearch,
  IconChevronUp,
  IconChevronDown,
  IconSelector,
  IconX,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react";

// ─── Types ──────────────────────────────────────────────────────
export type FilterOption = { value: string; label: string };

export type Column<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  sortAccessor?: (item: T) => string | number | boolean | null;
  align?: "left" | "center" | "right";
};

export type DataTableFilter = {
  key: string;
  label: string;
  options: FilterOption[];
};

export type BulkAction<T> = {
  /** Unique key for this action. */
  key: string;
  /** Button label. */
  label: string;
  /** Icon component (Tabler). */
  icon: React.ComponentType<{ size?: number; className?: string }>;
  /** Called with the selected row objects. Must return a promise. */
  onAction: (selected: T[]) => Promise<void>;
  /** Button variant. Default "default". */
  variant?: "default" | "danger";
};

export type DataTableProps<T> = {
  data: T[];
  searchPlaceholder?: string;
  searchKeys: (keyof T & string)[];
  filters?: DataTableFilter[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  columns: Column<T>[];
  renderRow: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  defaultSort?: { key: string; direction: "asc" | "desc" };
  headerExtra?: React.ReactNode;
  topContent?: React.ReactNode;
  /** Extract a unique string ID from each row for selection tracking. Required when bulkActions is set. */
  getRowId?: (item: T) => string;
  /** Bulk actions shown when rows are selected. Omit to disable selection. */
  bulkActions?: BulkAction<T>[];
};

// ─── Component ──────────────────────────────────────────────────
export function DataTable<T extends Record<string, unknown>>({
  data,
  searchPlaceholder = "Search...",
  searchKeys,
  filters,
  activeFilters,
  onFilterChange,
  columns,
  renderRow,
  emptyMessage = "No items found.",
  defaultSort,
  headerExtra,
  topContent,
  getRowId,
  bulkActions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(defaultSort?.key ?? null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSort?.direction ?? "asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const enableSelection = Boolean(bulkActions && bulkActions.length > 0 && getRowId);

  // Safe fallback so downstream code can always call getRowId when selection is enabled
  const getId = getRowId ?? ((item: T) => String(item.id ?? ""));

  // ─── Sort ────────────────────────────────────────────────────
  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // ─── Selection ───────────────────────────────────────────────
  const processed = useMemo(() => {
    let result = [...data];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((k) => {
          const v = item[k];
          if (v == null) return false;
          return String(v).toLowerCase().includes(q);
        })
      );
    }

    if (activeFilters && filters) {
      for (const f of filters) {
        const val = activeFilters[f.key];
        if (val && val !== "ALL") {
          result = result.filter((item) => String(item[f.key]) === val);
        }
      }
    }

    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      result.sort((a, b) => {
        const aVal = col?.sortAccessor ? col.sortAccessor(a) : a[sortKey];
        const bVal = col?.sortAccessor ? col.sortAccessor(b) : b[sortKey];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        let cmp: number;
        if (typeof aVal === "number" && typeof bVal === "number") {
          cmp = aVal - bVal;
        } else {
          cmp = String(aVal).localeCompare(String(bVal));
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [data, search, searchKeys, activeFilters, filters, sortKey, sortDir, columns]);

  const processedIds = useMemo(
    () => processed.map((item) => getId(item)),
    [processed, getId]
  );

  const allOnPageSelected =
    enableSelection &&
    processedIds.length > 0 &&
    processedIds.every((id) => selectedIds.has(id));

  const someOnPageSelected =
    enableSelection &&
    processedIds.some((id) => selectedIds.has(id)) &&
    !allOnPageSelected;

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        processedIds.forEach((id) => next.delete(id));
      } else {
        processedIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const selectedItems = useMemo(
    () => data.filter((item) => selectedIds.has(getId(item))),
    [data, selectedIds, getId]
  );

  async function runBulkAction(action: BulkAction<T>) {
    if (selectedItems.length === 0) return;
    setActionLoading(action.key);
    try {
      await action.onAction(selectedItems);
      setSelectedIds(new Set());
    } finally {
      setActionLoading(null);
    }
  }

  const hasSearch = search.trim().length > 0;
  const hasActiveFilters =
    activeFilters && filters?.some((f) => activeFilters[f.key] && activeFilters[f.key] !== "ALL");

  return (
    <div className="space-y-4">
      {topContent}

      {/* Search + Filters bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <IconSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white"
          />
          {hasSearch && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <IconX size={14} />
            </button>
          )}
        </div>

        {filters?.map((f) => {
          const val = activeFilters?.[f.key] ?? "ALL";
          return (
            <select
              key={f.key}
              value={val}
              onChange={(e) => onFilterChange?.(f.key, e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white"
            >
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        })}

        {(hasSearch || hasActiveFilters) && (
          <button
            onClick={() => {
              setSearch("");
              if (onFilterChange) {
                filters?.forEach((f) => onFilterChange(f.key, "ALL"));
              }
            }}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <IconX size={12} />
            Clear
          </button>
        )}

        <span className="ml-auto text-xs text-neutral-500 dark:text-neutral-400">
          {processed.length} {processed.length === 1 ? "result" : "results"}
        </span>
      </div>

      {headerExtra}

      {/* Sort bar + select-all row */}
      <div className="flex items-center gap-3">
        {enableSelection && processed.length > 0 && (
          <label className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span
              onClick={toggleSelectAll}
              className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border transition-colors ${
                allOnPageSelected
                  ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white"
                  : someOnPageSelected
                    ? "border-neutral-400 bg-neutral-200 dark:border-neutral-500 dark:bg-neutral-700"
                    : "border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900"
              }`}
            >
              {(allOnPageSelected || someOnPageSelected) && (
                <IconCheck
                  size={10}
                  className={allOnPageSelected ? "text-white dark:text-neutral-900" : "text-neutral-600 dark:text-neutral-300"}
                />
              )}
            </span>
            {allOnPageSelected
              ? "Deselect all"
              : someOnPageSelected
                ? `Select all ${processedIds.length}`
                : `Select all ${processedIds.length}`}
          </label>
        )}

        {columns.some((c) => c.sortable) && (
          <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="mr-1">Sort:</span>
            {columns
              .filter((c) => c.sortable)
              .map((col) => {
                const active = sortKey === col.key;
                return (
                  <button
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 font-medium transition-colors ${
                      active
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {col.label}
                    {active ? (
                      sortDir === "asc" ? (
                        <IconChevronUp size={12} />
                      ) : (
                        <IconChevronDown size={12} />
                      )
                    ) : (
                      <IconSelector size={12} className="opacity-40" />
                    )}
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {enableSelection && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {selectedIds.size} selected
          </span>
          <div className="flex gap-2">
            {bulkActions!.map((action) => {
              const IconComp = action.icon;
              const loading = actionLoading === action.key;
              return (
                <button
                  key={action.key}
                  onClick={() => runBulkAction(action)}
                  disabled={loading}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                    action.variant === "danger"
                      ? "border border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                      : "border border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  }`}
                >
                  {loading ? (
                    <IconLoader2 size={12} className="animate-spin" />
                  ) : (
                    <IconComp size={12} />
                  )}
                  {action.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* List */}
      {processed.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="text-sm text-neutral-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {processed.map((item, i) => {
            const id = getId(item);
            return (
              <div key={id} className="flex items-start gap-3">
                {enableSelection && (
                  <div className="pt-4">
                    <span
                      onClick={() => toggleSelect(id)}
                      className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border transition-colors ${
                        selectedIds.has(id)
                          ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white"
                          : "border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900"
                      }`}
                    >
                      {selectedIds.has(id) && (
                        <IconCheck size={10} className="text-white dark:text-neutral-900" />
                      )}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">{renderRow(item, i)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
