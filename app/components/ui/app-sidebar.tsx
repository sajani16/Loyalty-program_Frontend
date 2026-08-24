"use client";

import {
  QrCode,
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Settings,
  LogOut,
  ScanLine,
  History,
  Store,
  BadgeCheck,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

type AppSidebarProps = {
  userType: "merchant" | "customer";
  activePage: string;
  onPageChange: (page: string) => void;
  onSignOut: () => void;
  pendingRequestsCount?: number;
  businessName?: string;
  userName?: string;
};

type NavItem = {
  id: string;
  label: string;
  icon: any;
  badge?: number;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

export function AppSidebar({
  userType,
  activePage,
  onPageChange,
  onSignOut,
  pendingRequestsCount = 0,
  businessName,
  userName,
}: AppSidebarProps) {
  const isMerchant = userType === "merchant";

  const merchantNav: NavGroup[] = [
    {
      label: "OVERVIEW",
      items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
      label: "MANAGEMENT",
      items: [
        { id: "customers", label: "Customers", icon: Users },
        { id: "products", label: "Products", icon: Package },
        { id: "requests", label: "Requests", icon: ClipboardList, badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined },
      ],
    },
    {
      label: "ACCOUNT",
      items: [{ id: "settings", label: "Settings", icon: Settings }],
    },
  ];

  const customerNav: NavGroup[] = [
    {
      label: "OVERVIEW",
      items: [
        { id: "dashboard", label: "My Memberships", icon: BadgeCheck },
      ],
    },
    {
      label: "ACTIVITY",
      items: [
        { id: "history", label: "Activity History", icon: History },
      ],
    },
    {
      label: "ACCOUNT",
      items: [{ id: "profile", label: "My Profile", icon: User }],
    },
  ];

  const navGroups = isMerchant ? merchantNav : customerNav;
  const nameLabel = isMerchant ? businessName : userName;
  const subLabel = isMerchant ? "Merchant Portal" : "Customer Portal";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pt-4 pb-2 px-4">
        <div className="flex items-center gap-2 mb-4">
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
              <div className="flex items-center gap-1">
                <span className="text-brand text-[10px] font-medium">{subLabel}</span>
              </div>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group, i) => (
          <SidebarGroup key={i}>
            <SidebarGroupLabel className="text-[10px] tracking-wider text-muted font-bold uppercase">{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        isActive={isActive} 
                        onClick={() => onPageChange(item.id)}
                        className={`transition-colors h-9 ${isActive ? 'bg-brand/20 text-brand hover:bg-brand/30 hover:text-brand' : 'text-muted hover:text-foreground hover:bg-surface-card'}`}
                      >
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-brand' : ''}`} />
                        <span className="text-xs font-semibold">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none flex items-center justify-center min-w-4">
                            {item.badge}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border-subtle">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSignOut} className="text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors h-9">
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-semibold">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
