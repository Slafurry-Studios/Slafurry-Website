"use client";

import { useState, useMemo } from "react";
import {
  IconSearch,
  IconChevronUp,
  IconChevronDown,
  IconSelector,
  IconX,
} from "@tabler/icons-react";

// ─── Types ──────────────────────────────────────────────────────
export type FilterOption = { value: string; label: string };

export type Column<T> = {
  /** Unique key — matches a field on the item or a custom sort key. */
  key: string;
  /** Header label. */
  label: string;
  /** Can be sorted by this column? Default false. */
  sortable?: boolean;
  /** Override sort accessor — when the display value differs from the sort value. */
  sortAccessor?: (item: T) => string | number | boolean | null;
  /** Column alignment. Default "left". */
  align?: "left" | "center" | "right";
};

export type DataTableFilter = {
  /** Query-param / state key for this filter. */
  key: string;
  /** Dropdown label. */
  label: string;
  /** Available options. First option is typically "All". */
  options: FilterOption[];
};

export type DataTableProps<T> = {
  /** The full data array (already fetched server-side). */
  data: T[];
  /** Placeholder text for the search input. */
  searchPlaceholder?: string;
  /** Which object keys to search against when the user types. */
  searchKeys: (keyof T & string)[];
  /** Optional filter dropdowns (rendered left-to-right). */
  filters?: DataTableFilter[];
  /** Active filter values — controlled from outside (e.g. URL search params). */
  activeFilters?: Record<string, string>;
  /** Called when a filter dropdown value changes. Receives filter key + new value. */
  onFilterChange?: (key: string, value: string) => void;
  /** Column definitions for the sort-bar header row. */
  columns: Column<T>[];
  /** Render each row. Receives the item and its filtered/sorted index. */
  renderRow: (item: T, index: number) => React.ReactNode;
  /** Empty-state message. */
  emptyMessage?: string;
  /** Default sort column + direction. */
  defaultSort?: { key: string; direction: "asc" | "desc" };
  /** Extra content to render between the search bar and the list (e.g. tab bar, pills). */
  headerExtra?: React.ReactNode;
  /** Content to render at the top (before search bar), e.g. an inline add form. */
  topContent?: React.ReactNode;
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
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(defaultSort?.key ?? null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSort?.direction ?? "asc");

  // ─── Sort ────────────────────────────────────────────────────
  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // ─── Derived data: search → filter → sort ────────────────────
  const processed = useMemo(() => {
    let result = [...data];

    // Search
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

    // External filters (controlled via activeFilters prop)
    if (activeFilters && filters) {
      for (const f of filters) {
        const val = activeFilters[f.key];
        if (val && val !== "ALL") {
          result = result.filter((item) => String(item[f.key]) === val);
        }
      }
    }

    // Sort
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

  const hasSearch = search.trim().length > 0;
  const hasActiveFilters =
    activeFilters && filters?.some((f) => activeFilters[f.key] && activeFilters[f.key] !== "ALL");

  return (
    <div className="space-y-4">
      {topContent}

      {/* Search + Filters bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
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

        {/* Filter dropdowns */}
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

        {/* Reset button */}
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

        {/* Result count */}
        <span className="ml-auto text-xs text-neutral-500 dark:text-neutral-400">
          {processed.length} {processed.length === 1 ? "result" : "results"}
        </span>
      </div>

      {headerExtra}

      {/* Column sort bar */}
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

      {/* List */}
      {processed.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="text-sm text-neutral-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {processed.map((item, i) => renderRow(item, i))}
        </div>
      )}
    </div>
  );
}
