"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ArrowLeft,
  Star,
  Gift,
  Calendar,
  ShieldCheck,
  Award,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { useCustomerProfile, useMembershipDetail } from "@/customer/api";
import { toast } from "@/hooks/use-toast";

export default function MembershipDetailsPage() {
  const params = useParams<{ membershipId: string }>();
  const membershipId = params?.membershipId ?? "";

  const { data: session } = useSession();
  const { data: customerProfile } = useCustomerProfile();
  const { data: membership, isLoading } = useMembershipDetail(membershipId);

  const userName = customerProfile?.name || session?.user?.name || "Customer";

  const handleSignOut = () => {
    toast.success("Signed out", "You have been logged out safely.");
    void signOut({ callbackUrl: "/" });
  };

  const tierColors: Record<string, { badge: string; border: string }> = {
    basic: {
      badge:
        "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300",
      border: "border-slate-300",
    },
    silver: {
      badge:
        "bg-slate-200 text-slate-800 border-slate-400 dark:bg-slate-700 dark:text-slate-200",
      border: "border-slate-400",
    },
    gold: {
      badge:
        "bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-950/50 dark:text-amber-300",
      border: "border-amber-400",
    },
    platinum: {
      badge:
        "bg-purple-100 text-purple-800 border-purple-400 dark:bg-purple-950/50 dark:text-purple-300",
      border: "border-purple-400",
    },
  };

  const tierThresholds = {
    basic: 500,
    silver: 1000,
    gold: 2000,
    platinum: 5000,
  };

  const safeTier = membership?.tier?.toLowerCase() || "basic";
  const currentTierStyle = tierColors[safeTier] || tierColors.basic;
  const nextTierThreshold =
    tierThresholds[safeTier as keyof typeof tierThresholds] || 500;
  const currentPoints = membership?.points || 0;
  const progressPercentage = Math.min(
    (currentPoints / nextTierThreshold) * 100,
    100,
  );

  if (isLoading) {
    return (
      <DashboardLayout
        userType="customer"
        onSignOut={handleSignOut}
        userName={userName}
        headerTitle="Membership Details"
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-brand" />
        </div>
      </DashboardLayout>
    );
  }

  if (!membership) {
    return (
      <DashboardLayout
        userType="customer"
        onSignOut={handleSignOut}
        userName={userName}
        headerTitle="Membership Details"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
          <Link
            href="/customer/membership"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Memberships
          </Link>
          <div className="bg-surface-card border border-border-subtle rounded-xl p-12 text-center">
            <p className="text-foreground text-lg font-semibold">
              Membership not found
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const businessName = membership.businessId?.name || "Business";
  const totalCompletedStamps =
    membership.stampCards?.reduce(
      (sum, card) => sum + (card.completedCards || 0),
      0,
    ) || 0;

  return (
    <DashboardLayout
      userType="customer"
      onSignOut={handleSignOut}
      userName={userName}
      headerTitle={`${businessName} Details`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-300">
        {/* Top Header Section (Left Aligned) */}
        <div className="space-y-4 border-b border-border-subtle pb-6">
          <Link
            href="/customer/membership"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Memberships
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand text-brand-foreground font-extrabold text-2xl flex items-center justify-center shadow-md shrink-0">
                {businessName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    {businessName}
                  </h1>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold border capitalize ${currentTierStyle.badge}`}
                  >
                    {membership.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand" />
                    Member since{" "}
                    {new Date(membership.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Tier & Progress */}
            <div className="bg-surface-card border border-border-subtle p-4 rounded-xl min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand" />
                  Tier Status
                </span>
                <span className="text-xs font-extrabold tracking-wider uppercase text-brand">
                  {membership.tier || "BASIC"}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-muted">Progress to next tier</span>
                  <span className="text-foreground font-bold">
                    {currentPoints} / {nextTierThreshold} pts
                  </span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden border border-border-subtle">
                  <div
                    className="h-full bg-brand transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics / Data Display Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 bg-surface-card rounded-2xl border border-border-subtle shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">
                Available Points
              </p>
              <h3 className="text-3xl font-black text-foreground mt-1">
                {membership.points}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Star className="w-6 h-6 fill-amber-500/20" />
            </div>
          </div>

          <div className="p-5 bg-surface-card rounded-2xl border border-border-subtle shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">
                Completed Stamp Cards
              </p>
              <h3 className="text-3xl font-black text-foreground mt-1">
                {totalCompletedStamps}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-surface-card rounded-2xl border border-border-subtle shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">
                Active Stamp Cards
              </p>
              <h3 className="text-3xl font-black text-foreground mt-1">
                {membership.stampCards?.length || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Physical Stamp Card Section */}
        {membership.stampCards && membership.stampCards.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand" />
              <h2 className="text-lg font-bold text-foreground">
                Your Loyalty Cards
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {membership.stampCards.map((card, idx) => {
                const cardTitle =
                  typeof card.productId === "string"
                    ? `Loyalty Card #${idx + 1}`
                    : card.productId?.name || `Loyalty Card #${idx + 1}`;

                const completedCount = card.completedCards || 0;
                const progress = card.progress || 0;
                // Get stampTarget from product if available, otherwise default to 10
                const stampTarget = typeof card.productId === "object" ? card.productId?.stampTarget || 10 : 10;

                return (
                  <div
                    key={idx}
                    className="relative bg-gradient-to-br from-surface-card to-surface border-2 border-border-subtle rounded-3xl p-6 shadow-md overflow-hidden flex flex-col justify-between space-y-6"
                  >
                    {/* Top Stamp Card Header */}
                    <div className="flex items-start justify-between border-b border-border-subtle pb-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand">
                          Stamp Card
                        </span>
                        <h3 className="text-lg font-bold text-foreground">
                          {cardTitle}
                        </h3>
                      </div>
                      <div className="bg-brand/10 border border-brand/20 px-3 py-1 rounded-full text-xs font-bold text-brand">
                        {completedCount} Completed
                      </div>
                    </div>

                    {/* Physical Grid of Stamps */}
                    <div className="grid grid-cols-5 gap-3 sm:gap-4 py-2">
                      {Array.from({ length: stampTarget }).map((_, i) => {
                        const isStamped = i < progress;
                        const isReward = i === stampTarget - 1;

                        return (
                          <div
                            key={i}
                            className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                              isStamped
                                ? "bg-brand text-brand-foreground shadow-lg shadow-brand/20 scale-105 border-2 border-brand"
                                : "bg-muted/10 border-2 border-dashed border-border-subtle text-muted opacity-40 hover:opacity-60"
                            }`}
                          >
                            {/* Inner Stamp Icon */}
                            {isStamped ? (
                              <div className="flex flex-col items-center justify-center animate-in zoom-in-50 duration-200">
                                {isReward ? (
                                  <Gift className="w-6 h-6 text-brand-foreground animate-bounce" />
                                ) : (
                                  <CheckCircle2 className="w-6 h-6 text-brand-foreground" />
                                )}
                                <span className="text-[9px] font-black tracking-tighter uppercase mt-0.5">
                                  Stamped
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                {isReward ? (
                                  <Sparkles className="w-5 h-5 text-muted" />
                                ) : (
                                  <span className="text-xs font-extrabold">
                                    {i + 1}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Badge indicator for final reward spot */}
                            {isReward && !isStamped && (
                              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer of Card */}
                    <div className="bg-surface/60 border border-border-subtle rounded-xl p-3 flex items-center justify-between text-xs text-muted">
                      <span>Collect {stampTarget} stamps to unlock your reward!</span>
                      <span className="font-bold text-foreground">
                        {progress}/{stampTarget}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
