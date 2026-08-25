"use client";

import { useSession, signOut } from "next-auth/react";
import { Users, TrendingUp, ClipboardList } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MerchantOverview } from "./components/MerchantOverview";
import {
  useBusinessProfile,
  useBusinessCustomers,
  usePendingRequests,
} from "../api";

export default function MerchantDashboardPage() {
  const { data: session } = useSession();
  const { data: businessProfile } = useBusinessProfile();
  const { data: customersData } = useBusinessCustomers();
  const { data: pendingData } = usePendingRequests();

  const businessName = businessProfile?.name || session?.user?.name || "Merchant";
  const businessId = (session?.user as any)?.id;
  const customersList = customersData || [];
  const requestsList = pendingData || [];
  const pendingCount = requestsList.filter((r) => r.status === "pending").length;

  const totalCustomersCount = customersList.length;
  const totalPointsAwarded = customersList.reduce((sum, c) => sum + (c.points || 0), 0);

  const stats = [
    {
      label: "Total Customers",
      value: totalCustomersCount.toString(),
      icon: Users,
    },
    {
      label: "Points Awarded",
      value: totalPointsAwarded.toLocaleString(),
      icon: TrendingUp,
    },
    {
      label: "Pending Requests",
      value: pendingCount.toString(),
      icon: ClipboardList,
    },
  ];

  const handleSignOut = () => {
    toast.success("Signed out", "You have been logged out safely.");
    void signOut({ callbackUrl: "/" });
  };

  return (
    <DashboardLayout
      userType="merchant"
      onSignOut={handleSignOut}
      businessName={businessName}
      headerTitle="Merchant Portal"
      pendingRequestsCount={pendingCount}
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground mb-1">
            Welcome back, {businessName.split(" ")[0]} 👋
          </h1>
          <p className="text-xs text-muted">
            <span className="font-semibold text-brand">{pendingCount}</span> pending
            loyalty requests
          </p>
        </div>

        <MerchantOverview
          businessName={businessName}
          businessId={businessId}
          stats={stats}
          requestsList={requestsList}
          pendingLoading={false}
          onPageSwitch={() => {}}
          onShowProductsModal={() => {}}
          onShowAddCustomer={() => {}}
          onApproveRequest={() => {}}
          onRejectRequest={() => {}}
          onAddProductsToRequest={() => {}}
        />
      </div>
    </DashboardLayout>
  );
}
