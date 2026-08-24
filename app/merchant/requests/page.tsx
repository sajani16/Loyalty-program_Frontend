"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Loader2, ClipboardList } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  useBusinessProfile,
  usePendingRequests,
  useCompleteRequestMutation,
  useRejectRequestMutation,
} from "../api";
import { ProcessRequestModal } from "@/components/merchant/ProcessRequestModal";
import { AppDataTable, ColumnDefinition, StatusBadge, DualText } from "@/components/ui/app-data-table";

interface LoyaltyRequest {
  _id: string;
  businessCustomerId: {
    _id: string;
    customerId: {
      _id: string;
      name: string;
      email: string;
    };
    tier: string;
    points: number;
  };
  amountSpent: number;
  pointsAwarded: number;
  stampsAwarded: number;
  status: "pending" | "completed" | "rejected" | "expired";
  expiresAt: string;
  createdAt: string;
}

export default function MerchantRequestsPage() {
  const { data: session } = useSession();
  const { data: businessProfile } = useBusinessProfile();
  const { data: pendingData, isLoading: pendingLoading } = usePendingRequests();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [showProcessing, setShowProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const completeMutation = useCompleteRequestMutation();
  const rejectMutation = useRejectRequestMutation();

  const businessName = businessProfile?.name || session?.user?.name || "Merchant";
  const requestsList = pendingData || [];
  const selectedRequest = requestsList.find((r) => r._id === selectedRequestId);

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
        toast.error("Rejection Failed", err instanceof Error ? err.message : "Failed to reject request.");
      },
    });
  };

  const handleProcessSubmit = async (products: any[]) => {
    if (selectedRequestId) {
      completeMutation.mutate(
        { id: selectedRequestId, products },
        {
          onSuccess: () => {
            toast.success("Request Approved", "Customer loyalty request was approved.");
            setShowProcessing(false);
            setSelectedRequestId(null);
          },
          onError: (err) => {
            toast.error("Approval Failed", err instanceof Error ? err.message : "Failed to complete request.");
          },
        }
      );
    }
  };

  const columns: ColumnDefinition<LoyaltyRequest>[] = [
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
      cell: (req) => <span className="font-bold">${req.amountSpent?.toFixed(2) || "0.00"}</span>,
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
        userType="business" 
        activePage="requests" 
        onPageChange={() => {}} 
        onSignOut={handleSignOut} 
        userName={businessName} 
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
      userType="business" 
      activePage="requests" 
      onPageChange={() => {}} 
      onSignOut={handleSignOut} 
      userName={businessName} 
      headerTitle="Loyalty Requests"
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Loyalty Requests</h1>
          <p className="text-sm text-muted">Review and process customer loyalty requests</p>
        </div>

        {/* Empty State */}
        {requestsList.length === 0 && !pendingLoading ? (
          <div className="text-center py-20">
            <ClipboardList className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
            <h2 className="text-lg font-bold text-foreground mb-2">No Pending Requests</h2>
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

      {/* Process Modal */}
      {showProcessing && selectedRequest && (
        <ProcessRequestModal
          isOpen={showProcessing}
          onClose={() => {
            setShowProcessing(false);
            setSelectedRequestId(null);
          }}
          request={selectedRequest}
          onSubmit={handleProcessSubmit}
          isLoading={completeMutation.isPending}
        />
      )}
    </DashboardLayout>
  );
}
