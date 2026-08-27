import {
  BadgeCheck,
  History,
  User,
  Settings,
  LayoutDashboard,
  ClipboardList,
  Users,
  Package,
} from "lucide-react";

export type PortalUserType = "customer" | "merchant";

export type PortalNavItem = {
  path: string;
  label: string;
  icon: any;
  badge?: number;
  matchPaths?: string[];
  groupLabel?: string;
};

export function getPortalNavItems(
  userType: PortalUserType,
  pendingRequestsCount: number,
): PortalNavItem[] {
  if (userType === "customer") {
    return [
      { path: "/customer/profile", label: "Profile", icon: User },
      {
        path: "/customer/change-password",
        label: "Change Password",
        icon: Settings,
      },
      {
        path: "/customer/membership",
        label: "My Membership",
        icon: BadgeCheck,
        matchPaths: ["/customer/dashboard"],
      },
      { path: "/customer/history", label: "Activity History", icon: History },
    ];
  }

  return [
    { path: "/merchant/dashboard", label: "Dashboard", icon: LayoutDashboard, groupLabel: "OVERVIEW" },
    {
      path: "/merchant/requests",
      label: "Requests",
      icon: ClipboardList,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      groupLabel: "MANAGEMENT",
    },
    { path: "/merchant/customers", label: "Customers", icon: Users, groupLabel: "MANAGEMENT" },
    { path: "/merchant/history", label: "Activity History", icon: History, groupLabel: "MANAGEMENT" },
    { path: "/merchant/products", label: "Products", icon: Package, groupLabel: "MANAGEMENT" },
    { path: "/merchant/profile", label: "Profile", icon: User, groupLabel: "ACCOUNT" },
    {
      path: "/merchant/change-password",
      label: "Change Password",
      icon: Settings,
      groupLabel: "ACCOUNT",
    },
  ];
}


export function getPortalLabel(userType: PortalUserType) {
  return userType === "merchant" ? "Merchant Portal" : "Customer Portal";
}

export function getDashboardPath(userType: PortalUserType) {
  return userType === "merchant"
    ? "/merchant/dashboard"
    : "/customer/membership";
}
