import { Suspense } from "react";
import CustomerDashboard from "./CustomerDashboard";

export const metadata = {
  title: "My Dashboard — LoyaltyHub Customer",
  description: "View your loyalty memberships, points, and scan QR codes to earn rewards.",
};

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-violet-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl gradient-brand mx-auto mb-3 flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M3 9V7a2 2 0 0 1 2-2h2M3 15v2a2 2 0 0 0 2 2h2m10-14h2a2 2 0 0 1 2 2v2m-4 10h2a2 2 0 0 0 2-2v-2"/></svg>
          </div>
          <p className="text-gray-500 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    }>
      <CustomerDashboard />
    </Suspense>
  );
}
