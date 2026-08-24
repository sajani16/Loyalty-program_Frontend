"use client";

import { useSession, signOut } from "next-auth/react";
import { useCustomerProfile } from "../api";
import { ChangePasswordPage } from "@/components/personal-info/ChangePasswordPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "@/hooks/use-toast";

export default function CustomerChangePasswordPage() {
  const { data: session } = useSession();
  const { data: customerProfile } = useCustomerProfile();
  const userName = customerProfile?.name || session?.user?.name || "Customer";

  const handleSignOut = () => {
    toast.success("Signed out", "You have been logged out safely.");
    void signOut({ callbackUrl: "/" });
  };

  return (
    <DashboardLayout 
      userType="customer" 
      onSignOut={handleSignOut} 
      userName={userName} 
      headerTitle="Change Password"
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl mx-auto">
        <ChangePasswordPage 
          onBack={() => window.history.back()} 
          userType="customer"
        />
      </div>
    </DashboardLayout>
  );
}
