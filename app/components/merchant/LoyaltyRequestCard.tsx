"use client";

import { useState } from "react";
import {
  Check,
  Ban,
  ChevronDown,
  ChevronUp,
  Gift,
  Star,
  Package,
} from "lucide-react";
import { LoyaltyRequestItem } from "@/services/merchant.service";
import { toast } from "@/hooks/use-toast";

interface LoyaltyRequestCardProps {
  request: LoyaltyRequestItem;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onAddProducts?: (id: string) => void;
  isLoading?: boolean;
}

export function LoyaltyRequestCard({
  request,
  onApprove,
  onReject,
  onAddProducts,
  isLoading = false,
}: LoyaltyRequestCardProps) {
  const [expanded, setExpanded] = useState(false);

  const customerName =
    request.businessCustomerId?.customerId?.name || "Customer";
  const customerEmail =
    request.businessCustomerId?.customerId?.email || "email@example.com";

  const handleApprove = () => {
    if (onApprove) {
      onApprove(request._id);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(request._id);
    }
  };

  const handleAddProducts = () => {
    if (onAddProducts) {
      onAddProducts(request._id);
    } else {
      toast.info("Add Products", "Product assignment feature opening...");
    }
  };

  return (
    <div className="bg-surface-card rounded-md border border-border-subtle overflow-hidden hover:border-brand/40 transition-all">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 hover:bg-surface cursor-pointer transition-colors">
        <div className="w-9 h-9 rounded-md bg-brand text-brand-foreground font-bold text-xs flex items-center justify-center flex-shrink-0">
          {customerName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-xs">
            {customerName}
          </p>
          <p className="text-[10px] text-muted truncate">{customerEmail}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] px-2 py-1 rounded-md bg-brand-muted text-brand font-semibold border border-brand/20">
            {request.status}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted hover:text-foreground transition-colors p-1"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <>
          <div className="border-t border-border-subtle px-4 py-3 space-y-3">
            {/* Products Added */}
            {request.products && request.products.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-brand" />
                  Products ({request.products.length})
                </p>
                <div className="space-y-1.5">
                  {request.products.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-2.5 py-1.5 bg-surface rounded-md text-xs"
                    >
                      <span className="text-foreground font-medium">
                        {typeof product.productId === "object"
                          ? product.productId.name
                          : "Item"}
                      </span>
                      <span className="text-muted">
                        {product.stamps} stamp{product.stamps === 1 ? "" : "s"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards */}
            <div className="grid grid-cols-2 gap-2">
              {request.pointsAwarded !== undefined && (
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-surface rounded-md">
                  <Star className="w-3.5 h-3.5 text-brand" />
                  <div>
                    <p className="text-[10px] text-muted">Points</p>
                    <p className="font-bold text-foreground text-xs">
                      {request.pointsAwarded}
                    </p>
                  </div>
                </div>
              )}
              {request.stampsAwarded !== undefined && (
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-surface rounded-md">
                  <Gift className="w-3.5 h-3.5 text-brand" />
                  <div>
                    <p className="text-[10px] text-muted">Stamps</p>
                    <p className="font-bold text-foreground text-xs">
                      {request.stampsAwarded}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Time Info */}
            <div className="text-[10px] text-muted space-y-1 px-2.5 py-1.5 bg-surface rounded-md">
              <p>
                <span className="font-semibold text-foreground">
                  Requested:
                </span>{" "}
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold text-foreground">Expires:</span>{" "}
                {new Date(request.expiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-border-subtle px-4 py-3 flex gap-2">
            {!request.products || request.products.length === 0 ? (
              <button
                onClick={handleAddProducts}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md bg-brand-muted text-brand text-xs font-bold hover:bg-brand/10 transition-colors disabled:opacity-50"
              >
                <Package className="w-3.5 h-3.5" />
                Add Products
              </button>
            ) : null}

            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-colors disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              Approve
            </button>

            <button
              onClick={handleReject}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md bg-surface border border-border-subtle text-muted text-xs font-bold hover:text-foreground hover:border-red-300/50 transition-colors disabled:opacity-50"
            >
              <Ban className="w-3.5 h-3.5" />
              Reject
            </button>
          </div>
        </>
      )}
    </div>
  );
}
