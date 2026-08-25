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
  Menu,
  X,
  BadgeCheck,
  Store,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MerchantNavProps {
  businessName: string;
  currentPage?:
    | "dashboard"
    | "customers"
    | "products"
    | "requests"
    | "settings";
  onPageChange?: (page: string) => void;
}

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "customers", icon: Users, label: "Customers" },
  { id: "products", icon: Package, label: "Products" },
  { id: "requests", icon: ClipboardList, label: "Requests" },
  { id: "settings", icon: Settings, label: "Settings" },
];

/* ─── Sidebar ───────────────────────────────────────── */
function Sidebar({
  open,
  onClose,
  businessName,
  currentPage,
  onPageChange,
}: {
  open: boolean;
  onClose: () => void;
  businessName: string;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onPageChange?.(id);
    onClose();
  };

  const handleConfirmSignOut = () => {
    setIsConfirmOpen(false);
    onClose();
    toast.success("Logged out", "Merchant session ended.");
    void signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 z-40 flex flex-col bg-surface border-r border-border-subtle transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="px-4 py-4 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-3">
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

          {/* Business Badge */}
          <div className="flex items-center gap-2 p-2 rounded-md bg-surface-card border border-border-subtle">
            <div className="w-6 h-6 rounded-md bg-brand-muted border border-brand/30 flex items-center justify-center flex-shrink-0">
              <Store className="w-3.5 h-3.5 text-brand" />
            </div>
            <div className="min-w-0">
              <p className="text-foreground text-xs font-semibold truncate">
                {businessName}
              </p>
              <div className="flex items-center gap-1">
                <BadgeCheck className="w-3 h-3 text-brand" />
                <span className="text-brand text-[10px] font-medium">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
          <p className="text-muted text-[10px] uppercase tracking-widest font-semibold px-2 mb-2">
            Navigation
          </p>
          {navItems.map(({ id, icon: Icon, label }) => {
            const isActive = currentPage === id;
            return (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md mb-1 text-xs font-medium transition-all text-left ${
                  isActive
                    ? "bg-brand-muted text-brand border border-brand/40"
                    : "text-muted hover:text-foreground hover:bg-surface-card"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                    isActive ? "text-brand" : ""
                  }`}
                />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="px-2.5 py-3 border-t border-border-subtle">
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-muted hover:text-red-500 hover:bg-surface-card transition-all text-xs font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Sign Out Confirmation Modal ── */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="max-w-md rounded-xl border border-border-subtle bg-surface-card text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-foreground">
              Sign Out Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted">
              Are you sure you want to sign out? You will need to log back in to
              access the merchant console.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-md border-border-subtle text-xs font-semibold hover:bg-border-subtle/40">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSignOut}
              className="rounded-md bg-red-600 text-xs font-semibold text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* ─── Top Bar ────────────────────────────────────────── */
function TopBar({
  onMenuClick,
  businessName,
}: {
  onMenuClick: () => void;
  businessName: string;
}) {
  return (
    <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-border-subtle px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 rounded-md flex items-center justify-center text-muted hover:bg-surface-card hover:text-brand transition-colors border border-border-subtle"
        >
          <Menu className="w-4 h-4" />
        </button>
        <h1 className="text-xs font-bold text-foreground">Merchant Console</h1>
      </div>

      <div className="flex items-center gap-2.5">
        <ThemeToggle />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brand text-brand-foreground font-bold text-xs flex items-center justify-center">
            {businessName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-foreground leading-none">
              {businessName.split(" ")[0]}
            </p>
            <p className="text-[10px] text-muted mt-0.5">Merchant</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function MerchantNav({
  businessName,
  currentPage = "dashboard",
  onPageChange,
}: MerchantNavProps) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = businessName || session?.user?.name || "Merchant";

  return (
    <>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        businessName={displayName}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />

      <TopBar
        onMenuClick={() => setSidebarOpen(true)}
        businessName={displayName}
      />
    </>
  );
}
