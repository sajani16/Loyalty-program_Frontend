"use client";

import { useSession, signOut } from "next-auth/react";
import { useBusinessProfile } from "../api";
import { ChangePasswordPage } from "@/components/personal-info/ChangePasswordPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "@/hooks/use-toast";

export default function MerchantChangePasswordPage() {
  const { data: session } = useSession();
  const { data: businessProfile } = useBusinessProfile();
  const businessName = businessProfile?.name || session?.user?.name || "Merchant";

  const handleSignOut = () => {
    toast.success("Signed out", "You have been logged out safely.");
    void signOut({ callbackUrl: "/" });
  };

  return (
    <DashboardLayout 
      userType="business" 
      activePage="change-password" 
      onPageChange={() => {}} 
      onSignOut={handleSignOut} 
      userName={businessName} 
      headerTitle="Change Password"
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl mx-auto">
        <ChangePasswordPage 
          onBack={() => window.history.back()} 
          userType="business"
        />
      </div>
    </DashboardLayout>
  );
}
