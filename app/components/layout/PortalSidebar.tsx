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
import { PortalNavItem, PortalUserType } from "./portal-nav-config";

type PortalSidebarProps = {
  items: PortalNavItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
  nameLabel?: string;
  subLabel: string;
  onSignOut: () => void;
  userType: PortalUserType;
  onClose?: () => void;
};

export function PortalSidebar({
  items,
  currentPath,
  onNavigate,
  nameLabel,
  subLabel,
  onSignOut,
  userType,
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
      <div
        className={cn(
          "flex h-full flex-col justify-between border-r text-foreground select-none",
          userType === "merchant"
            ? "border-brand-dark bg-brand text-brand-foreground"
            : "border-border-subtle bg-surface",
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div
            className={cn(
              "shrink-0 space-y-3 border-b p-4",
              userType === "merchant"
                ? "border-white/15"
                : "border-border-subtle",
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand text-brand-foreground shadow-sm">
                <QrCode className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-current">
                Loyalty<span className="text-brand">Hub</span>
              </span>
            </div>

            {nameLabel && (
              <div
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border p-2",
                  userType === "merchant"
                    ? "border-white/15 bg-white/10"
                    : "border-brand/20 bg-brand-muted/60",
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                    userType === "merchant"
                      ? "bg-white text-brand"
                      : "bg-brand text-brand-foreground",
                  )}
                >
                  {nameLabel.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold leading-snug text-current">
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
            {(() => {
              const groups: Record<string, typeof items> = {};
              const groupOrder: string[] = [];
              items.forEach((item) => {
                const g = item.groupLabel ?? "";
                if (!groups[g]) {
                  groups[g] = [];
                  groupOrder.push(g);
                }
                groups[g].push(item);
              });
              return groupOrder.map((groupKey) => (
                <div key={groupKey} className="mb-1">
                  {groupKey && (
                    <p
                      className={cn(
                        "px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-widest",
                        userType === "merchant"
                          ? "text-white/55"
                          : "text-muted",
                      )}
                    >
                      {groupKey}
                    </p>
                  )}
                  {groups[groupKey].map((item) => {
                    const isActive = isItemActive(item);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleNav(item.path)}
                        className={cn(
                          "group relative flex w-full items-center justify-between rounded-none py-2.5 pl-3.5 pr-3 text-xs transition-all duration-150",
                          isActive
                            ? userType === "merchant"
                              ? "bg-white font-bold text-brand"
                              : "bg-brand-muted font-bold text-foreground"
                            : userType === "merchant"
                              ? "font-medium text-white/75 hover:bg-white/10 hover:text-white"
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
                                ? userType === "merchant"
                                  ? "text-brand"
                                  : "text-brand-dark"
                                : userType === "merchant"
                                  ? "text-white/70 group-hover:text-white"
                                  : "text-muted group-hover:text-foreground",
                            )}
                          />
                          <span
                            className={cn(
                              "truncate",
                              isActive || userType !== "merchant"
                                ? "text-current"
                                : "text-white/80",
                            )}
                          >
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
                </div>
              ));
            })()}
          </nav>
        </div>

        <div className="shrink-0 border-t border-border-subtle p-2">
          <button
            onClick={() => setIsConfirmOpen(true)}
            className={cn(
              "group flex w-full items-center gap-2.5 rounded-md px-3.5 py-2.5 text-xs font-semibold transition-colors",
              userType === "merchant"
                ? "text-white/75 hover:bg-white/10 hover:text-white"
                : "text-foreground hover:bg-red-500/10 hover:text-red-600",
            )}
          >
            <LogOut
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                userType === "merchant"
                  ? "text-white/60 group-hover:text-white"
                  : "text-muted group-hover:text-red-600",
              )}
            />
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
