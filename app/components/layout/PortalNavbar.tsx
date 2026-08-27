"use client";

import { useState } from "react";
import { Bell, LayoutDashboard, Menu, ScanLine, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PortalUserType, getDashboardPath } from "./portal-nav-config";

type PortalNavbarProps = {
  userType: PortalUserType;
  headerTitle: string;
  displayName?: string;
  pendingRequestsCount?: number;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
  onOpenMenu: () => void;
  onScanMe?: () => void;
};

export function PortalNavbar({
  userType,
  headerTitle,
  displayName,
  pendingRequestsCount = 0,
  onNavigate,
  onSignOut,
  onOpenMenu,
  onScanMe,
}: PortalNavbarProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const dashboardPath = getDashboardPath(userType);
  const isMerchant = userType === "merchant";

  const handleConfirmSignOut = () => {
    setIsConfirmOpen(false);
    onSignOut();
  };

  return (
    <>
      <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-border-subtle bg-surface/95 px-4 shadow-sm backdrop-blur-md lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="rounded-md p-1 text-muted hover:text-foreground lg:hidden"
            aria-label="Open Navigation"
            onClick={onOpenMenu}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
              {isMerchant ? "Business workspace" : "Customer workspace"}
            </p>
            <h1 className="text-sm font-bold text-foreground">{headerTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userType === "customer" && (
            <button
              onClick={onScanMe}
              className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-bold text-brand-foreground shadow-sm transition-all hover:opacity-90"
            >
              <ScanLine className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Scan Me</span>
            </button>
          )}

          {isMerchant && pendingRequestsCount > 0 && (
            <button
              className="relative cursor-pointer rounded-md p-1"
              onClick={() => onNavigate("/merchant/requests")}
              aria-label="View pending requests"
            >
              <Bell className="h-4 w-4 text-brand-dark" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {pendingRequestsCount > 9 ? "9+" : pendingRequestsCount}
              </span>
            </button>
          )}

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-full focus:outline-none"
                aria-label="Open user menu"
              >
                <Avatar className="h-8 w-8 border border-border-subtle">
                  <AvatarFallback className="bg-brand-muted text-xs font-bold text-foreground">
                    {(displayName || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onNavigate(dashboardPath)}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Trigger the confirmation modal instead of executing signout immediately */}
              <DropdownMenuItem
                onClick={() => setIsConfirmOpen(true)}
                className="text-red-600 focus:bg-red-500/10 focus:text-red-600 dark:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ── Sign Out Confirmation Modal ── */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="max-w-md rounded-xl border border-border-subtle bg-surface-card text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-foreground">
              Sign Out Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted">
              Are you sure you want to sign out of your account? You will need
              to log in again to access your dashboard.
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
