"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  QrCode,
  ScanLine,
  Gift,
  Star,
  LogOut,
  ChevronRight,
  BadgeCheck,
  Sparkles,
  Store,
  Coffee,
  Utensils,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import QRScannerModal from "./QRScannerModal";
import { toast } from "@/hooks/use-toast";
import { useCustomerProfile, useCustomerMemberships } from "../api";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

function getBusinessIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("coffee") || lower.includes("cafe")) return Coffee;
  if (lower.includes("burger") || lower.includes("restaurant") || lower.includes("food")) return Utensils;
  if (lower.includes("spa") || lower.includes("shop") || lower.includes("store")) return ShoppingBag;
  return Store;
}

/* ─── Navbar ──────────────────────────────────────────── */
function CustomerNavbar({
  onScanClick,
  userName,
}: {
  onScanClick: () => void;
  userName: string;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = () => {
    toast.success("Signed out", "You have been logged out safely.");
    void signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center">
            <QrCode className="w-4 h-4 text-brand-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">
            Loyalty<span className="text-brand">Hub</span>
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <button
            id="scan-qr-btn"
            onClick={onScanClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-all"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>

          {/* Avatar menu */}
          <div className="relative">
            <button
              id="customer-avatar-btn"
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-md bg-brand-muted border border-brand/30 text-brand font-bold text-xs flex items-center justify-center hover:bg-brand/20 transition-colors"
            >
              {userName.charAt(0).toUpperCase()}
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-surface-card rounded-md border border-border-subtle shadow-lg overflow-hidden z-50">
                <div className="px-3 py-2 border-b border-border-subtle">
                  <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                  <p className="text-[10px] text-muted">Customer Account</p>
                </div>
                <button
                  id="customer-signout-btn"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-surface transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── Main Dashboard ───────────────────────────────────── */
export default function CustomerDashboard() {
  const { data: session } = useSession();
  const [showScanner, setShowScanner] = useState(false);

  const { data: customerProfile } = useCustomerProfile();
  const { data: memberships, isLoading: membershipsLoading } = useCustomerMemberships();

  const userName = customerProfile?.name || session?.user?.name || "Customer";
  const membershipList = memberships || [];
  const totalPoints = membershipList.reduce((sum, m) => sum + (m.points || 0), 0);

  const handleMembershipClick = (businessName: string, points: number, tier: string) => {
    toast.info(businessName, `You currently have ${points.toLocaleString()} points (${tier} Tier).`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <CustomerNavbar
        onScanClick={() => setShowScanner(true)}
        userName={userName}
      />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-lg sm:text-xl font-bold text-foreground mb-0.5">
            Welcome back, {userName.split(" ")[0]} 👋
          </h1>
          <p className="text-xs text-muted">
            <span className="font-semibold text-brand">{membershipList.length}</span> active loyalty memberships
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-surface-card rounded-md p-3.5 border border-border-subtle">
            <div className="flex items-center gap-1.5 mb-1 text-xs text-muted">
              <Star className="w-3.5 h-3.5 text-brand" />
              <span>Total Points</span>
            </div>
            <p className="text-xl font-bold text-brand">{totalPoints.toLocaleString()}</p>
          </div>

          <div className="bg-surface-card rounded-md p-3.5 border border-border-subtle">
            <div className="flex items-center gap-1.5 mb-1 text-xs text-muted">
              <BadgeCheck className="w-3.5 h-3.5 text-brand" />
              <span>Memberships</span>
            </div>
            <p className="text-xl font-bold text-foreground">{membershipList.length}</p>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-surface-card rounded-md p-3.5 border border-border-subtle">
            <div className="flex items-center gap-1.5 mb-1 text-xs text-muted">
              <Gift className="w-3.5 h-3.5 text-brand" />
              <span>Rewards</span>
            </div>
            <p className="text-xl font-bold text-foreground">{membershipList.length > 0 ? "1" : "0"}</p>
          </div>
        </div>

        {/* Primary Scan Banner */}
        <div
          className="rounded-md p-4 mb-6 bg-surface-card border border-brand/40 cursor-pointer hover:border-brand transition-all"
          onClick={() => setShowScanner(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand text-xs font-semibold mb-0.5">Quick Action</p>
              <h2 className="text-foreground text-sm font-bold">Scan Merchant QR Code</h2>
              <p className="text-muted text-[11px]">Tap to open camera scanner and submit visit request.</p>
            </div>
            <div className="w-10 h-10 rounded-md bg-brand flex items-center justify-center flex-shrink-0 ml-3">
              <ScanLine className="w-5 h-5 text-brand-foreground" />
            </div>
          </div>
        </div>

        {/* My Memberships */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">My Memberships</h2>
          </div>

          {membershipsLoading ? (
            <div className="p-6 text-center bg-surface-card rounded-md border border-border-subtle">
              <Loader2 className="w-5 h-5 text-brand animate-spin mx-auto mb-2" />
              <p className="text-xs text-muted">Loading memberships...</p>
            </div>
          ) : membershipList.length === 0 ? (
            <div className="p-6 text-center bg-surface-card rounded-md border border-border-subtle">
              <Store className="w-6 h-6 text-muted mx-auto mb-2 opacity-60" />
              <p className="text-xs font-semibold text-foreground mb-1">No memberships yet</p>
              <p className="text-[11px] text-muted mb-3">Scan a business QR code to join your first program!</p>
              <button
                onClick={() => setShowScanner(true)}
                className="px-3.5 py-1.5 rounded-md bg-brand text-brand-foreground font-bold text-xs hover:opacity-90 transition-all"
              >
                Scan Business QR
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {membershipList.map((m) => {
                const bName = m.businessId?.name || "Business";
                const IconComponent = getBusinessIcon(bName);
                return (
                  <div
                    key={m._id}
                    onClick={() => handleMembershipClick(bName, m.points, m.tier)}
                    className="flex items-center gap-3 bg-surface-card rounded-md p-3 border border-border-subtle hover:border-brand/40 transition-all cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-md bg-brand-muted border border-brand/30 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-brand" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-foreground text-xs truncate">{bName}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium bg-brand-muted text-brand border border-brand/20 flex-shrink-0">
                          {m.tier || "Basic"}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted">
                        <span className="text-brand font-semibold">{m.points || 0} pts</span> • Status: {m.status}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted group-hover:text-brand transition-colors flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScannerModal onClose={() => setShowScanner(false)} />
      )}
    </div>
  );
}
