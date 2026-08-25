"use client";

import {
  TrendingUp,
  Package,
  Plus,
  Users,
  ChevronRight,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { QRCodeDisplay } from "@/components/merchant/QRCodeDisplay";
import { LoyaltyRequestCard } from "@/components/merchant/LoyaltyRequestCard";

interface StatInfo {
  label: string;
  value: string;
  icon: any;
}

interface MerchantOverviewProps {
  businessName?: string;
  businessId?: string;
  stats?: StatInfo[];
  requestsList?: any[];
  pendingLoading?: boolean;
  onPageSwitch: (page: string) => void;
  onShowProductsModal: () => void;
  onShowAddCustomer: () => void;
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onAddProductsToRequest: (id: string) => void;
  isProcessing?: boolean;
}

export function MerchantOverview({
  businessName = "",
  businessId = "",
  stats = [],
  requestsList = [],
  pendingLoading = false,
  onPageSwitch,
  onShowProductsModal,
  onShowAddCustomer,
  onApproveRequest,
  onRejectRequest,
  onAddProductsToRequest,
  isProcessing = false,
}: MerchantOverviewProps) {
  // Ensure requestsList is an array to safely call .length and .slice
  const safeRequestsList = requestsList ?? [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-1">
          Good day, {businessName?.split(" ")[0] || "Merchant"} 🏪
        </h2>{" "}
        <p className="text-xs text-muted">
          Real-time overview of your merchant loyalty program.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {(stats ?? []).map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-surface-card rounded-xl p-4 border border-border-subtle hover:border-brand/40 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-md bg-brand/10 flex items-center justify-center">
                {Icon && <Icon className="w-4 h-4 text-brand" />}
              </div>
              <TrendingUp className="w-4 h-4 text-brand/50" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
            <p className="text-xs text-muted font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-4 lg:col-span-1">
          {businessId && (
            <QRCodeDisplay
              businessId={businessId}
              businessName={businessName}
            />
          )}

          <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-border-subtle bg-surface/30">
              <h3 className="font-bold text-foreground text-xs">
                Quick Actions
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {[
                {
                  icon: Package,
                  label: "Manage Products",
                  action: onShowProductsModal,
                },
                {
                  icon: Plus,
                  label: "Add Customer",
                  action: onShowAddCustomer,
                },
                {
                  icon: Users,
                  label: "View Customers",
                  action: () => onPageSwitch?.("customers"),
                },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors group text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-brand" />
                  </div>
                  <span className="text-xs font-semibold text-muted group-hover:text-foreground transition-colors">
                    {label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted ml-auto group-hover:text-brand transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface-card rounded-xl border border-border-subtle shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-4 py-3 border-b border-border-subtle bg-surface/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-brand/10 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-brand" />
                </div>
                <h3 className="font-bold text-foreground text-sm">
                  Pending Requests
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 font-bold border border-red-500/20">
                  {safeRequestsList.length}
                </span>
              </div>
              <button
                onClick={() => onPageSwitch?.("requests")}
                className="text-xs text-brand font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="p-3 space-y-2 overflow-y-auto flex-1 max-h-[400px]">
              {pendingLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-muted py-10">
                  <Loader2 className="w-5 h-5 text-brand animate-spin mb-2" />
                  <span className="text-xs font-medium">
                    Loading requests...
                  </span>
                </div>
              ) : safeRequestsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted py-10">
                  <span className="text-xs font-medium">
                    No pending requests right now.
                  </span>
                </div>
              ) : (
                safeRequestsList
                  .slice(0, 5)
                  .map((req) => (
                    <LoyaltyRequestCard
                      key={req?._id ?? req?.id}
                      request={req}
                      onApprove={() => onApproveRequest?.(req?._id ?? req?.id)}
                      onReject={() => onRejectRequest?.(req?._id ?? req?.id)}
                      onAddProducts={() =>
                        onAddProductsToRequest?.(req?._id ?? req?.id)
                      }
                      isLoading={isProcessing}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
