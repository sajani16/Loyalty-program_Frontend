import api from "@/lib/api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  userType: string;
  role?: string;
//   phone?: string;
  
//   industry: string;
//   position?: string;
  // jobTitle?: string;
//   googleReview?: string;
//   address?: string;
//   website?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
}

export const authService = {
  async register(data: RegisterData): Promise<ApiResponse> {
    const res = await api.post("/auth/register", data);
    if (!res.data.success) {
      throw new Error(res.data.message || "Registration failed");
    }
    return res.data;
  },
  async login(data: RegisterData): Promise<ApiResponse> {
    const res = await api.post("/auth/login", data);
    if (!res.data.success) {
      throw new Error(res.data.message || "Login failed");
    }
    return res.data;
  },

  async forgotPassword(email: string): Promise<ApiResponse> {
    const res = await api.post("/auth/forgot-password", { email });
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to send reset link");
    }
    return res.data;
  },

  async resetPassword(
    email: string,
    resetToken: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    const res = await api.post("/businesses/auth/reset-password", {
      email,
      resetToken,
      newPassword,
    });
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to reset password");
    }
    return res.data;
  },

  async verifyOtp(email: string, otp: string): Promise<ApiResponse> {
    const res = await api.post("/auth/verify-otp", { email, otp });
    if (!res.data.success) {
      throw new Error(res.data.message || "Verification failed");
    }
    return res.data;
  },

  async resendOtp(email: string): Promise<ApiResponse> {
    const res = await api.post("/businesses/auth/resend-otp", { email });
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to resend code");
    }
    return res.data;
  },
};
