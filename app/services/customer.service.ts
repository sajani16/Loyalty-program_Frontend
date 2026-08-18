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
    phone?: string;
  };
  status: "pending" | "active" | "rejected" | "blocked";
  points: number;
  tier: "basic" | "silver" | "gold" | "platinum";
  stampCards?: Array<{
    productId: string;
    progress: number;
    completedCards: number;
  }>;
  joinedAt: string;
}

export interface BusinessCard {
  _id: string;
  businessId: {
    _id: string;
    name: string;
  };
  points: number;
  tier: string;
  status: string;
}

export interface LoyaltyStats {
  totalPoints: number;
  totalStamps: number;
  currentTier: string;
  nextTierThreshold: number;
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

  async getBusinessCards(): Promise<ApiResponse<BusinessCard[]>> {
    const res = await api.get("/memberships/cards");
    return res.data;
  },

  async getMembershipDetail(membershipId: string): Promise<ApiResponse<CustomerMembership>> {
    const res = await api.get(`/memberships/${membershipId}`);
    return res.data;
  },

  async joinBusiness(businessId: string): Promise<ApiResponse> {
    const res = await api.post(`/memberships/join/${businessId}`);
    return res.data;
  },

  async getDashboardData(businessCustomerId: string): Promise<ApiResponse<LoyaltyStats>> {
    const res = await api.get(`/memberships/${businessCustomerId}/dashboard`);
    return res.data;
  },
};
