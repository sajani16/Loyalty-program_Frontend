"use client";

import { useState, useEffect } from "react";
import { Gift, Star, Check } from "lucide-react";
import { LoyaltyRequestItem } from "@/services/merchant.service";
import { toast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type RewardType = "point" | "stamp";

export interface CompletePayload {
  type: RewardType;
  amountSpent?: number;
  products?: Array<{
    productId: string;
    quantity: number;
  }>;
}

interface ProcessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LoyaltyRequestItem | null;
  onComplete: (payload: CompletePayload) => void;
  isLoading?: boolean;
}

export function ProcessRequestModal({
  isOpen,
  onClose,
  request,
  onComplete,
  isLoading = false,
}: ProcessRequestModalProps) {
  const [rewardType, setRewardType] = useState<RewardType>("point");
  const [amountSpent, setAmountSpent] = useState<number>(0);

  // Reset state when modal opens/closes or request changes
  useEffect(() => {
    if (isOpen) {
      setRewardType("point");
      setAmountSpent(0);
    }
  }, [isOpen, request]);

  if (!request) return null;

  const customerName =
    request.businessCustomerId?.customerId?.name || "Customer";

  const handleTypeChange = (type: RewardType) => {
    setRewardType(type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rewardType === "point" && amountSpent <= 0) {
      toast.info(
        "Amount Required",
        "Enter the purchase amount to calculate points.",
      );
      return;
    }

    if (rewardType === "stamp" && request.products.length === 0) {
      toast.info(
        "Products Required",
        "Add at least one purchased product before awarding stamps.",
      );
      return;
    }

    onComplete({
      type: rewardType,
      amountSpent: amountSpent > 0 ? amountSpent : undefined,
      products:
        rewardType === "stamp"
          ? request.products.map(({ productId, quantity }) => ({
              productId,
              quantity,
            }))
          : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-[95vw] p-0 gap-0 overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground leading-tight">
                Award Loyalty
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {customerName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Purchased Products Summary */}
          {request.products && request.products.length > 0 && (
            <div className="p-3 bg-muted/40 rounded-lg border border-border/60 space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider text-[11px]">
                Products Purchased
              </p>
              <div className="space-y-1.5 divide-y divide-border/40">
                {request.products.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs pt-1.5 first:pt-0"
                  >
                    <span className="font-medium text-foreground truncate max-w-[200px]">
                      {product.productName}
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {product.quantity}x @ ${product.unitPrice}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reward Type Dropdown */}
          <div className="space-y-1.5">
            <Label htmlFor="rewardType" className="text-xs font-medium">
              Loyalty Type
            </Label>
            <Select
              value={rewardType}
              onValueChange={(val: RewardType) => handleTypeChange(val)}
            >
              <SelectTrigger id="rewardType" className="h-9 text-sm">
                <SelectValue placeholder="Select reward type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="point">
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                    <span>Points</span>
                  </div>
                </SelectItem>
                <SelectItem value="stamp">
                  <div className="flex items-center gap-2">
                    <Gift className="w-3.5 h-3.5 text-primary" />
                    <span>Stamps</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Input based on Selected Reward Type */}
          {rewardType === "point" ? (
            <div className="space-y-1.5 animate-in fade-in-50 duration-150">
              <Label
                htmlFor="amountSpent"
                className="flex items-center gap-1.5 text-xs font-medium"
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                Purchase Amount ($)
              </Label>
              <Input
                id="amountSpent"
                type="number"
                min="0.01"
                step="0.01"
                value={amountSpent || ""}
                onChange={(e) =>
                  setAmountSpent(parseFloat(e.target.value) || 0)
                }
                placeholder="Enter purchase amount"
                className="h-9 text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Points are calculated automatically from this amount.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 animate-in fade-in-50 duration-150">
              <Label
                htmlFor="stampProducts"
                className="flex items-center gap-1.5 text-xs font-medium"
              >
                <Gift className="w-3.5 h-3.5 text-primary" />
                Products for Stamp Progress
              </Label>
              <div
                id="stampProducts"
                className="rounded-md border bg-muted/30 px-3 py-2 text-sm"
              >
                {request.products.length > 0
                  ? `${request.products.length} purchased product${request.products.length === 1 ? "" : "s"} selected`
                  : "No purchased products added"}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Stamps are calculated from stamp-eligible purchased products.
              </p>
            </div>
          )}

          {/* Award Summary Card */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/15 space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Summary
            </span>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-semibold capitalize text-foreground">
                  {rewardType === "point" ? "Points" : "Stamps"}
                </span>
              </div>
              {rewardType === "stamp" && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Products:</span>
                  <span className="font-bold text-primary">
                    {request.products.length} selected
                  </span>
                </div>
              )}
              {amountSpent > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount Spent:</span>
                  <span className="font-semibold text-foreground">
                    ${amountSpent.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-2 flex-row gap-2 justify-end sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={
                isLoading ||
                (rewardType === "point"
                  ? amountSpent <= 0
                  : request.products.length === 0)
              }
              className="flex-1 sm:flex-none gap-1.5"
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" /> Complete Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
