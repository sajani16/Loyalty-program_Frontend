import api from "@/lib/api";
import { ApiResponse } from "./auth.service";

export interface BusinessProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  businessLogo?: string;
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
  stampCards?: Array<{
    productId: {
      _id: string;
      name: string;
      price: number;
      stampTarget: number;
      stampEligible: boolean;
      isActive: boolean;
    };
    progress: number;
    completedCards: number;
  }>;
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
    tier?: string;
    points?: number;
  };
  products: Array<{
    productId: string | { name: string; price: number; stampTarget?: number };
    stamps: number;
  }>;
  status: string;
  amountSpent?: number;
  pointsAwarded?: number;
  stampsAwarded?: number;
  createdAt: string;
  expiresAt: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  type: "points" | "stamps";
  pointsValue?: number;
  stampsValue?: number;
  stampsRequired?: number;
  stampEligible?: boolean;
  stampTarget?: number;
  rewardQuantity?: number;
  description?: string;
  isActive?: boolean;
}

export interface CustomerActivityItem {
  _id: string;
  status: string;
  amountSpent?: number;
  pointsAwarded?: number;
  stampsAwarded?: number;
  createdAt: string;
  completedAt?: string;
}

export const merchantService = {
  async getMyBusiness(): Promise<ApiResponse<BusinessProfile>> {
    const res = await api.get("/businesses/me");
    return res.data;
  },

  async updateMyBusiness(
    data: Partial<BusinessProfile>,
  ): Promise<ApiResponse<BusinessProfile>> {
    const res = await api.put("/businesses/me", data);
    return res.data;
  },

  async updateBusinessLogo(file: File): Promise<ApiResponse<BusinessProfile>> {
    const formData = new FormData();
    formData.append("businessLogo", file);
    const res = await api.put("/businesses/me/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async changeBusinessPassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    const res = await api.post("/businesses/me/change-password", {
      currentPassword,
      newPassword,
    });
    return res.data;
  },

  async getBusinessCustomers(): Promise<ApiResponse<BusinessCustomerRecord[]>> {
    const res = await api.get("/memberships/business/customers");
    return res.data;
  },

  async getBusinessCustomerDetail(
    id: string,
  ): Promise<ApiResponse<BusinessCustomerRecord>> {
    const res = await api.get(`/memberships/business/customers/${id}`);
    return res.data;
  },

  async approveMembership(id: string): Promise<ApiResponse> {
    const res = await api.patch(
      `/memberships/business/customers/${id}/approve`,
    );
    return res.data;
  },

  async rejectMembership(id: string): Promise<ApiResponse> {
    const res = await api.patch(`/memberships/business/customers/${id}/reject`);
    return res.data;
  },

  async getPendingRequests(
    status: string = "pending",
  ): Promise<ApiResponse<LoyaltyRequestItem[]>> {
    const params = new URLSearchParams({ status });
    const res = await api.get(`/loyalty-requests/business/all?${params}`);
    return res.data;
  },

  async getAllLoyaltyRequests(
    page: number = 1,
    limit: number = 10,
    status: string = "all",
  ): Promise<ApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status !== "all" && { status }),
    });
    const res = await api.get(`/loyalty-requests/business/all?${params}`);
    return res.data;
  },

  async getLoyaltyRequestDetail(
    id: string,
  ): Promise<ApiResponse<LoyaltyRequestItem>> {
    const res = await api.get(`/loyalty-requests/${id}`);
    return res.data;
  },

  async completeRequest(
    id: string,
    payload: {
      type: "point" | "stamp";
      amountSpent?: number;
      products?: Array<{
        productId: string;
        stamps: number;
      }>;
    },
  ): Promise<ApiResponse> {
    const res = await api.patch(`/loyalty-requests/${id}/complete`, payload);
    return res.data;
  },

  async addProductsToRequest(
    id: string,
    products: Array<{
      productId: string;
      productName: string;
      unitPrice: number;
      quantity: number;
    }>,
  ): Promise<ApiResponse> {
    const res = await api.patch(`/loyalty-requests/${id}/add-products`, {
      products,
    });
    return res.data;
  },

  async rejectRequest(id: string): Promise<ApiResponse> {
    const res = await api.patch(`/loyalty-requests/${id}/reject`);
    return res.data;
  },

  async createLoyaltyRequest(businessCustomerId: string): Promise<ApiResponse> {
    const res = await api.post("/loyalty-requests", { businessCustomerId });
    return res.data;
  },

  async getBusinessProducts(): Promise<ApiResponse<Product[]>> {
    const res = await api.get("/products");
    return res.data;
  },

  async getActiveProductsForDropdown(): Promise<ApiResponse<Product[]>> {
    const res = await api.get("/products/dropdown/active");
    return res.data;
  },

  async getStampEligibleProducts(): Promise<ApiResponse<Product[]>> {
    const res = await api.get("/products/stamps/eligible");
    return res.data;
  },

  async getCustomerLoyaltyHistory(
    businessCustomerId: string,
  ): Promise<ApiResponse<CustomerActivityItem[]>> {
    const res = await api.get(
      `/loyalty-requests/business/customer/${businessCustomerId}`,
    );
    return res.data;
  },

  async createProduct(
    data: Omit<Product, "_id">,
  ): Promise<ApiResponse<Product>> {
    const res = await api.post("/products", data);
    return res.data;
  },

  async updateProduct(
    id: string,
    data: Partial<Product>,
  ): Promise<ApiResponse<Product>> {
    const res = await api.patch(`/products/${id}`, data);
    return res.data;
  },

  async deleteProduct(id: string): Promise<ApiResponse> {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  async toggleProduct(
    id: string,
    isActive: boolean,
  ): Promise<ApiResponse<Product>> {
    const res = await api.patch(`/products/${id}/toggle`, { isActive });
    return res.data;
  },
};
