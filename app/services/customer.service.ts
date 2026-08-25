import api from "@/lib/api";
import { ApiResponse } from "./auth.service";

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  profileImage?: string;
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
    productId:
      | string
      | {
          _id: string;
          name: string;
          price?: number;
          stampEligible?: boolean;
          stampTarget?: number;
          rewardQuantity?: number;
          isActive?: boolean;
        };
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

  async updateMyCustomer(data: {
    name?: string;
    phone?: string;
  }): Promise<ApiResponse<CustomerProfile>> {
    const res = await api.put("/customers/me", data);
    return res.data;
  },

  async updateProfileImage(file: File): Promise<ApiResponse<CustomerProfile>> {
    const formData = new FormData();
    formData.append("profileImage", file);
    const res = await api.put("/customers/me/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async changeCustomerPassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    const res = await api.post("/customers/me/change-password", {
      currentPassword,
      newPassword,
    });
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

  async getMembershipDetail(
    membershipId: string,
  ): Promise<ApiResponse<CustomerMembership>> {
    const res = await api.get(`/memberships/${membershipId}`);
    return res.data;
  },

  async joinBusiness(businessId: string): Promise<ApiResponse> {
    const res = await api.post(`/memberships/join/${businessId}`);
    return res.data;
  },

  async getDashboardData(
    businessCustomerId: string,
  ): Promise<ApiResponse<LoyaltyStats>> {
    const res = await api.get(`/memberships/${businessCustomerId}/dashboard`);
    return res.data;
  },

  async getActivityHistory(
    page: number = 1,
    limit: number = 10,
    status: string = "all",
  ): Promise<ApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status !== "all" && { status }),
    });
    const res = await api.get(`/customers/me/activity-history?${params}`);
    return res.data;
  },
};
