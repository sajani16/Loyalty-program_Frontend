import api from "@/lib/api";
import { ApiResponse } from "./auth.service";

export interface BusinessProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
}

export interface BusinessCustomerRecord {
  _id: string;
  customerId: {
    _id: string;
    name: string;
    email: string;
  };
  points: number;
  tier: string;
  status: string;
  joinedAt: string;
}

export interface LoyaltyRequestItem {
  _id: string;
  businessCustomerId: {
    _id: string;
    customerId?: {
      _id: string;
      name: string;
      email: string;
    };
  };
  status: string;
  createdAt: string;
  expiresAt: string;
}

export const merchantService = {
  async getMyBusiness(): Promise<ApiResponse<BusinessProfile>> {
    const res = await api.get("/businesses/me");
    return res.data;
  },

  async getBusinessCustomers(): Promise<ApiResponse<BusinessCustomerRecord[]>> {
    const res = await api.get("/memberships/business/customers");
    return res.data;
  },

  async getPendingRequests(): Promise<ApiResponse<LoyaltyRequestItem[]>> {
    const res = await api.get("/loyalty-requests/business/all");
    return res.data;
  },

  async completeRequest(id: string): Promise<ApiResponse> {
    const res = await api.patch(`/loyalty-requests/${id}/complete`);
    return res.data;
  },

  async rejectRequest(id: string): Promise<ApiResponse> {
    const res = await api.patch(`/loyalty-requests/${id}/reject`);
    return res.data;
  },
};
