"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { UserCheck, Store, ArrowLeftRight } from "lucide-react";

interface UserTypeIndicatorProps {
  userType: "customer" | "business" | string;
}

export function UserTypeIndicator({ userType }: UserTypeIndicatorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isCustomer = userType === "customer";
  const switchType = isCustomer ? "business" : "customer";

  const buildSwitchUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("userType", switchType);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="w-full px-4 py-2 flex items-center justify-between border-b border-border-subtle bg-surface">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-brand-muted border border-brand/30 flex items-center justify-center">
          {isCustomer ? (
            <UserCheck className="w-3.5 h-3.5 text-brand" />
          ) : (
            <Store className="w-3.5 h-3.5 text-brand" />
          )}
        </div>
        <span className="text-xs font-semibold text-foreground">
          {isCustomer ? "Customer" : "Business"} Portal
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-brand-muted text-brand border border-brand/20">
          {isCustomer ? "Earn rewards" : "Manage loyalty"}
        </span>
      </div>

      <Link
        href={buildSwitchUrl()}
        id={`switch-to-${switchType}`}
        className="flex items-center gap-1.5 text-xs font-medium text-brand hover:underline transition-colors"
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
        Switch to {isCustomer ? "Business" : "Customer"}
      </Link>
    </div>
  );
}
