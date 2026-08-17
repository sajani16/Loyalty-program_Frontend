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
  Clock,
  ChevronRight,
  Menu,
  X,
  Bell,
  BadgeCheck,
  Zap,
  Store,
  Loader2,
  Check,
  Ban,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  useBusinessProfile,
  useBusinessCustomers,
  usePendingRequests,
  useCompleteRequestMutation,
  useRejectRequestMutation,
} from "../api";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Customers", active: false },
  { icon: Package, label: "Products", active: false },
  { icon: ClipboardList, label: "Requests", active: false },
  { icon: Settings, label: "Settings", active: false },
];

/* ─── Sidebar ───────────────────────────────────────── */
function Sidebar({
  open,
  onClose,
  businessName,
}: {
  open: boolean;
  onClose: () => void;
  businessName: string;
}) {
  const handleNavClick = (label: string) => {
    toast.info(label, `Switching view to ${label}...`);
  };

  const handleSignOut = () => {
    toast.success("Logged out", "Merchant session closed safely.");
    void signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 z-40 flex flex-col bg-surface border-r border-border-subtle transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="px-4 py-4 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center">
                <QrCode className="w-4 h-4 text-brand-foreground" />
              </div>
              <span className="text-foreground font-bold text-xs">
                Loyalty<span className="text-brand">Hub</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-muted hover:text-foreground p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Business pill */}
          <div className="mt-3 flex items-center gap-2 p-2 rounded-md bg-surface-card border border-border-subtle">
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

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
          <p className="text-muted text-[10px] uppercase tracking-widest font-semibold px-2 mb-2">
            Main Menu
          </p>
          {navItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              id={`sidebar-${label.toLowerCase()}`}
              onClick={() => handleNavClick(label)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md mb-1 text-xs font-medium transition-all text-left ${
                active
                  ? "bg-brand-muted text-brand border border-brand/40 font-bold"
                  : "text-muted hover:text-foreground hover:bg-surface-card"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-brand" : ""}`} />
              {label}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-2.5 py-3 border-t border-border-subtle">
          <button
            id="merchant-signout-btn"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-muted hover:text-red-500 hover:bg-surface-card transition-all text-xs font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

/* ─── Top bar ────────────────────────────────────────── */
function TopBar({
  onMenuClick,
  userName,
}: {
  onMenuClick: () => void;
  userName: string;
}) {
  return (
    <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-border-subtle px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          id="merchant-menu-btn"
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 rounded-md flex items-center justify-center text-muted hover:bg-surface-card hover:text-brand transition-colors border border-border-subtle"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xs font-bold text-foreground">Merchant Console</h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <ThemeToggle />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brand text-brand-foreground font-bold text-xs flex items-center justify-center">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-foreground leading-none">{userName}</p>
            <p className="text-[10px] text-muted mt-0.5">Merchant</p>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── Main Dashboard ─────────────────────────────────── */
export default function MerchantDashboard() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: businessProfile } = useBusinessProfile();
  const { data: customersData } = useBusinessCustomers();
  const { data: pendingData, isLoading: pendingLoading } = usePendingRequests();

  const completeMutation = useCompleteRequestMutation();
  const rejectMutation = useRejectRequestMutation();

  const businessName = businessProfile?.name || session?.user?.name || "Merchant";
  const customersList = customersData || [];
  const requestsList = pendingData || [];

  const totalCustomersCount = customersList.length;
  const totalPointsAwarded = customersList.reduce((sum, c) => sum + (c.points || 0), 0);

  const handleApprove = (id: string, customerName?: string) => {
    completeMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Request Approved", `Loyalty visit request for ${customerName || "Customer"} confirmed.`);
      },
      onError: (err) => {
        toast.error("Approval Failed", err instanceof Error ? err.message : "Failed to approve request.");
      },
    });
  };

  const handleReject = (id: string, customerName?: string) => {
    rejectMutation.mutate(id, {
      onSuccess: () => {
        toast.info("Request Declined", `Request for ${customerName || "Customer"} was rejected.`);
      },
      onError: (err) => {
        toast.error("Rejection Failed", err instanceof Error ? err.message : "Failed to reject request.");
      },
    });
  };

  const handleQuickAction = (label: string) => {
    switch (label) {
      case "View My QR Code":
        toast.success("Business QR Code", `Your Business ID is: ${businessProfile?._id || "Ready"}. Display this code for customer scans.`);
        break;
      case "Add Customer":
        toast.info("Add Customer", "Customer enrollment workflow.");
        break;
      case "Manage Products":
        toast.info("Product Catalog", "Manage catalog items.");
        break;
      case "View Analytics":
        toast.info("Analytics", "Analytics report loading.");
        break;
      default:
        toast.info(label, "Action clicked.");
    }
  };

  const stats = [
    { label: "Total Customers", value: totalCustomersCount.toString(), icon: Users },
    { label: "Pending Requests", value: requestsList.length.toString(), icon: ClipboardList },
    { label: "Points Issued", value: totalPointsAwarded.toLocaleString(), icon: Star },
    { label: "Active Tier", value: "Verified", icon: BadgeCheck },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        businessName={businessName}
      />

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          userName={businessName}
        />

        <main className="flex-1 p-4 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="mb-5">
            <h2 className="text-lg font-bold text-foreground mb-0.5">
              Good day, {businessName.split(" ")[0]} 🏪
            </h2>
            <p className="text-xs text-muted">
              Real-time overview of your merchant loyalty program.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                onClick={() => toast.info(label, `Current metric: ${value}`)}
                className="bg-surface-card rounded-md p-3.5 border border-border-subtle hover:border-brand/40 transition-all cursor-pointer"
              >
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
            {/* Pending Requests */}
            <div className="lg:col-span-2 bg-surface-card rounded-md border border-border-subtle overflow-hidden">
              <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-brand-muted flex items-center justify-center">
                    <ClipboardList className="w-3.5 h-3.5 text-brand" />
                  </div>
                  <h3 className="font-bold text-foreground text-xs">Pending Requests</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-brand-muted text-brand font-semibold border border-brand/30">
                    {requestsList.length}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-border-subtle">
                {pendingLoading ? (
                  <div className="p-6 text-center text-muted text-xs">
                    <Loader2 className="w-4 h-4 text-brand animate-spin mx-auto mb-1.5" />
                    Loading requests...
                  </div>
                ) : requestsList.length === 0 ? (
                  <div className="p-6 text-center text-muted text-xs">
                    No pending customer scan requests at the moment.
                  </div>
                ) : (
                  requestsList.map((req) => {
                    const custName =
                      req.businessCustomerId?.customerId?.name || "Customer";
                    const custEmail =
                      req.businessCustomerId?.customerId?.email || "Scan request";
                    return (
                      <div
                        key={req._id}
                        className="px-4 py-3 flex items-center gap-3 hover:bg-surface transition-colors"
                      >
                        <div className="w-8 h-8 rounded-md bg-brand text-brand-foreground font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {custName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-xs">{custName}</p>
                          <p className="text-[10px] text-muted truncate">{custEmail}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            disabled={completeMutation.isPending}
                            onClick={() => handleApprove(req._id, custName)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-colors disabled:opacity-50"
                          >
                            <Check className="w-3 h-3" />
                            Approve
                          </button>
                          <button
                            disabled={rejectMutation.isPending}
                            onClick={() => handleReject(req._id, custName)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface border border-border-subtle text-muted text-xs font-semibold hover:text-foreground transition-colors disabled:opacity-50"
                          >
                            <Ban className="w-3 h-3" />
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <div className="bg-surface-card rounded-md border border-border-subtle overflow-hidden">
                <div className="px-3.5 py-2.5 border-b border-border-subtle">
                  <h3 className="font-bold text-foreground text-xs">Quick Actions</h3>
                </div>
                <div className="p-2 space-y-1">
                  {[
                    { icon: Zap, label: "View My QR Code" },
                    { icon: Users, label: "Add Customer" },
                    { icon: Package, label: "Manage Products" },
                    { icon: TrendingUp, label: "View Analytics" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      onClick={() => handleQuickAction(label)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-surface transition-colors group text-left"
                    >
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
          </div>
        </main>
      </div>
    </div>
  );
}
