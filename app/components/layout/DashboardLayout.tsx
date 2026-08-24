"use client";

import { useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  QrCode,
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Settings,
  LogOut,
  BadgeCheck,
  History,
  User,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Bell } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

type NavItem = { path: string; label: string; icon: any; badge?: number };
type NavGroup = { label: string; items: NavItem[] };

// ─── Sidebar Content ────────────────────────────────────────────────────────

function SidebarNav({
  navGroups,
  currentPath,
  onNavigate,
  nameLabel,
  subLabel,
  onSignOut,
  onClose,
}: {
  navGroups: NavGroup[];
  currentPath: string;
  onNavigate: (path: string) => void;
  nameLabel?: string;
  subLabel: string;
  onSignOut: () => void;
  onClose?: () => void;
}) {
  const handleNav = (path: string) => {
    onNavigate(path);
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-sidebar-border space-y-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center flex-shrink-0">
            <QrCode className="w-4 h-4 text-brand-foreground" />
          </div>
          <span className="text-foreground font-bold text-sm tracking-tight">
            Loyalty<span className="text-brand">Hub</span>
          </span>
        </div>

        {nameLabel && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-brand/10 border border-brand/20">
            <div className="w-8 h-8 rounded-md bg-brand/20 border border-brand/30 flex items-center justify-center flex-shrink-0 text-brand font-bold text-sm">
              {nameLabel.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-foreground text-xs font-semibold truncate">{nameLabel}</p>
              <span className="text-brand text-[10px] font-medium">{subLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navGroups.map((group, i) => (
          <div key={i}>
            <p className="text-[10px] tracking-widest text-muted font-bold uppercase px-2 mb-1">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNav(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-colors",
                        isActive
                          ? "bg-brand/15 text-brand"
                          : "text-muted hover:text-foreground hover:bg-surface-card"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-brand" : "")} />
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-sidebar-border flex-shrink-0">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard Layout ────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "merchant" | "customer";
  activePage?: string;
  onPageChange?: (page: string) => void;
  onSignOut: () => void;
  userName?: string;
  businessName?: string;
  pendingRequestsCount?: number;
  headerTitle: string;
  headerActions?: ReactNode;
}

export function DashboardLayout({
  children,
  userType,
  onPageChange,
  onSignOut,
  userName,
  businessName,
  pendingRequestsCount = 0,
  headerTitle,
  headerActions,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMerchant = userType === "merchant";

  const merchantNav: NavGroup[] = [
    { label: "OVERVIEW", items: [{ path: "/merchant/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
    {
      label: "MANAGEMENT",
      items: [
        { path: "/merchant/customers", label: "Customers", icon: Users },
        { path: "/merchant/products", label: "Products", icon: Package },
        { path: "/merchant/requests", label: "Requests", icon: ClipboardList, badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined },
      ],
    },
    {
      label: "PERSONAL INFO",
      items: [
        { path: "/merchant/profile", label: "Profile", icon: User },
        { path: "/merchant/change-password", label: "Change Password", icon: Settings },
      ],
    },
  ];

  const customerNav: NavGroup[] = [
    { label: "OVERVIEW", items: [{ path: "/customer/dashboard", label: "My Memberships", icon: BadgeCheck }] },
    { label: "ACTIVITY", items: [{ path: "/customer/history", label: "Activity History", icon: History }] },
    {
      label: "PERSONAL INFO",
      items: [
        { path: "/customer/profile", label: "Profile", icon: User },
        { path: "/customer/change-password", label: "Change Password", icon: Settings },
      ],
    },
  ];

  const navGroups = isMerchant ? merchantNav : customerNav;
  const nameLabel = isMerchant ? businessName : userName;
  const subLabel = isMerchant ? "Merchant Portal" : "Customer Portal";

  const handleNavigate = (path: string) => {
    if (onPageChange) {
      onPageChange(path);
    } else {
      router.push(path);
    }
  };

  const sharedNavProps = {
    navGroups,
    currentPath: pathname,
    onNavigate: handleNavigate,
    nameLabel,
    subLabel,
    onSignOut,
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* ── Desktop sidebar (static, always visible) ── */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 h-full overflow-hidden">
        <SidebarNav {...sharedNavProps} />
      </aside>

      {/* ── Mobile sidebar (Sheet drawer) ── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-60">
          <SidebarNav {...sharedNavProps} onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* ── Main content area ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 z-20 bg-surface/90 backdrop-blur-md border-b border-border-subtle px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-muted hover:text-brand p-1 rounded-md"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xs font-bold text-foreground">{headerTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            {headerActions}
            {isMerchant && pendingRequestsCount > 0 && (
              <div
                className="relative cursor-pointer"
                onClick={() => handleNavigate("/merchant/requests")}
              >
                <Bell className="w-4 h-4 text-brand" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pendingRequestsCount > 9 ? "9+" : pendingRequestsCount}
                </span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 min-w-0">
          <div className="w-full max-w-7xl mx-auto pb-10">{children}</div>
        </main>
      </div>
    </div>
  );
}