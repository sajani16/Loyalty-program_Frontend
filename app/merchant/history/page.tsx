"use client";

import { useState, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  History,
  Loader2,
  Star,
  Gift,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useBusinessProfile, useAllLoyaltyRequests } from "../api";
import { LoyaltyRequestItem } from "@/services/merchant.service";

const STATUS_OPTIONS = ["all", "pending", "completed", "rejected", "expired"] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

const statusIcons: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />,
  pending:   <Clock className="w-3.5 h-3.5 text-yellow-500" />,
  rejected:  <XCircle className="w-3.5 h-3.5 text-red-500" />,
  expired:   <XCircle className="w-3.5 h-3.5 text-muted" />,
};

const statusClasses: Record<string, string> = {
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  pending:   "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  rejected:  "bg-red-500/10 text-red-600 border-red-500/20",
  expired:   "bg-muted/40 text-muted border-border-subtle",
};

interface LoyaltyRequest {
  _id: string;
  businessCustomerId: {
    _id: string;
    customerId: {
      _id: string;
      name: string;
      email: string;
    };
    tier: string;
  };
  amountSpent: number | null;
  pointsAwarded: number | null;
  stampsAwarded: number | null;
  status: "pending" | "completed" | "rejected" | "expired";
  createdAt: string;
}

interface MetaPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  meta?: MetaPagination;
  message: string;
}

export default function MerchantHistoryPage() {
  const { data: session } = useSession();
  const { data: businessProfile } = useBusinessProfile();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const { data: rawData, isLoading } = useAllLoyaltyRequests(page, 10, statusFilter);

  const businessName =
    businessProfile?.name || session?.user?.name || "Merchant";

  // Type cast and extract data
  const apiResponse = rawData as PaginatedResponse<LoyaltyRequest> | undefined;
  const allData: LoyaltyRequest[] = apiResponse?.data || [];
  const meta: MetaPagination = apiResponse?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  };

  // Client-side search filter on current page data
  const filtered = useMemo(() => {
    if (!search.trim()) return allData;
    const q = search.toLowerCase();
    return allData.filter(
      (r) =>
        r.businessCustomerId?.customerId?.name?.toLowerCase().includes(q) ||
        r.businessCustomerId?.customerId?.email?.toLowerCase().includes(q),
    );
  }, [allData, search]);

  const handleSignOut = () => {
    toast.success("Signed out", "You have been logged out safely.");
    void signOut({ callbackUrl: "/" });
  };

  // Summary counts (from all data on current page)
  const counts = useMemo(
    () => ({
      total:     meta.total,
      completed: allData.filter((r) => r.status === "completed").length,
      pending:   allData.filter((r) => r.status === "pending").length,
      rejected:  allData.filter((r) => r.status === "rejected").length,
    }),
    [allData, meta.total],
  );

  const totalPoints = allData
    .filter((r) => r.status === "completed")
    .reduce((s, r) => s + (r.pointsAwarded ?? 0), 0);

  const totalStamps = allData
    .filter((r) => r.status === "completed")
    .reduce((s, r) => s + (r.stampsAwarded ?? 0), 0);

  return (
    <DashboardLayout
      userType="merchant"
      onSignOut={handleSignOut}
      businessName={businessName}
      headerTitle="Activity History"
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Activity History</h1>
          <p className="text-sm text-muted">
            All loyalty transactions made by your customers
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Requests", value: counts.total, icon: History, color: "text-brand" },
            { label: "Completed", value: counts.completed, icon: CheckCircle2, color: "text-green-500" },
            { label: "Points Awarded", value: totalPoints.toLocaleString(), icon: Star, color: "text-amber-500" },
            { label: "Stamps Awarded", value: totalStamps.toLocaleString(), icon: Gift, color: "text-brand" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border-subtle bg-surface-card px-4 py-3 flex items-center gap-3"
            >
              <stat.icon className={`w-5 h-5 shrink-0 ${stat.color}`} />
              <div>
                <p className="text-xl font-bold text-foreground leading-none">
                  {stat.value}
                </p>
                <p className="text-[10px] text-muted font-medium mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by customer name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-9 px-3 rounded-lg border border-border-subtle bg-surface-card text-xs text-foreground placeholder-muted focus:outline-none focus:border-brand/40 min-w-0"
          />

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-muted shrink-0" />
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-brand text-brand-foreground border-brand"
                    : "bg-surface-card text-muted border-border-subtle hover:border-brand/30 hover:text-foreground"
                }`}
              >
                {s === "all" ? `All (${counts.total})` : s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <History className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
            <h2 className="text-lg font-bold text-foreground mb-2">
              No Transactions Found
            </h2>
            <p className="text-sm text-muted">
              {search || statusFilter !== "all"
                ? "Try adjusting your filters."
                : "Customer transactions will appear here once they start earning rewards."}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-border-subtle overflow-hidden bg-surface">
              <div className="px-4 py-3 border-b border-border-subtle">
                <p className="text-xs font-bold text-foreground">
                  {filtered.length} transaction{filtered.length !== 1 ? "s" : ""} on this page
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-subtle bg-surface-card/40">
                      {[
                        { label: "Customer", align: "left" },
                        { label: "Date", align: "left" },
                        { label: "Amount", align: "right" },
                        { label: "Points", align: "right" },
                        { label: "Stamps", align: "right" },
                        { label: "Status", align: "center" },
                      ].map((h) => (
                        <th
                          key={h.label}
                          className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted text-${h.align}`}
                        >
                          {h.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((req) => (
                      <tr
                        key={req._id}
                        className="border-b border-border-subtle/50 hover:bg-surface-card/40 transition-colors"
                      >
                        {/* Customer */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-[10px] shrink-0">
                              {req.businessCustomerId?.customerId?.name?.charAt(0).toUpperCase() ?? "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">
                                {req.businessCustomerId?.customerId?.name ?? "Unknown"}
                              </p>
                              <p className="text-[10px] text-muted truncate">
                                {req.businessCustomerId?.customerId?.email ?? "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3">
                          <p className="text-xs text-foreground">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-muted">
                            {new Date(req.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-foreground">
                          {req.amountSpent != null ? `$${req.amountSpent.toFixed(2)}` : "—"}
                        </td>

                        {/* Points */}
                        <td className="px-4 py-3 text-right">
                          {req.pointsAwarded ? (
                            <span className="flex items-center justify-end gap-1 text-xs font-bold text-amber-600">
                              <Star className="w-3 h-3" />
                              +{req.pointsAwarded}
                            </span>
                          ) : (
                            <span className="text-xs text-muted">—</span>
                          )}
                        </td>

                        {/* Stamps */}
                        <td className="px-4 py-3 text-right">
                          {req.stampsAwarded ? (
                            <span className="flex items-center justify-end gap-1 text-xs font-bold text-brand">
                              <Gift className="w-3 h-3" />
                              +{req.stampsAwarded}
                            </span>
                          ) : (
                            <span className="text-xs text-muted">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                              statusClasses[req.status] ??
                              "bg-muted/40 text-muted border-border-subtle"
                            }`}
                          >
                            {statusIcons[req.status]}
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-muted">
                Page {meta.page} of {meta.pages} ({meta.total} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-lg border border-border-subtle text-xs font-bold text-foreground hover:bg-surface-card disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(meta.pages, page + 1))}
                  disabled={page >= meta.pages}
                  className="px-3 py-2 rounded-lg border border-border-subtle text-xs font-bold text-foreground hover:bg-surface-card disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
