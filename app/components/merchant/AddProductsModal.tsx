"use client";

import { useState } from "react";
import { X, Plus, Minus, Package, Gift, Star } from "lucide-react";
import { Product } from "@/services/merchant.service";
import { toast } from "@/hooks/use-toast";

interface AddProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (products: Array<{ productId: string; productName: string; unitPrice: number; quantity: number }>) => void;
  availableProducts: Product[];
  isLoading?: boolean;
}

export function AddProductsModal({
  isOpen,
  onClose,
  onSubmit,
  availableProducts,
  isLoading = false,
}: AddProductsModalProps) {
  const [selectedProducts, setSelectedProducts] = useState<
    Array<{ productId: string; productName: string; unitPrice: number; quantity: number }>
  >([]);

  const handleAddProduct = (product: Product) => {
    const existing = selectedProducts.find((p) => p.productId === product._id);
    if (existing) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.productId === product._id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          productId: product._id,
          productName: product.name,
          unitPrice: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.productId !== productId)
    );
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productId === productId ? { ...p, quantity } : p
      )
    );
  };

  const handleSubmit = () => {
    if (selectedProducts.length === 0) {
      toast.info("No Products", "Please select at least one product");
      return;
    }
    onSubmit(selectedProducts);
  };

  const totalAmount = selectedProducts.reduce(
    (sum, p) => sum + p.unitPrice * p.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg border border-border-subtle w-full max-w-md max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-muted flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-brand" />
            </div>
            <h2 className="font-bold text-foreground text-sm">Add Products to Request</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground p-1 hover:bg-surface-card rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Available Products */}
          <div className="p-4 border-b border-border-subtle">
            <p className="text-xs font-semibold text-foreground mb-2">
              Available Products
            </p>
            <div className="space-y-2">
              {availableProducts.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted">
                  <Package className="w-5 h-5 mx-auto mb-1 opacity-50" />
                  No products available
                </div>
              ) : (
                availableProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-2 rounded-md bg-surface-card border border-border-subtle hover:border-brand/40 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-muted">
                        ${product.price.toFixed(2)} •{" "}
                        {product.type === "points" ? (
                          <span className="flex items-center gap-0.5 inline-flex">
                            <Star className="w-2.5 h-2.5" />
                            {product.pointsValue} pts
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 inline-flex">
                            <Gift className="w-2.5 h-2.5" />
                            {product.stampsValue} stamps
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddProduct(product)}
                      className="ml-2 flex items-center justify-center w-7 h-7 rounded-md bg-brand text-brand-foreground hover:opacity-90 transition-colors flex-shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <div className="p-4">
              <p className="text-xs font-semibold text-foreground mb-2">
                Selected ({selectedProducts.length})
              </p>
              <div className="space-y-2">
                {selectedProducts.map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between p-2 rounded-md bg-brand-muted border border-brand/20"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {product.productName}
                      </p>
                      <p className="text-[10px] text-muted">
                        ${product.unitPrice.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() =>
                          handleQuantityChange(product.productId, product.quantity - 1)
                        }
                        className="p-1 rounded-md hover:bg-brand transition-colors"
                      >
                        <Minus className="w-3 h-3 text-foreground" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-foreground">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(product.productId, product.quantity + 1)
                        }
                        className="p-1 rounded-md hover:bg-brand transition-colors"
                      >
                        <Plus className="w-3 h-3 text-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-subtle px-4 py-3 space-y-3">
          {selectedProducts.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-muted">Total Amount</p>
              <p className="text-xl font-bold text-brand">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 rounded-md bg-surface border border-border-subtle text-foreground text-xs font-bold hover:bg-surface-card transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || selectedProducts.length === 0}
              className="flex-1 px-3 py-2 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add Products"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
