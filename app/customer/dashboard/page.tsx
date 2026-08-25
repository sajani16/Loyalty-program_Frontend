"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Star, BadgeCheck, Gift } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useCustomerProfile, useCustomerMemberships } from "../api";
import { CustomerMembership } from "@/services/customer.service";
import {
  AppDataTable,
  ColumnDefinition,
  StatusBadge,
  DualText,
} from "@/components/ui/app-data-table";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: customerProfile } = useCustomerProfile();
  const { data: memberships, isLoading: membershipsLoading } =
    useCustomerMemberships();

  const userName = customerProfile?.name || session?.user?.name || "Customer";
  const membershipList = memberships || [];
  const totalPoints = membershipList.reduce(
    (sum, m) => sum + (m.points || 0),
    0,
  );
  const activeCount = membershipList.filter(
    (m) => m.status === "active",
  ).length;

  const handleMembershipClick = (membership: CustomerMembership) => {
    router.push(`/customer/membership/${membership._id}`);
  };

  const handleSignOut = () => {
    toast.success("Signed out", "You have been logged out safely.");
    void signOut({ callbackUrl: "/" });
  };

  const filteredMemberships = membershipList.filter(
    (m) =>
      m.businessId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "all" || m.status === statusFilter),
  );

  const membershipColumns: ColumnDefinition<CustomerMembership>[] = [
    {
      header: "Merchant",
      cell: (m) => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleMembershipClick(m)}
        >
          <div className="w-8 h-8 rounded bg-brand/10 text-brand font-bold text-xs flex items-center justify-center border border-brand/20">
            {m.businessId?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <DualText
            primary={m.businessId?.name || "Unknown"}
            secondary={`Joined ${new Date(m.joinedAt).toLocaleDateString()}`}
          />
        </div>
      ),
    },
    {
      header: "Tier",
      cell: (m) => (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-muted text-brand border border-brand/20 font-bold capitalize">
          {m.tier || "Basic"}
        </span>
      ),
    },
    {
      header: "Points",
      align: "right",
      cell: (m) => (
        <span className="text-sm font-bold text-brand">{m.points || 0}</span>
      ),
    },
    {
      header: "Status",
      align: "center",
      cell: (m) => <StatusBadge status={m.status || "active"} />,
    },
    {
      header: "Actions",
      align: "right",
      cell: (m) => (
        <button
          onClick={() => handleMembershipClick(m)}
          className="text-[10px] font-bold text-brand hover:underline"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout
      userType="customer"
      onSignOut={handleSignOut}
      userName={userName}
      headerTitle="Customer Portal"
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground mb-1">
            Welcome back, {userName.split(" ")[0]}
          </h1>
          <p className="text-xs text-muted">
            <span className="font-semibold text-brand">{activeCount}</span>{" "}
            active loyalty memberships
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-surface-card rounded-xl p-4 border border-border-subtle shadow-sm">
            <div className="flex items-center gap-1.5 mb-2 text-xs text-muted">
              <Star className="w-4 h-4 text-brand" />
              <span className="font-semibold">Total Points</span>
            </div>
            <p className="text-2xl font-bold text-brand">
              {totalPoints.toLocaleString()}
            </p>
          </div>

          <div className="bg-surface-card rounded-xl p-4 border border-border-subtle shadow-sm">
            <div className="flex items-center gap-1.5 mb-2 text-xs text-muted">
              <BadgeCheck className="w-4 h-4 text-brand" />
              <span className="font-semibold">Memberships</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {membershipList.length}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-surface-card rounded-xl p-4 border border-border-subtle shadow-sm">
            <div className="flex items-center gap-1.5 mb-2 text-xs text-muted">
              <Gift className="w-4 h-4 text-brand" />
              <span className="font-semibold">Rewards Available</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {membershipList.filter((m) => m.points > 0).length}
            </p>
          </div>
        </div>

        <AppDataTable
          title="My Memberships"
          totalCount={filteredMemberships.length}
          countLabel="memberships found"
          searchPlaceholder="Search memberships by merchant..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          filterOptions={[
            { label: "All Status", value: "all" },
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending" },
          ]}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          columns={membershipColumns}
          data={filteredMemberships}
          isLoading={membershipsLoading}
          emptyMessage="You have not joined any loyalty programs yet. Scan a merchant QR code to get started!"
        />
      </div>
    </DashboardLayout>
  );
}
