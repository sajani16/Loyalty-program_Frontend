"use client";

import { useState, useEffect } from "react";
import {
  Coins,
  Stamp,
  Check,
  Plus,
  Trash2,
  Tag,
  AlertCircle,
} from "lucide-react";
import { LoyaltyRequestItem, Product } from "@/services/merchant.service";
import { toast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
    stamps: number;
  }>;
}

interface StampProductLine {
  productId: string;
  stamps: number;
}

interface ProcessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LoyaltyRequestItem | null;
  onComplete: (payload: CompletePayload) => void;
  isLoading?: boolean;
  stampProducts?: Product[];
}

export function ProcessRequestModal({
  isOpen,
  onClose,
  request,
  onComplete,
  isLoading = false,
  stampProducts = [],
}: ProcessRequestModalProps) {
  const [rewardType, setRewardType] = useState<RewardType>("point");
  const [amountSpent, setAmountSpent] = useState<number>(0);
  const [stampLines, setStampLines] = useState<StampProductLine[]>([
    { productId: "", stamps: 1 },
  ]);

  useEffect(() => {
    if (isOpen) {
      setRewardType("point");
      setAmountSpent(0);
      setStampLines([{ productId: "", stamps: 1 }]);
    }
  }, [isOpen, request]);

  if (!request) return null;

  const customerName =
    request.businessCustomerId?.customerId?.name || "Customer";

  const addStampLine = () => {
    setStampLines((prev) => [...prev, { productId: "", stamps: 1 }]);
  };

  const removeStampLine = (idx: number) => {
    setStampLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateStampLine = (
    idx: number,
    field: keyof StampProductLine,
    value: string | number,
  ) => {
    setStampLines((prev) =>
      prev.map((line, i) => (i === idx ? { ...line, [field]: value } : line)),
    );
  };

  const validStampLines = stampLines.filter((l) => l.productId && l.stamps > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rewardType === "point" && amountSpent <= 0) {
      toast.info("Enter amount", "Please enter total purchase amount.");
      return;
    }

    if (rewardType === "stamp" && validStampLines.length === 0) {
      toast.info("Select product", "Please choose at least one product.");
      return;
    }

    onComplete({
      type: rewardType,
      amountSpent:
        rewardType === "point" && amountSpent > 0 ? amountSpent : undefined,
      products:
        rewardType === "stamp"
          ? validStampLines.map(({ productId, stamps }) => ({
              productId,
              stamps,
            }))
          : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-[95vw] p-0 overflow-hidden rounded-xl border border-border-subtle bg-surface-card font-sora shadow-lg">
        {/* Simple Header */}
        <DialogHeader className="px-5 py-4 border-b border-border-subtle bg-surface">
          <DialogTitle className="text-base font-semibold text-foreground">
            Approve Request
          </DialogTitle>
          <p className="text-xs text-muted">
            Customer:{" "}
            <strong className="text-foreground">{customerName}</strong>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Purchased Items List (if available) */}
          {request.products && request.products.length > 0 && (
            <div className="p-3 bg-surface rounded-lg border border-border-subtle text-xs space-y-2">
              <div className="flex items-center justify-between text-muted">
                <span className="font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Tag className="w-3 h-3 text-brand" /> Items Claimed
                </span>
                <span className="text-[10px]">
                  {request.products.length}{" "}
                  {request.products.length === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="space-y-1.5 pt-0.5">
                {request.products.map((product, idx) => {
                  const productDetails =
                    typeof product.productId === "object"
                      ? product.productId
                      : null;
                  const productName = productDetails?.name || "Item";
                  const targetStamps = productDetails?.stampTarget;

                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-foreground font-medium bg-background/50 px-2.5 py-1.5 rounded border border-border-subtle/40"
                    >
                      <div className="flex items-center gap-2">
                        <span>{productName}</span>
                        {targetStamps && (
                          <span className="text-[10px] font-normal text-muted bg-surface px-1.5 py-0.5 rounded border border-border-subtle">
                            Target: {targetStamps} stamps
                          </span>
                        )}
                      </div>
                      <span className="text-brand-dark dark:text-brand font-semibold text-xs">
                        +{product.stamps} stamps
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reward Type Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Reward Type
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRewardType("point")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  rewardType === "point"
                    ? "border-brand bg-brand-muted text-brand-dark dark:text-brand font-semibold"
                    : "border-border-subtle bg-background text-muted hover:text-foreground"
                }`}
              >
                <Coins className="w-4 h-4" /> Points
              </button>
              <button
                type="button"
                onClick={() => setRewardType("stamp")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  rewardType === "stamp"
                    ? "border-brand bg-brand-muted text-brand-dark dark:text-brand font-semibold"
                    : "border-border-subtle bg-background text-muted hover:text-foreground"
                }`}
              >
                <Stamp className="w-4 h-4" /> Stamps
              </button>
            </div>
          </div>

          {/* Points Form */}
          {rewardType === "point" && (
            <div className="space-y-1.5">
              <Label
                htmlFor="amountSpent"
                className="text-xs font-semibold text-foreground"
              >
                Total Bill Amount ($)
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
                placeholder="0.00"
                className="h-10 text-sm border-border-subtle bg-background focus-visible:ring-brand"
              />
              <p className="text-[11px] text-muted">
                Points will be awarded automatically based on the transaction
                amount.
              </p>
            </div>
          )}

          {/* Stamps Form */}
          {rewardType === "stamp" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-foreground">
                  Add Stamps
                </Label>
                <span className="text-[10px] text-muted">Qty to add</span>
              </div>

              {stampProducts.length === 0 ? (
                <div className="p-3 border border-dashed border-border-subtle rounded-lg text-center text-xs text-muted flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" /> No stamp-eligible products
                  found.
                </div>
              ) : (
                <div className="space-y-2">
                  {stampLines.map((line, idx) => {
                    const selectedProduct = stampProducts.find(
                      (p) => p._id === line.productId,
                    );

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Select
                              value={line.productId}
                              onValueChange={(val) =>
                                updateStampLine(idx, "productId", val)
                              }
                            >
                              <SelectTrigger className="h-9 text-xs border-border-subtle bg-background">
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent className="bg-surface-card border-border-subtle">
                                {stampProducts.map((p) => (
                                  <SelectItem
                                    key={p._id}
                                    value={p._id}
                                    className="text-xs"
                                  >
                                    <div className="flex items-center justify-between w-full gap-2">
                                      <span>{p.name}</span>
                                      {p.stampTarget && (
                                        <span className="text-[10px] text-muted">
                                          ({p.stampTarget} stamps req.)
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            type="number"
                            min="1"
                            value={line.stamps}
                            onChange={(e) =>
                              updateStampLine(
                                idx,
                                "stamps",
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="h-9 w-16 text-center text-xs border-border-subtle bg-background font-semibold"
                          />
                          {stampLines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStampLine(idx)}
                              className="p-1.5 text-muted hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Informative text below selected product */}
                        {/* {selectedProduct && selectedProduct.stampTarget && (
                          <div className="text-[11px] text-muted px-1 flex justify-between">
                            <span>
                              Target: <strong className="text-foreground">{selectedProduct.stampTarget} stamps required</strong>
                            </span>
                            <span className="text-brand-dark dark:text-brand font-medium">
                              Adding +{line.stamps}
                            </span>
                          </div>
                        )} */}
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={addStampLine}
                    className="flex items-center gap-1 text-xs font-medium text-brand-dark dark:text-brand hover:underline pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add product
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <DialogFooter className="pt-3 flex flex-row justify-end gap-2 border-t border-border-subtle">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="border-border-subtle bg-background text-foreground"
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
                  : validStampLines.length === 0)
              }
              className="bg-brand text-brand-foreground hover:bg-brand-dark font-medium gap-1.5"
            >
              <Check className="w-4 h-4" />{" "}
              {isLoading ? "Saving..." : "Confirm & Award"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
