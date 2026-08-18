"use client";

import { useState } from "react";
import { X, Plus, Edit2, Trash2, Package, Star, Gift } from "lucide-react";
import { Product } from "@/services/merchant.service";
import { toast } from "@/hooks/use-toast";

interface ProductManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAdd: (product: Omit<Product, "_id">) => void;
  onUpdate: (id: string, product: Partial<Product>) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function ProductManagementModal({
  isOpen,
  onClose,
  products,
  onAdd,
  onUpdate,
  onDelete,
  isLoading = false,
}: ProductManagementModalProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "_id">>({
    name: "",
    price: 0,
    type: "points",
    pointsValue: 0,
    stampsValue: 0,
    description: "",
  });

  const handleOpenForm = (product?: Product) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        name: product.name,
        price: product.price,
        type: product.type,
        pointsValue: product.pointsValue || 0,
        stampsValue: product.stampsValue || 0,
        description: product.description || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        price: 0,
        type: "points",
        pointsValue: 0,
        stampsValue: 0,
        description: "",
      });
    }
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.info("Required", "Product name is required");
      return;
    }

    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }

    setShowForm(false);
    setFormData({
      name: "",
      price: 0,
      type: "points",
      pointsValue: 0,
      stampsValue: 0,
      description: "",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      onDelete(id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg border border-border-subtle w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-muted flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-brand" />
            </div>
            <h2 className="font-bold text-foreground text-sm">Manage Products</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground p-1 hover:bg-surface-card rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {showForm ? (
            // Form
            <div className="space-y-4 pb-4">
              <h3 className="font-bold text-foreground text-sm">
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>

              <div className="space-y-3">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Espresso Coffee"
                    className="w-full px-3 py-2 rounded-md bg-surface-card border border-border-subtle text-foreground text-sm placeholder-muted focus:outline-none focus:border-brand/40"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-md bg-surface-card border border-border-subtle text-foreground text-sm placeholder-muted focus:outline-none focus:border-brand/40"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Reward Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "points" | "stamps",
                      })
                    }
                    className="w-full px-3 py-2 rounded-md bg-surface-card border border-border-subtle text-foreground text-sm focus:outline-none focus:border-brand/40"
                  >
                    <option value="points">Points</option>
                    <option value="stamps">Stamps</option>
                  </select>
                </div>

                {/* Reward Value */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    {formData.type === "points" ? "Points Value" : "Stamps Value"} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={
                      formData.type === "points"
                        ? formData.pointsValue
                        : formData.stampsValue
                    }
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      if (formData.type === "points") {
                        setFormData({ ...formData, pointsValue: value });
                      } else {
                        setFormData({ ...formData, stampsValue: value });
                      }
                    }}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-md bg-surface-card border border-border-subtle text-foreground text-sm placeholder-muted focus:outline-none focus:border-brand/40"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Product description..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-md bg-surface-card border border-border-subtle text-foreground text-sm placeholder-muted focus:outline-none focus:border-brand/40 resize-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-3 py-2 rounded-md bg-surface border border-border-subtle text-foreground text-xs font-bold hover:bg-surface-card transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : editingId ? "Update" : "Add Product"}
                </button>
              </div>
            </div>
          ) : (
            // Products List
            <div className="space-y-2">
              {products.length === 0 ? (
                <div className="py-8 text-center text-muted text-xs">
                  <Package className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p>No products yet</p>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="p-3 rounded-md bg-surface-card border border-border-subtle hover:border-brand/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-xs">
                          {product.name}
                        </p>
                        {product.description && (
                          <p className="text-[10px] text-muted mt-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleOpenForm(product)}
                          className="p-1 rounded-md hover:bg-surface transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-1 rounded-md hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-foreground">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1">
                        {product.type === "points" ? (
                          <>
                            <Star className="w-3 h-3 text-brand" />
                            <span className="text-foreground font-medium">
                              {product.pointsValue} pts
                            </span>
                          </>
                        ) : (
                          <>
                            <Gift className="w-3 h-3 text-brand" />
                            <span className="text-foreground font-medium">
                              {product.stampsValue} stamps
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-subtle px-4 py-3 flex gap-2">
          {!showForm && (
            <button
              onClick={() => handleOpenForm()}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-md bg-surface border border-border-subtle text-foreground text-xs font-bold hover:bg-surface-card transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
