"use client";

import { ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PortalSidebar } from "./PortalSidebar";
import { PortalNavbar } from "./PortalNavbar";
import { getPortalLabel, getPortalNavItems } from "./portal-nav-config";
import QRScannerModal from "@/customer/dashboard/QRScannerModal";

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
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);

  const isMerchant = userType === "merchant";
  const displayName = isMerchant ? businessName : userName;
  const portalLabel = getPortalLabel(userType);
  const navItems = getPortalNavItems(userType, pendingRequestsCount);

  const handleNavigate = (path: string) => {
    if (onPageChange) {
      onPageChange(path);
      return;
    }

    router.push(path);
  };

  const sharedSidebarProps = {
    items: navItems,
    currentPath: pathname,
    onNavigate: handleNavigate,
    nameLabel: displayName,
    subLabel: portalLabel,
    onSignOut,
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside className="hidden h-full w-60 shrink-0 overflow-hidden lg:flex lg:flex-col">
        <PortalSidebar {...sharedSidebarProps} userType={userType} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-60 border-r border-border-subtle p-0"
        >
          <PortalSidebar
            {...sharedSidebarProps}
            userType={userType}
            onClose={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <PortalNavbar
          userType={userType}
          headerTitle={headerTitle}
          displayName={displayName}
          pendingRequestsCount={pendingRequestsCount}
          onNavigate={handleNavigate}
          onSignOut={onSignOut}
          onOpenMenu={() => setMobileOpen(true)}
          onScanMe={
            userType === "customer" ? () => setScanOpen(true) : undefined
          }
        />

        <main className="min-w-0 flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto w-full max-w-7xl pb-10">{children}</div>
        </main>
      </div>

      {userType === "customer" && scanOpen && (
        <QRScannerModal onClose={() => setScanOpen(false)} />
      )}
    </div>
  );
}
