"use client";

import { useState } from "react";
import { X, Gift, Star } from "lucide-react";
import { LoyaltyRequestItem } from "@/services/merchant.service";
import { toast } from "@/hooks/use-toast";

interface ProcessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LoyaltyRequestItem | null;
  onComplete: (payload: { pointsAwarded?: number; stampsAwarded?: number; amountSpent?: number }) => void;
  isLoading?: boolean;
}

export function ProcessRequestModal({
  isOpen,
  onClose,
  request,
  onComplete,
  isLoading = false,
}: ProcessRequestModalProps) {
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [stampsAwarded, setStampsAwarded] = useState(0);
  const [amountSpent, setAmountSpent] = useState(0);

  const handleSubmit = () => {
    if (pointsAwarded === 0 && stampsAwarded === 0) {
      toast.info("No Rewards", "Please assign at least points or stamps");
      return;
    }

    onComplete({
      pointsAwarded: pointsAwarded || undefined,
      stampsAwarded: stampsAwarded || undefined,
      amountSpent: amountSpent || undefined,
    });

    setPointsAwarded(0);
    setStampsAwarded(0);
    setAmountSpent(0);
  };

  if (!isOpen || !request) return null;

  const customerName =
    request.businessCustomerId?.customerId?.name || "Customer";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg border border-border-subtle w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-muted flex items-center justify-center">
              <Gift className="w-3.5 h-3.5 text-brand" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm">Award Loyalty</h2>
              <p className="text-[10px] text-muted">{customerName}</p>
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
        <div className="p-4 space-y-4">
          {/* Products Summary */}
          {request.products && request.products.length > 0 && (
            <div className="p-3 bg-surface-card rounded-md border border-border-subtle">
              <p className="text-xs font-semibold text-foreground mb-2">
                Products Purchased
              </p>
              <div className="space-y-1">
                {request.products.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-foreground">{product.productName}</span>
                    <span className="text-muted">
                      {product.quantity}x @ ${product.unitPrice}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amount Spent */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Amount Spent ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amountSpent || ""}
              onChange={(e) => setAmountSpent(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full px-3 py-2 rounded-md bg-surface-card border border-border-subtle text-foreground text-sm placeholder-muted focus:outline-none focus:border-brand/40"
            />
          </div>

          {/* Points Award */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
              <Star className="w-3.5 h-3.5 text-brand" />
              Points to Award
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={pointsAwarded || ""}
              onChange={(e) => setPointsAwarded(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-md bg-surface-card border border-border-subtle text-foreground text-sm placeholder-muted focus:outline-none focus:border-brand/40"
            />
            <p className="text-[10px] text-muted mt-1">
              Based on purchase amount and items
            </p>
          </div>

          {/* Stamps Award */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
              <Gift className="w-3.5 h-3.5 text-brand" />
              Stamps to Award
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={stampsAwarded || ""}
              onChange={(e) => setStampsAwarded(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-md bg-surface-card border border-border-subtle text-foreground text-sm placeholder-muted focus:outline-none focus:border-brand/40"
            />
            <p className="text-[10px] text-muted mt-1">
              Stamp card progress or completion
            </p>
          </div>

          {/* Summary */}
          <div className="p-3 bg-brand-muted rounded-md border border-brand/20">
            <p className="text-xs text-muted mb-2">Award Summary</p>
            <div className="space-y-1">
              {pointsAwarded > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground">Points</span>
                  <span className="font-bold text-brand">{pointsAwarded}</span>
                </div>
              )}
              {stampsAwarded > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground">Stamps</span>
                  <span className="font-bold text-brand">{stampsAwarded}</span>
                </div>
              )}
              {amountSpent > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground">Amount</span>
                  <span className="font-bold text-brand">${amountSpent.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-border-subtle px-4 py-3 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-md bg-surface border border-border-subtle text-foreground text-xs font-bold hover:bg-surface-card transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || (pointsAwarded === 0 && stampsAwarded === 0)}
            className="flex-1 px-3 py-2 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Complete Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
