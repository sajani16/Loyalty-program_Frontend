"use client";

import { X, Star, Gift, TrendingUp, Calendar, Shield, Award } from "lucide-react";
import { CustomerMembership } from "@/services/customer.service";

interface MembershipDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  membership: CustomerMembership | null;
}

export function MembershipDetailsModal({
  isOpen,
  onClose,
  membership,
}: MembershipDetailsModalProps) {
  if (!isOpen || !membership) return null;

  const businessName = membership.businessId?.name || "Business";
  const tierColors: Record<string, string> = {
    basic: "bg-slate-500/20 text-slate-700 border-slate-300",
    silver: "bg-slate-400/20 text-slate-700 border-slate-300",
    gold: "bg-yellow-500/20 text-yellow-700 border-yellow-300",
    platinum: "bg-purple-500/20 text-purple-700 border-purple-300",
  };

  const tierColor = tierColors[membership.tier] || tierColors.basic;

  const pointsToNextTier = {
    basic: 500,
    silver: 1000,
    gold: 2000,
    platinum: 5000,
  };

  const nextTierThreshold = pointsToNextTier[membership.tier as keyof typeof pointsToNextTier] || 500;
  const progressPercentage = Math.min((membership.points / nextTierThreshold) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg border border-border-subtle w-full max-w-md shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between bg-brand-muted">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-brand text-brand-foreground font-bold text-xs flex items-center justify-center">
              {businessName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm">{businessName}</h2>
              <p className="text-[10px] text-muted">Membership Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground p-1 hover:bg-surface-card rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Status</span>
            <span className={`text-[10px] px-3 py-1 rounded-full font-bold border capitalize ${tierColor}`}>
              {membership.status}
            </span>
          </div>

          {/* Tier Display */}
          <div className="p-3 bg-surface-card rounded-md border border-border-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-brand" />
                Current Tier
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-md font-bold border ${tierColor}`}>
                {membership.tier?.toUpperCase() || "BASIC"}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-muted">Progress</span>
                <span className="text-[10px] font-semibold text-foreground">
                  {membership.points} / {nextTierThreshold}
                </span>
              </div>
              <div className="h-2 bg-surface rounded-full overflow-hidden border border-border-subtle">
                <div
                  className="h-full bg-brand transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Points & Stamps */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-surface-card rounded-md border border-border-subtle">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-3.5 h-3.5 text-brand" />
                <span className="text-[10px] text-muted font-semibold">Points</span>
              </div>
              <p className="text-xl font-bold text-foreground">{membership.points}</p>
            </div>

            <div className="p-3 bg-surface-card rounded-md border border-border-subtle">
              <div className="flex items-center gap-2 mb-1">
                <Gift className="w-3.5 h-3.5 text-brand" />
                <span className="text-[10px] text-muted font-semibold">Stamps</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                {membership.stampCards?.reduce((sum, card) => sum + card.completedCards, 0) || 0}
              </p>
            </div>
          </div>

          {/* Joined Date */}
          <div className="flex items-center gap-2 p-3 bg-surface-card rounded-md border border-border-subtle">
            <Calendar className="w-3.5 h-3.5 text-brand flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted">Joined</p>
              <p className="text-xs font-semibold text-foreground">
                {new Date(membership.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stamp Cards */}
          {membership.stampCards && membership.stampCards.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-brand" />
                Stamp Cards
              </h3>
              {membership.stampCards.map((card, idx) => (
                <div key={idx} className="p-2.5 bg-surface-card rounded-md border border-border-subtle">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-muted">Card {idx + 1}</span>
                    <span className="text-[10px] font-bold text-foreground">
                      {card.completedCards} completed
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < card.completedCards
                            ? "bg-brand"
                            : "bg-border-subtle"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Benefits Info */}
          <div className="p-3 bg-brand-muted rounded-md border border-brand/20">
            <p className="text-[10px] text-muted">
              <span className="font-semibold text-foreground">Loyalty Perks:</span> Earn
              points with every purchase, unlock higher tiers for exclusive rewards.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border-subtle px-4 py-3">
          <button
            onClick={onClose}
            className="w-full px-3 py-2 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
