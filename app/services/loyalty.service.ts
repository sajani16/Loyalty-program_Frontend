import api from "@/lib/api";
import { ApiResponse } from "./auth.service";

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
  async getCustomerRequests(businessCustomerId: string): Promise<ApiResponse> {
    const res = await api.get(
      `/loyalty-requests/customer/${businessCustomerId}`,
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch loyalty requests");
    }
    return res.data;
  },
};
