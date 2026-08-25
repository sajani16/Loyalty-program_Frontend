"use client";

import { useSession, signOut } from "next-auth/react";
import { useBusinessProfile } from "../api";
import { ChangePasswordPage } from "@/components/personal-info/ChangePasswordPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "@/hooks/use-toast";

export default function MerchantChangePasswordPage() {
  const { data: session } = useSession();
  const { data: businessProfile } = useBusinessProfile();
  const businessName =
    businessProfile?.name || session?.user?.name || "Merchant";

  const handleSignOut = () => {
    toast.success("Signed out", "You have been logged out safely.");
    void signOut({ callbackUrl: "/" });
  };

  return (
    <DashboardLayout
      userType="merchant"
      onSignOut={handleSignOut}
      businessName={businessName}
      headerTitle="Change Password"
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl mx-auto">
        <ChangePasswordPage
          onBack={() => window.history.back()}
          userType="merchant"
        />
      </div>
    </DashboardLayout>
  );
}
