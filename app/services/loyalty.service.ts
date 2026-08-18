import api from "@/lib/api";
import { ApiResponse } from "./auth.service";

export interface LoyaltyStats {
  totalPoints: number;
  totalStamps: number;
  currentTier: string;
  nextTierPoints: number;
}

export interface CustomerLoyaltyRequest {
  _id: string;
  businessCustomerId: string;
  products: Array<{
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
  }>;
  amountSpent?: number;
  pointsAwarded?: number;
  stampsAwarded?: number;
  status: "pending" | "completed" | "rejected" | "expired";
  createdAt: string;
  completedAt?: string;
  expiresAt: string;
}

export const loyaltyService = {
  /**
   * Customer scans a merchant's QR code and submits a loyalty request.
   * The QR code payload is a plain businessId string.
   * Endpoint: POST /loyalty-requests/qr-scan/:businessId
   */
  async scanQR(businessId: string): Promise<ApiResponse> {
    const res = await api.post(`/loyalty-requests/qr-scan/${businessId}`);
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to submit loyalty request");
    }
    return res.data;
  },

  /**
   * Get customer's loyalty requests for a given businessCustomer relationship
   */
  async getCustomerRequests(businessCustomerId: string): Promise<ApiResponse<CustomerLoyaltyRequest[]>> {
    const res = await api.get(
      `/loyalty-requests/customer/${businessCustomerId}`,
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch loyalty requests");
    }
    return res.data;
  },

  /**
   * Get loyalty statistics for a customer at a specific business
   */
  async getLoyaltyStats(businessCustomerId: string): Promise<ApiResponse<LoyaltyStats>> {
    const res = await api.get(
      `/loyalty-requests/stats/${businessCustomerId}`,
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch loyalty stats");
    }
    return res.data;
  },

  /**
   * Get a specific loyalty request detail
   */
  async getLoyaltyRequestDetail(id: string): Promise<ApiResponse<CustomerLoyaltyRequest>> {
    const res = await api.get(`/loyalty-requests/${id}`);
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch loyalty request");
    }
    return res.data;
  },
};
