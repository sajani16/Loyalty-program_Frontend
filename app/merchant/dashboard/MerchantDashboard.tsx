"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  QrCode,
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Settings,
  LogOut,
  TrendingUp,
  Star,
  ChevronRight,
  Menu,
  X,
  Bell,
  BadgeCheck,
  Store,
  Loader2,
  Plus,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  useBusinessProfile,
  useBusinessCustomers,
  usePendingRequests,
  useCompleteRequestMutation,
  useRejectRequestMutation,
  useBusinessProducts,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductsToRequestMutation,
} from "../api";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { QRCodeDisplay } from "@/components/merchant/QRCodeDisplay";
import { LoyaltyRequestCard } from "@/components/merchant/LoyaltyRequestCard";
import { AddProductsModal } from "@/components/merchant/AddProductsModal";
import { ProcessRequestModal } from "@/components/merchant/ProcessRequestModal";
import { ProductManagementModal } from "@/components/merchant/ProductManagementModal";
import { AddCustomerModal } from "@/components/merchant/AddCustomerModal";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Users, label: "Customers", id: "customers" },
  { icon: Package, label: "Products", id: "products" },
  { icon: ClipboardList, label: "Requests", id: "requests" },
  { icon: Settings, label: "Settings", id: "settings" },
];

