"use client";

import { useState } from "react";
import { History, Loader2 } from "lucide-react";
import {
  AppDataTable,
  ColumnDefinition,
  StatusBadge,
} from "@/components/ui/app-data-table";
import { useActivityHistory } from "../api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useSession, signOut } from "next-auth/react";
import { useCustomerProfile } from "../api";
import { toast } from "@/hooks/use-toast";

interface LoyaltyRequest {
  _id: string;
  businessCustomerId: {
    _id?: string;
    businessId: {
      name: string;
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
  data?: T[];
  meta?: MetaPagination;
}

export default function ActivityHistoryPage() {
  const { data: session } = useSession();
  const { data: customerProfile } = useCustomerProfile();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: rawData,
    isLoading,
    error,
  } = useActivityHistory(page, 10, statusFilter);

  // Cast raw response to PaginatedResponse for safety
  const apiResponse = rawData as
    | PaginatedResponse<LoyaltyRequest>
    | LoyaltyRequest[]
    | undefined;

  const activities: LoyaltyRequest[] = Array.isArray(apiResponse)
    ? apiResponse
    : apiResponse?.data || [];

  const meta: MetaPagination =
    !Array.isArray(apiResponse) && apiResponse?.meta
      ? apiResponse.meta
      : { page: 1, limit: 10, total: activities.length, pages: 1 };

  const userName = customerProfile?.name || session?.user?.name || "Customer";

  const handleSignOut = () => {
    toast.success("Signed out", "You have been logged out safely.");
    void signOut({ callbackUrl: "/" });
  };

  const columns: ColumnDefinition<LoyaltyRequest>[] = [
    {
      header: "Merchant",
      cell: (activity) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-brand/10 text-brand font-bold text-xs flex items-center justify-center border border-brand/20">
            {activity.businessCustomerId?.businessId?.name
              ?.charAt(0)
              .toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {activity.businessCustomerId?.businessId?.name || "Unknown"}
            </p>
            <p className="text-xs text-muted">
              Tier: {activity.businessCustomerId?.tier || "Basic"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Amount Spent",
      cell: (activity) => (
        <span className="font-bold text-foreground">
          {activity.amountSpent ? `$${activity.amountSpent.toFixed(2)}` : "-"}
        </span>
      ),
    },
    {
      header: "Rewards Earned",
      cell: (activity) => (
        <div className="flex flex-col gap-1">
          {activity.pointsAwarded ? (
            <span className="font-bold text-brand text-sm">
              ⭐ {activity.pointsAwarded} pts
            </span>
          ) : null}
          {activity.stampsAwarded ? (
            <span className="font-bold text-orange-500 text-sm">
              🎫 {activity.stampsAwarded} stamp
              {activity.stampsAwarded !== 1 ? "s" : ""}
            </span>
          ) : null}
          {!activity.pointsAwarded && !activity.stampsAwarded ? (
            <span className="text-muted text-sm">-</span>
          ) : null}
        </div>
      ),
    },
    {
      header: "Status",
      align: "center",
      cell: (activity) => <StatusBadge status={activity.status} />,
    },
    {
      header: "Date",
      cell: (activity) => (
        <div className="text-sm">
          <p className="text-foreground">
            {new Date(activity.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-muted">
            {new Date(activity.createdAt).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
  ];

  if (isLoading && page === 1) {
    return (
      <DashboardLayout
        userType="customer"
        onSignOut={handleSignOut}
        userName={userName}
        headerTitle="Activity History"
      >
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userType="customer"
      onSignOut={handleSignOut}
      userName={userName}
      headerTitle="Activity History"
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Activity History
          </h1>
          <p className="text-sm text-muted">
            View all your loyalty requests and spending
          </p>
        </div>

        {activities.length === 0 && !isLoading ? (
          <div className="text-center py-20">
            <History className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
            <h2 className="text-lg font-bold text-foreground mb-2">
              No Activity Yet
            </h2>
            <p className="text-sm text-muted">
              Scan a merchant QR code to start making loyalty requests
            </p>
          </div>
        ) : (
          <AppDataTable
            title="My Transactions"
            totalCount={meta.total || 0}
            countLabel="transactions found"
            columns={columns}
            data={activities}
            isLoading={isLoading}
            page={page}
            totalPages={meta.pages || 1}
            onPageChange={setPage}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
