import api from "@/lib/api";
import { ApiResponse } from "./auth.service";

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
}

export interface CustomerMembership {
  _id: string;
  businessId: {
    _id: string;
    name: string;
    email?: string;
  };
  points: number;
  tier: string;
  status: string;
  joinedAt: string;
}

export const customerService = {
  async getMyCustomer(): Promise<ApiResponse<CustomerProfile>> {
    const res = await api.get("/customers/me");
    return res.data;
  },

  async getMemberships(): Promise<ApiResponse<CustomerMembership[]>> {
    const res = await api.get("/memberships");
    return res.data;
  },

  async getBusinessCards(): Promise<ApiResponse> {
    const res = await api.get("/memberships/cards");
    return res.data;
  },
};