export default function MerchantDashboard() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [showAddProducts, setShowAddProducts] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const { data: businessProfile } = useBusinessProfile();
  const { data: customersData } = useBusinessCustomers();
  const { data: pendingData, isLoading: pendingLoading } = usePendingRequests();
  const { data: productsData } = useBusinessProducts();

  const completeMutation = useCompleteRequestMutation();
  const rejectMutation = useRejectRequestMutation();
  const addProductsMutation = useAddProductsToRequestMutation();
  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();

  const businessName = businessProfile?.name || session?.user?.name || "Merchant";
  const customersList = customersData || [];
  const requestsList = pendingData || [];
  const productsList = productsData || [];
  const selectedRequest = requestsList.find((r) => r._id === selectedRequestId);

  const totalCustomersCount = customersList.length;
  const totalPointsAwarded = customersList.reduce((sum, c) => sum + (c.points || 0), 0);

  const handleApprove = (id: string) => {
    setSelectedRequestId(id);
    setShowProcessing(true);
  };

  const handleReject = (id: string) => {
    rejectMutation.mutate(id, {
      onSuccess: () => {
        toast.info("Request Declined", "Loyalty request was rejected.");
      },
      onError: (err) => {
        toast.error("Rejection Failed", err instanceof Error ? err.message : "Failed to reject request.");
      },
    });
  };

  const handleAddProducts = (id: string) => {
    setSelectedRequestId(id);
    setShowAddProducts(true);
  };

  const handleSubmitProducts = (products: any[]) => {
    if (selectedRequestId) {
      addProductsMutation.mutate({ id: selectedRequestId, products }, {
        onSuccess: () => {
          toast.success("Products Added", "Products added to request.");
          setShowAddProducts(false);
          setSelectedRequestId(null);
        },
        onError: (err) => {
          toast.error("Failed", err instanceof Error ? err.message : "Failed to add products.");
        },
      });
    }
  };

  const handleCompleteRequest = (payload: any) => {
    if (selectedRequestId) {
      completeMutation.mutate({ id: selectedRequestId, payload }, {
        onSuccess: () => {
          toast.success("Request Completed", "Loyalty request processed.");
          setShowProcessing(false);
          setSelectedRequestId(null);
        },
        onError: (err) => {
          toast.error("Failed", err instanceof Error ? err.message : "Failed to complete request.");
        },
      });
    }
  };

  const handleAddProduct = (product: any) => {
    createProductMutation.mutate(product, {
      onSuccess: () => {
        toast.success("Product Added", "Product created successfully.");
      },
      onError: (err) => {
        toast.error("Failed", err instanceof Error ? err.message : "Failed to add product.");
      },
    });
  };

  const handleUpdateProduct = (id: string, product: any) => {
    updateProductMutation.mutate({ id, data: product }, {
      onSuccess: () => {
        toast.success("Product Updated", "Product updated successfully.");
      },
      onError: (err) => {
        toast.error("Failed", err instanceof Error ? err.message : "Failed to update product.");
      },
    });
  };

  const handleDeleteProduct = (id: string) => {
    deleteProductMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Product Deleted", "Product removed successfully.");
      },
      onError: (err) => {
        toast.error("Failed", err instanceof Error ? err.message : "Failed to delete product.");
      },
    });
  };

  const handleAddCustomer = (email: string) => {
    toast.success("Invitation Sent", `Invitation sent to ${email}`);
    setShowAddCustomer(false);
  };

  const stats = [
    { label: "Total Customers", value: totalCustomersCount.toString(), icon: Users },
    { label: "Pending Requests", value: requestsList.length.toString(), icon: ClipboardList },
    { label: "Points Issued", value: totalPointsAwarded.toLocaleString(), icon: Star },
    { label: "Active Tier", value: "Verified", icon: BadgeCheck },
  ];

  const handleSignOut = () => {
    toast.success("Logged out", "Merchant session closed safely.");
    void signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-56 z-40 flex flex-col bg-surface border-r border-border-subtle transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-4 py-4 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center">
                <QrCode className="w-4 h-4 text-brand-foreground" />
              </div>
              <span className="text-foreground font-bold text-xs">Loyalty<span className="text-brand">Hub</span></span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted hover:text-foreground p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-md bg-surface-card border border-border-subtle">
            <div className="w-6 h-6 rounded-md bg-brand-muted border border-brand/30 flex items-center justify-center flex-shrink-0">
              <Store className="w-3.5 h-3.5 text-brand" />
            </div>
            <div className="min-w-0">
              <p className="text-foreground text-xs font-semibold truncate">{businessName}</p>
              <div className="flex items-center gap-1">
                <BadgeCheck className="w-3 h-3 text-brand" />
                <span className="text-brand text-[10px] font-medium">Verified</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
          <p className="text-muted text-[10px] uppercase tracking-widest font-semibold px-2 mb-2">Navigation</p>
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => { setActivePage(id); setSidebarOpen(false); }} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md mb-1 text-xs font-medium transition-all text-left ${activePage === id ? "bg-brand-muted text-brand border border-brand/40" : "text-muted hover:text-foreground hover:bg-surface-card"}`}>
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${activePage === id ? "text-brand" : ""}`} />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-2.5 py-3 border-t border-border-subtle">
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-muted hover:text-red-500 hover:bg-surface-card transition-all text-xs font-medium">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-border-subtle px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-8 h-8 rounded-md flex items-center justify-center text-muted hover:bg-surface-card hover:text-brand transition-colors border border-border-subtle">
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-xs font-bold text-foreground">Merchant Console</h1>
          </div>

          <div className="flex items-center gap-3">
            {requestsList.length > 0 && (
              <div className="relative">
                <Bell className="w-4 h-4 text-brand" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {requestsList.length > 9 ? "9+" : requestsList.length}
                </span>
              </div>
            )}
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-brand text-brand-foreground font-bold text-xs flex items-center justify-center">
                {businessName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-foreground leading-none">{businessName}</p>
                <p className="text-[10px] text-muted mt-0.5">Merchant</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 max-w-6xl mx-auto w-full">
          {activePage === "dashboard" && (
            <>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-foreground mb-0.5">Good day, {businessName.split(" ")[0]} 🏪</h2>
                <p className="text-xs text-muted">Real-time overview of your merchant loyalty program.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-surface-card rounded-md p-3.5 border border-border-subtle hover:border-brand/40 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-md bg-brand-muted border border-brand/30 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-brand" />
                      </div>
                      <TrendingUp className="w-3.5 h-3.5 text-brand" />
                    </div>
                    <p className="text-xl font-bold text-foreground mb-0.5">{value}</p>
                    <p className="text-xs text-muted">{label}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                <div className="space-y-4">
                  {businessProfile?._id && <QRCodeDisplay businessId={businessProfile._id} businessName={businessName} />}

                  <div className="bg-surface-card rounded-md border border-border-subtle overflow-hidden">
                    <div className="px-3.5 py-2.5 border-b border-border-subtle">
                      <h3 className="font-bold text-foreground text-xs">Quick Actions</h3>
                    </div>
                    <div className="p-2 space-y-1">
                      {[
                        { icon: Package, label: "Manage Products", action: () => setShowProductsModal(true) },
                        { icon: Plus, label: "Add Customer", action: () => setShowAddCustomer(true) },
                        { icon: Users, label: "View Customers", action: () => setActivePage("customers") },
                        { icon: TrendingUp, label: "View Analytics", action: () => toast.info("Analytics", "Coming soon...") },
                      ].map(({ icon: Icon, label, action }) => (
                        <button key={label} onClick={action} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-surface transition-colors group text-left">
                          <div className="w-6 h-6 rounded-md bg-brand-muted border border-brand/20 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-3.5 h-3.5 text-brand" />
                          </div>
                          <span className="text-xs font-medium text-muted group-hover:text-foreground transition-colors">{label}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-muted ml-auto group-hover:text-brand transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-surface-card rounded-md border border-border-subtle overflow-hidden">
                  <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-brand-muted flex items-center justify-center">
                        <ClipboardList className="w-3.5 h-3.5 text-brand" />
                      </div>
                      <h3 className="font-bold text-foreground text-xs">Pending Requests</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-brand-muted text-brand font-semibold border border-brand/30">{requestsList.length}</span>
                    </div>
                  </div>

                  <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                    {pendingLoading ? (
                      <div className="p-6 text-center text-muted text-xs">
                        <Loader2 className="w-4 h-4 text-brand animate-spin mx-auto mb-1.5" />
                        Loading requests...
                      </div>
                    ) : requestsList.length === 0 ? (
                      <div className="p-6 text-center text-muted text-xs">No pending customer scan requests.</div>
                    ) : (
                      requestsList.map((req) => (
                        <LoyaltyRequestCard
                          key={req._id}
                          request={req}
                          onApprove={() => handleApprove(req._id)}
                          onReject={() => handleReject(req._id)}
                          onAddProducts={() => handleAddProducts(req._id)}
                          isLoading={completeMutation.isPending || rejectMutation.isPending}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activePage === "customers" && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Customers</h2>
                  <p className="text-xs text-muted">Manage your loyalty program members</p>
                </div>
                <button onClick={() => setShowAddCustomer(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Add Customer
                </button>
              </div>

              <div className="bg-surface-card rounded-md border border-border-subtle overflow-hidden">
                <div className="px-4 py-3 border-b border-border-subtle">
                  <p className="text-xs font-semibold text-foreground">Total Members: {customersList.length}</p>
                </div>

                <div className="divide-y divide-border-subtle max-h-96 overflow-y-auto">
                  {customersList.length === 0 ? (
                    <div className="p-6 text-center text-muted text-xs">No customers yet</div>
                  ) : (
                    customersList.map((customer) => (
                      <div key={customer._id} className="px-4 py-3 flex items-center justify-between hover:bg-surface transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-md bg-brand text-brand-foreground font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {customer.customerId?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground text-xs">{customer.customerId?.name}</p>
                            <p className="text-[10px] text-muted truncate">{customer.customerId?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <div className="text-right">
                            <p className="text-foreground font-semibold">{customer.points}</p>
                            <p className="text-muted">points</p>
                          </div>
                          <span className="text-[10px] px-2 py-1 rounded-md bg-brand-muted text-brand font-semibold border border-brand/20">
                            {customer.tier || "Basic"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {activePage === "products" && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Products</h2>
                  <p className="text-xs text-muted">Manage loyalty program products and rewards</p>
                </div>
                <button onClick={() => setShowProductsModal(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Manage Products
                </button>
              </div>

              <div className="bg-surface-card rounded-md border border-border-subtle overflow-hidden">
                <div className="px-4 py-3 border-b border-border-subtle">
                  <p className="text-xs font-semibold text-foreground">Total Products: {productsList.length}</p>
                </div>

                <div className="divide-y divide-border-subtle max-h-96 overflow-y-auto">
                  {productsList.length === 0 ? (
                    <div className="p-6 text-center text-muted text-xs">No products yet</div>
                  ) : (
                    productsList.map((product) => (
                      <div key={product._id} className="px-4 py-3 flex items-center justify-between hover:bg-surface transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-xs">{product.name}</p>
                          <p className="text-[10px] text-muted">${product.price.toFixed(2)} • {product.type}</p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-foreground font-semibold">
                            {product.type === "points" ? `${product.pointsValue} pts` : `${product.stampsValue} stamps`}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {activePage === "requests" && (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground">Loyalty Requests</h2>
                <p className="text-xs text-muted">Process pending customer loyalty requests</p>
              </div>

              <div className="space-y-2">
                {pendingLoading ? (
                  <div className="p-6 text-center text-muted text-xs">
                    <Loader2 className="w-4 h-4 text-brand animate-spin mx-auto mb-1.5" />
                    Loading requests...
                  </div>
                ) : requestsList.length === 0 ? (
                  <div className="p-6 text-center text-muted text-xs bg-surface-card rounded-md border border-border-subtle">
                    No pending requests
                  </div>
                ) : (
                  requestsList.map((req) => (
                    <LoyaltyRequestCard
                      key={req._id}
                      request={req}
                      onApprove={() => handleApprove(req._id)}
                      onReject={() => handleReject(req._id)}
                      onAddProducts={() => handleAddProducts(req._id)}
                      isLoading={completeMutation.isPending || rejectMutation.isPending}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {activePage === "settings" && (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground">Settings</h2>
                <p className="text-xs text-muted">Manage your business preferences</p>
              </div>

              <div className="bg-surface-card rounded-md border border-border-subtle p-6 text-center text-muted text-sm">
                Settings coming soon...
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddProductsModal
        isOpen={showAddProducts}
        onClose={() => { setShowAddProducts(false); setSelectedRequestId(null); }}
        onSubmit={handleSubmitProducts}
        availableProducts={productsList}
        isLoading={addProductsMutation.isPending}
      />

      {selectedRequest && (
        <ProcessRequestModal
          isOpen={showProcessing}
          onClose={() => { setShowProcessing(false); setSelectedRequestId(null); }}
          request={selectedRequest}
          onComplete={handleCompleteRequest}
          isLoading={completeMutation.isPending}
        />
      )}

      <ProductManagementModal
        isOpen={showProductsModal}
        onClose={() => setShowProductsModal(false)}
        products={productsList}
        onAdd={handleAddProduct}
        onUpdate={handleUpdateProduct}
        onDelete={handleDeleteProduct}
        isLoading={createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending}
      />

      <AddCustomerModal
        isOpen={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
}
