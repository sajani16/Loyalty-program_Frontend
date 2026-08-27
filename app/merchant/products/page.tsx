"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Star,
  Gift,
  Loader2,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  useBusinessProfile,
  useBusinessProducts,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleProductMutation,
} from "../api";
import { Product } from "@/services/merchant.service";

const emptyForm = (): Omit<Product, "_id"> => ({
  name: "",
  price: 0,
  type: "stamps",
  pointsValue: 0,
  stampsValue: 1,
  stampsRequired: 10,
  description: "",
  isActive: true,
});

function ProductFormModal({
  initial,
  onSave,
  onClose,
  isLoading,
}: {
  initial?: Product;
  onSave: (data: any) => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<Omit<Product, "_id"> & { type?: "stamps" | "points"; stampsRequired?: number }>(
    initial
      ? {
          name: initial.name,
          price: initial.price,
          type: initial.stampEligible ? "stamps" : "points",
          pointsValue: initial.pointsValue ?? 0,
          stampsValue: initial.stampsValue ?? 1,
          stampsRequired: initial.stampTarget ?? 10,
          description: initial.description ?? "",
          isActive: initial.isActive ?? true,
        }
      : emptyForm(),
  );

  const set = (key: string, val: unknown) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.info("Required", "Product name is required.");
      return;
    }

    const isStamps = form.type === "stamps";
    const payload = {
      name: form.name,
      price: form.price,
      stampEligible: isStamps,
      stampTarget: isStamps ? (form.stampsRequired ?? 10) : undefined,
      rewardQuantity: isStamps ? 1 : undefined,
      isActive: form.isActive,
      description: form.description,
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-border-subtle bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-bold text-foreground">
              {initial ? "Edit Product" : "Add Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted hover:text-foreground hover:bg-surface-card transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g., Espresso Coffee"
              className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface-card text-foreground text-sm placeholder-muted focus:outline-none focus:border-brand/50"
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
              value={form.price || ""}
              onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface-card text-foreground text-sm placeholder-muted focus:outline-none focus:border-brand/50"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Reward Type *
            </label>
            <div className="flex gap-2">
              {(["stamps", "points"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("type", t)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-bold transition-colors ${
                    form.type === t
                      ? t === "stamps"
                        ? "bg-brand/10 text-brand border-brand/30"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                      : "bg-surface-card text-muted border-border-subtle hover:border-brand/20"
                  }`}
                >
                  {t === "stamps" ? (
                    <Gift className="w-3.5 h-3.5" />
                  ) : (
                    <Star className="w-3.5 h-3.5" />
                  )}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional reward fields */}
          {form.type === "stamps" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Stamps per Purchase
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.stampsValue || ""}
                  onChange={(e) =>
                    set("stampsValue", parseInt(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface-card text-foreground text-sm focus:outline-none focus:border-brand/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Stamps for Free Reward
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.stampsRequired || ""}
                  onChange={(e) =>
                    set("stampsRequired", parseInt(e.target.value) || 10)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface-card text-foreground text-sm focus:outline-none focus:border-brand/50"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Points per Purchase
              </label>
              <input
                type="number"
                min="0"
                value={form.pointsValue || ""}
                onChange={(e) =>
                  set("pointsValue", parseInt(e.target.value) || 0)
                }
                placeholder="e.g., 10"
                className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface-card text-foreground text-sm placeholder-muted focus:outline-none focus:border-brand/50"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Description (optional)
            </label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short product description…"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface-card text-foreground text-sm placeholder-muted focus:outline-none focus:border-brand/50 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-border-subtle text-xs font-bold text-foreground hover:bg-surface-card transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 rounded-lg bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Saving…" : initial ? "Update" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MerchantProductsPage() {
  const { data: session } = useSession();
  const { data: businessProfile } = useBusinessProfile();
  const { data: productsData, isLoading } = useBusinessProducts();

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();
  const toggleMutation = useToggleProductMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const businessName =
    businessProfile?.name || session?.user?.name || "Merchant";
  const products = (productsData ?? []) as Product[];

  const stampProducts = products.filter((p) => p.stampEligible);
  const pointsProducts = products.filter((p) => !p.stampEligible);

  const handleSignOut = () => {
    toast.success("Signed out", "You have been logged out safely.");
    void signOut({ callbackUrl: "/" });
  };

  const handleAdd = (data: Omit<Product, "_id">) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Product Added", "New product created successfully.");
        setShowForm(false);
      },
      onError: (err) =>
        toast.error("Failed", err instanceof Error ? err.message : "Could not add product."),
    });
  };

  const handleUpdate = (data: Partial<Product>) => {
    if (!editingProduct) return;
    updateMutation.mutate(
      { id: editingProduct._id, data },
      {
        onSuccess: () => {
          toast.success("Product Updated", "Changes saved.");
          setEditingProduct(undefined);
          setShowForm(false);
        },
        onError: (err) =>
          toast.error("Failed", err instanceof Error ? err.message : "Could not update."),
      },
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.info("Deleted", "Product removed."),
      onError: (err) =>
        toast.error("Failed", err instanceof Error ? err.message : "Could not delete."),
    });
  };

  const handleToggle = (id: string, currentActive: boolean) => {
    toggleMutation.mutate(
      { id, isActive: !currentActive },
      {
        onSuccess: () =>
          toast.info(
            !currentActive ? "Activated" : "Deactivated",
            `Product is now ${!currentActive ? "active" : "inactive"}.`,
          ),
        onError: (err) =>
          toast.error("Failed", err instanceof Error ? err.message : "Could not toggle."),
      },
    );
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <DashboardLayout
      userType="merchant"
      onSignOut={handleSignOut}
      businessName={businessName}
      headerTitle="Products"
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <p className="text-sm text-muted">
              Manage stamp-eligible and points-based products
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total Products", value: products.length, icon: Package, color: "text-brand" },
            { label: "Stamp Products", value: stampProducts.length, icon: Gift, color: "text-brand" },
            { label: "Points Products", value: pointsProducts.length, icon: Star, color: "text-amber-500" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border-subtle bg-surface-card px-4 py-3 flex items-center gap-3"
            >
              <s.icon className={`w-5 h-5 shrink-0 ${s.color}`} />
              <div>
                <p className="text-xl font-bold text-foreground leading-none">{s.value}</p>
                <p className="text-[10px] text-muted font-medium mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Product list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
            <h2 className="text-lg font-bold text-foreground mb-2">
              No Products Yet
            </h2>
            <p className="text-sm text-muted mb-4">
              Add your first product to start awarding stamps or points.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-brand-foreground text-xs font-bold hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => {
              const isStamp = product.stampEligible;
              return (
                <div
                  key={product._id}
                  className={`rounded-xl border bg-surface-card transition-all ${
                    product.isActive === false
                      ? "border-border-subtle opacity-60"
                      : "border-border-subtle hover:border-brand/30 hover:shadow-sm"
                  }`}
                >
                  {/* Card header */}
                  <div className="p-4 border-b border-border-subtle/50 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isStamp
                            ? "bg-brand/10 text-brand"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {isStamp ? (
                          <Gift className="w-4 h-4" />
                        ) : (
                          <Star className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">
                          {product.name}
                        </p>
                        {product.description && (
                          <p className="text-[10px] text-muted truncate mt-0.5">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full border capitalize ${
                        isStamp
                          ? "bg-brand/10 text-brand border-brand/20"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      }`}
                    >
                      {isStamp ? "stamps" : "points"}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Price</span>
                      <span className="font-bold font-mono text-foreground">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    {isStamp ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-muted">Stamps / purchase</span>
                          <span className="font-bold text-brand">
                            {product.stampsValue ?? 1}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted">Stamps for reward</span>
                          <span className="font-bold text-foreground">
                            {product.stampTarget ?? 10}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-muted">Loyalty Type</span>
                        <span className="font-bold text-amber-600">
                          Points eligible
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card actions */}
                  <div className="px-4 pb-4 flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(product._id, product.isActive ?? true)}
                      className="flex items-center gap-1 text-[10px] font-semibold text-muted hover:text-foreground transition-colors"
                      title={product.isActive !== false ? "Deactivate" : "Activate"}
                    >
                      {product.isActive !== false ? (
                        <ToggleRight className="w-4 h-4 text-brand" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                      {product.isActive !== false ? "Active" : "Inactive"}
                    </button>

                    <div className="ml-auto flex items-center gap-1">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 rounded-md hover:bg-surface transition-colors text-muted hover:text-foreground"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 transition-colors text-muted hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <ProductFormModal
          initial={editingProduct}
          onSave={editingProduct ? handleUpdate : handleAdd}
          onClose={closeForm}
          isLoading={isMutating}
        />
      )}
    </DashboardLayout>
  );
}
