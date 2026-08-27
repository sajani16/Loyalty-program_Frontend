"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Users,
  ChevronDown,
  ChevronRight,
  Loader2,
  BadgeCheck,
  Star,
  Gift,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  useBusinessProfile,
  useBusinessCustomers,
  useCustomerLoyaltyHistory,
} from "../api";
import { BusinessCustomerRecord, CustomerActivityItem } from "@/services/merchant.service";

const tierColors: Record<string, string> = {
  bronze:  "bg-amber-800/10 text-amber-700 border-amber-700/20",
  silver:  "bg-slate-400/10 text-slate-500 border-slate-400/20",
  gold:    "bg-yellow-400/10 text-yellow-600 border-yellow-400/20",
  platinum:"bg-cyan-400/10 text-cyan-600 border-cyan-400/20",
};

const statusColors: Record<string, string> = {
  active:   "bg-green-500/10 text-green-600 border-green-500/20",
  pending:  "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  inactive: "bg-muted/40 text-muted border-border-subtle",
};

function CustomerRow({ customer }: { customer: BusinessCustomerRecord }) {
  const [expanded, setExpanded] = useState(false);
  const { data: history, isLoading: histLoading } = useCustomerLoyaltyHistory(
    expanded ? customer._id : "",
  );

  const activityList = (history ?? []) as CustomerActivityItem[];

  return (
    <>
      <tr
        className="border-b border-border-subtle hover:bg-surface-card/60 cursor-pointer transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Avatar + Name */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-xs shrink-0">
              {customer.customerId?.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {customer.customerId?.name ?? "—"}
              </p>
              <p className="text-[10px] text-muted truncate">
                {customer.customerId?.email ?? "—"}
              </p>
            </div>
          </div>
        </td>

        {/* Tier */}
        <td className="px-4 py-3">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
              tierColors[customer.tier?.toLowerCase()] ??
              "bg-muted/40 text-muted border-border-subtle"
            }`}
          >
            {customer.tier ?? "—"}
          </span>
        </td>

        {/* Points */}
        <td className="px-4 py-3 text-right">
          <span className="flex items-center justify-end gap-1 text-xs font-bold text-foreground">
            <Star className="w-3 h-3 text-amber-500" />
            {(customer.points ?? 0).toLocaleString()}
          </span>
        </td>

        {/* Stamp Cards */}
        <td className="px-4 py-3 text-right">
          <span className="flex items-center justify-end gap-1 text-xs text-muted">
            <Gift className="w-3 h-3 text-brand" />
            {customer.stampCards?.length ?? 0} card{(customer.stampCards?.length ?? 0) !== 1 ? "s" : ""}
          </span>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
              statusColors[customer.status?.toLowerCase()] ??
              "bg-muted/40 text-muted border-border-subtle"
            }`}
          >
            {customer.status ?? "—"}
          </span>
        </td>

        {/* Joined */}
        <td className="px-4 py-3 text-right">
          <span className="text-[10px] text-muted">
            {customer.joinedAt
              ? new Date(customer.joinedAt).toLocaleDateString()
              : "—"}
          </span>
        </td>

        {/* Expand toggle */}
        <td className="px-4 py-3 text-right">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-muted ml-auto" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted ml-auto" />
          )}
        </td>
      </tr>

      {/* Expanded: mini activity table */}
      {expanded && (
        <tr>
          <td colSpan={7} className="bg-surface-card/40 px-6 py-3 border-b border-brand/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">
              Recent Activity
            </p>

            {histLoading ? (
              <div className="flex items-center gap-2 py-2 text-xs text-muted">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…
              </div>
            ) : activityList.length === 0 ? (
              <p className="text-xs text-muted py-2">No transactions yet.</p>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-muted text-[10px] uppercase tracking-wide">
                    <th className="text-left pb-1 font-semibold">Date</th>
                    <th className="text-right pb-1 font-semibold">Amount</th>
                    <th className="text-right pb-1 font-semibold">Points</th>
                    <th className="text-right pb-1 font-semibold">Stamps</th>
                    <th className="text-right pb-1 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/40">
                  {activityList.slice(0, 5).map((tx) => (
                    <tr key={tx._id}>
                      <td className="py-1 text-muted">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-1 text-right font-mono">
                        {tx.amountSpent != null ? `$${tx.amountSpent.toFixed(2)}` : "—"}
                      </td>
                      <td className="py-1 text-right text-amber-600 font-semibold">
                        {tx.pointsAwarded ? `+${tx.pointsAwarded}` : "—"}
                      </td>
                      <td className="py-1 text-right text-brand font-semibold">
                        {tx.stampsAwarded ? `+${tx.stampsAwarded}` : "—"}
                      </td>
                      <td className="py-1 text-right">
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border capitalize ${
                            statusColors[tx.status] ?? "bg-muted/40 text-muted border-border-subtle"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default function MerchantCustomersPage() {
  const { data: session } = useSession();
  const { data: businessProfile } = useBusinessProfile();
  const { data: customersData, isLoading } = useBusinessCustomers();

  const businessName =
    businessProfile?.name || session?.user?.name || "Merchant";
  const customers = (customersData ?? []) as BusinessCustomerRecord[];

  const handleSignOut = () => {
    toast.success("Signed out", "You have been logged out safely.");
    void signOut({ callbackUrl: "/" });
  };

  return (
    <DashboardLayout
      userType="merchant"
      onSignOut={handleSignOut}
      businessName={businessName}
      headerTitle="Customers"
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted">
            All customers enrolled in your loyalty program
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total Members", value: customers.length, icon: Users, color: "text-brand" },
            { label: "Active", value: customers.filter((c) => c.status === "active").length, icon: BadgeCheck, color: "text-green-500" },
            { label: "Pending", value: customers.filter((c) => c.status === "pending").length, icon: Clock, color: "text-yellow-500" },
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

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
            <h2 className="text-lg font-bold text-foreground mb-2">
              No Customers Yet
            </h2>
            <p className="text-sm text-muted">
              Customers will appear here once they join your loyalty program.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border-subtle overflow-hidden bg-surface">
            <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
              <p className="text-xs font-bold text-foreground">
                {customers.length} Member{customers.length !== 1 ? "s" : ""}
              </p>
              <p className="text-[10px] text-muted">
                Click a row to see recent activity
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-card/40">
                    {["Customer", "Tier", "Points", "Stamps", "Status", "Joined", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted ${
                            ["Points", "Stamps", "Joined", ""].includes(h) ? "text-right" : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <CustomerRow key={c._id} customer={c} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
