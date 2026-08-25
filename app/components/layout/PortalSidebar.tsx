"use client";

import { useState } from "react";
import { QrCode, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { PortalNavItem } from "./portal-nav-config";

type PortalSidebarProps = {
  items: PortalNavItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
  nameLabel?: string;
  subLabel: string;
  onSignOut: () => void;
  onClose?: () => void;
};

export function PortalSidebar({
  items,
  currentPath,
  onNavigate,
  nameLabel,
  subLabel,
  onSignOut,
  onClose,
}: PortalSidebarProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isItemActive = (item: PortalNavItem) =>
    currentPath === item.path || item.matchPaths?.includes(currentPath);

  const handleNav = (path: string) => {
    onNavigate(path);
    onClose?.();
  };

  const handleConfirmSignOut = () => {
    setIsConfirmOpen(false);
    onClose?.();
    onSignOut();
  };

  return (
    <>
      <div className="flex h-full flex-col justify-between border-r border-border-subtle bg-surface text-foreground select-none">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 space-y-3 border-b border-border-subtle p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand text-brand-foreground shadow-sm">
                <QrCode className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-foreground">
                Loyalty<span className="text-brand">Hub</span>
              </span>
            </div>

            {nameLabel && (
              <div className="flex items-center gap-2.5 rounded-lg border border-brand/20 bg-brand-muted/60 p-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand text-xs font-bold text-brand-foreground">
                  {nameLabel.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold leading-snug text-foreground">
                    {nameLabel}
                  </p>
                  <span className="block truncate text-[10px] font-medium text-muted">
                    {subLabel}
                  </span>
                </div>
              </div>
            )}
          </div>

          <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto p-2">
            {items.map((item) => {
              const isActive = isItemActive(item);
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={() => handleNav(item.path)}
                  className={cn(
                    "group relative flex w-full items-center justify-between rounded-none py-2.5 pl-3.5 pr-3 text-xs transition-all duration-150",
                    isActive
                      ? "bg-brand-muted font-bold text-foreground"
                      : "font-medium text-foreground hover:bg-border-subtle/40",
                  )}
                >
                  {isActive && (
                    <span className="absolute bottom-0 left-0 top-0 w-1 rounded-none bg-brand" />
                  )}

                  <div className="flex min-w-0 items-center gap-3 pl-1">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-brand-dark"
                          : "text-muted group-hover:text-foreground",
                      )}
                    />
                    <span className="truncate text-foreground">
                      {item.label}
                    </span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="ml-2 min-w-4 shrink-0 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="shrink-0 border-t border-border-subtle p-2">
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="group flex w-full items-center gap-2.5 rounded-md px-3.5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-red-600" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ── Sign Out Confirmation Modal ── */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="max-w-md rounded-xl border border-border-subtle bg-surface-card text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-foreground">
              Sign Out Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted">
              Are you sure you want to sign out? You will need to log back in to
              access your portal.
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
