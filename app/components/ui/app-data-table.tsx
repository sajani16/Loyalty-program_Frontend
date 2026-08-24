"use client";

import * as React from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

export type ColumnDefinition<T> = {
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
};

interface AppDataTableProps<T> {
  title: string;
  totalCount: number;
  countLabel?: string;
  actionButton?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  };
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  filterOptions?: Array<{ label: string; value: string }>;
  filterValue?: string;
  onFilterChange?: (val: string) => void;
  columns: ColumnDefinition<T>[];
  data: T[];
  page?: number;
  totalPages?: number;
  onPageChange?: (newPage: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function AppDataTable<T>({
  title,
  totalCount,
  countLabel = "items found",
  actionButton,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  filterOptions,
  filterValue,
  onFilterChange,
  columns,
  data,
  page = 1,
  totalPages = 1,
  onPageChange,
  isLoading,
  emptyMessage = "No data available",
}: AppDataTableProps<T>) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
          </div>
          <p className="text-xs text-muted">{totalCount} {countLabel}</p>
        </div>
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="mt-2 sm:mt-0 flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-all shadow-sm"
          >
            {actionButton.icon && <actionButton.icon className="w-4 h-4" />}
            {actionButton.label}
          </button>
        )}
      </div>

      {/* Card Container */}
      <div className="bg-surface-card rounded-md border border-border-subtle shadow-sm overflow-hidden">
        {/* Toolbar */}
        {(onSearchChange || filterOptions) && (
          <div className="p-4 border-b border-border-subtle flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface/30">
            {onSearchChange && (
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-9 h-9 text-xs bg-background border-border-subtle w-full"
                />
              </div>
            )}
            {filterOptions && onFilterChange && (
              <div className="w-full sm:w-48">
                <Select value={filterValue} onValueChange={onFilterChange}>
                  <SelectTrigger className="h-9 text-xs bg-background border-border-subtle">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-surface/50">
              <TableRow className="hover:bg-transparent border-border-subtle">
                {columns.map((col, i) => (
                  <TableHead
                    key={i}
                    className={`h-10 text-xs font-semibold text-muted ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"} ${col.className || ""}`}
                  >
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-xs text-muted">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-xs text-muted">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="border-border-subtle hover:bg-surface/40 transition-colors">
                    {columns.map((col, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={`py-3 px-4 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"} ${col.className || ""}`}
                      >
                        {col.cell ? col.cell(row) : col.accessorKey ? (row[col.accessorKey] as React.ReactNode) : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border-subtle bg-surface/30 flex items-center justify-between">
            <span className="text-xs text-muted font-medium">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange && onPageChange(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold border border-border-subtle bg-background text-foreground hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              <button
                onClick={() => onPageChange && onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold border border-border-subtle bg-background text-foreground hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Badge helpers for consistency
export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  
  if (s === "approved" || s === "active" || s === "completed") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-500/10 text-green-600 border border-green-500/20">
        {status}
      </span>
    );
  }
  if (s === "pending") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
        {status}
      </span>
    );
  }
  if (s === "rejected" || s === "declined" || s === "blocked") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-500/20">
        {status}
      </span>
    );
  }
  
  // Default/Brand fallback
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand/10 text-brand border border-brand/20">
      {status}
    </span>
  );
}

export function DualText({ primary, secondary }: { primary: React.ReactNode; secondary?: React.ReactNode }) {
  return (
    <div className="flex flex-col min-w-0">
      <span className="text-xs font-semibold text-foreground truncate">{primary}</span>
      {secondary && <span className="text-[10px] text-muted truncate">{secondary}</span>}
    </div>
  );
}
