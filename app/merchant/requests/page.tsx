"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Loader2, ClipboardList, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  useBusinessProfile,
  usePendingRequests,
  useCompleteRequestMutation,
  useRejectRequestMutation,
  useBusinessCustomers,
  useCreateLoyaltyRequestMutation,
  useStampEligibleProducts,
} from "../api";
import {
  ProcessRequestModal,
  CompletePayload,
} from "@/components/merchant/ProcessRequestModal";
import {
  AppDataTable,
  ColumnDefinition,
  StatusBadge,
  DualText,
} from "@/components/ui/app-data-table";
import { LoyaltyRequestItem } from "@/services/merchant.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

function CreateRequestModal({
  isOpen,
  onClose,
  isLoading,
  onSubmit,
  customers,
}: {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSubmit: (customerId: string) => void;
  customers: any[];
}) {
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCustomer.trim()) {
      toast.info("Required", "Please select a customer.");
      return;
    }
    onSubmit(selectedCustomer);
    setSelectedCustomer("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-border-subtle bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-bold text-foreground">
              Create Loyalty Request
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted hover:text-foreground hover:bg-surface-card transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Select Customer *
            </label>
            <Select
              value={selectedCustomer}
              onValueChange={setSelectedCustomer}
            >
              <SelectTrigger className="w-full border-border-subtle bg-surface-card text-foreground text-sm focus:ring-brand/50">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-border-subtle text-foreground">
                {customers.map((cust) => (
                  <SelectItem
                    key={cust._id}
                    value={cust._id}
                    className="text-sm cursor-pointer focus:bg-emerald-500/10 "
                  >
                    {cust.customerId?.name || "Unknown"} (
                    {cust.customerId?.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-border-subtle text-xs font-bold text-foreground hover:bg-surface-card transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 rounded-lg bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Creating…" : "Create Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MerchantRequestsPage() {
  const { data: session } = useSession();
  const { data: businessProfile } = useBusinessProfile();
  const { data: pendingData, isLoading: pendingLoading } = usePendingRequests();
  const { data: customersData } = useBusinessCustomers();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [showProcessing, setShowProcessing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);

  const completeMutation = useCompleteRequestMutation();
  const rejectMutation = useRejectRequestMutation();
  const createMutation = useCreateLoyaltyRequestMutation();
  const { data: stampProductsData } = useStampEligibleProducts();

  const businessName =
    businessProfile?.name || session?.user?.name || "Merchant";
  const requestsList = (pendingData || []) as LoyaltyRequestItem[];
  const selectedRequest =
    requestsList.find((r) => r._id === selectedRequestId) || null;
  const customers = (customersData || []) as any[];

  const handleSignOut = () => {
    toast.success("Signed out", "You have been logged out safely.");
    void signOut({ callbackUrl: "/" });
  };

  const handleApprove = (id: string) => {
    setSelectedRequestId(id);
    setShowProcessing(true);
  };

  const handleReject = (id: string) => {
    rejectMutation.mutate(id, {
      onSuccess: () => {
        toast.info("Request Declined", "Loyalty request was rejected.");
      },
      onError: (err) => {
        toast.error(
          "Rejection Failed",
          err instanceof Error ? err.message : "Failed to reject request.",
        );
      },
    });
  };

  const handleProcessSubmit = async (payload: CompletePayload) => {
    if (selectedRequestId) {
      completeMutation.mutate(
        { id: selectedRequestId, payload },
        {
          onSuccess: () => {
            toast.success(
              "Request Approved",
              "Customer loyalty request was approved.",
            );
            setShowProcessing(false);
            setSelectedRequestId(null);
          },
          onError: (err) => {
            toast.error(
              "Approval Failed",
              err instanceof Error
                ? err.message
                : "Failed to complete request.",
            );
          },
        },
      );
    }
  };

  const handleCreateRequest = (businessCustomerId: string) => {
    createMutation.mutate(businessCustomerId, {
      onSuccess: () => {
        toast.success(
          "Request Created",
          "Loyalty request created for customer.",
        );
        setShowCreateModal(false);
      },
      onError: (err) => {
        toast.error(
          "Creation Failed",
          err instanceof Error ? err.message : "Failed to create request.",
        );
      },
    });
  };

  const columns: ColumnDefinition<LoyaltyRequestItem>[] = [
    {
      header: "Customer",
      cell: (req) => (
        <DualText
          primary={req.businessCustomerId?.customerId?.name || "Unknown"}
          secondary={req.businessCustomerId?.customerId?.email}
        />
      ),
    },
    {
      header: "Tier",
      cell: (req) => (
        <span className="text-xs px-2 py-1 rounded-full bg-brand/10 text-brand font-semibold capitalize">
          {req.businessCustomerId?.tier || "Basic"}
        </span>
      ),
    },
    {
      header: "Amount",
      align: "right",
      cell: (req) => (
        <span className="font-bold">
          ${req.amountSpent?.toFixed(2) || "0.00"}
        </span>
      ),
    },
    {
      header: "Status",
      align: "center",
      cell: (req) => <StatusBadge status={req.status} />,
    },
    {
      header: "Date",
      cell: (req) => (
        <div className="text-xs">
          <p>{new Date(req.createdAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      header: "Actions",
      align: "right",
      cell: (req) => (
        <div className="flex gap-2">
          {req.status === "pending" && (
            <>
              <button
                onClick={() => handleApprove(req._id)}
                className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-600 hover:bg-green-500/20 font-semibold"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(req._id)}
                className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 font-semibold"
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (pendingLoading && page === 1) {
    return (
      <DashboardLayout
        userType="merchant"
        onSignOut={handleSignOut}
        businessName={businessName}
        headerTitle="Loyalty Requests"
      >
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userType="merchant"
      onSignOut={handleSignOut}
      businessName={businessName}
      headerTitle="Loyalty Requests"
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Loyalty Requests
            </h1>
            <p className="text-sm text-muted">
              Review and process pending customer loyalty requests
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Request
          </button>
        </div>

        {requestsList.length === 0 && !pendingLoading ? (
          <div className="text-center py-20">
            <ClipboardList className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
            <h2 className="text-lg font-bold text-foreground mb-2">
              No Pending Requests
            </h2>
            <p className="text-sm text-muted">
              All requests have been processed or there are no requests yet
            </p>
          </div>
        ) : (
          <AppDataTable
            title="Pending Requests"
            totalCount={requestsList.length}
            countLabel="requests"
            columns={columns}
            data={requestsList}
            isLoading={pendingLoading}
            page={page}
            totalPages={1}
            onPageChange={setPage}
          />
        )}
      </div>

      {showProcessing && selectedRequest && (
        <ProcessRequestModal
          isOpen={showProcessing}
          onClose={() => {
            setShowProcessing(false);
            setSelectedRequestId(null);
          }}
          request={selectedRequest}
          onComplete={handleProcessSubmit}
          isLoading={completeMutation.isPending}
          stampProducts={stampProductsData || []}
        />
      )}

      <CreateRequestModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        isLoading={createMutation.isPending}
        onSubmit={handleCreateRequest}
        customers={customers}
      />
    </DashboardLayout>
  );
}
