import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loyaltyService } from "@/services/loyalty.service";
import { customerService } from "@/services/customer.service";

interface ActivityHistoryResponse {
  success: boolean;
  data: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message: string;
}

/**
 * Hook to scan a merchant's QR code and submit a loyalty join request.
 * @param businessId - plain businessId string from scanned QR
 */
export const useScanQRMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (businessId: string) => loyaltyService.scanQR(businessId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customerMemberships"] });
      void queryClient.invalidateQueries({ queryKey: ["businessCards"] });
    },
  });
};

/**
 * Hook to fetch current customer profile
 */
export const useCustomerProfile = () => {
  return useQuery({
    queryKey: ["customerProfile"],
    queryFn: async () => {
      const res = await customerService.getMyCustomer();
      return res.data;
    },
  });
};

/**
 * Hook to update customer profile
 */
export const useUpdateCustomerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; phone?: string }) =>
      customerService.updateMyCustomer(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
    },
  });
};

/**
 * Hook to update customer profile image
 */
export const useUpdateProfileImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => customerService.updateProfileImage(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
    },
  });
};

/**
 * Hook to fetch customer's business memberships
 */
export const useCustomerMemberships = () => {
  return useQuery({
    queryKey: ["customerMemberships"],
    queryFn: async () => {
      const res = await customerService.getMemberships();
      return res.data;
    },
  });
};

/**
 * Hook to fetch customer's business cards (simplified view)
 */
export const useBusinessCards = () => {
  return useQuery({
    queryKey: ["businessCards"],
    queryFn: async () => {
      const res = await customerService.getBusinessCards();
      return res.data;
    },
  });
};

/**
 * Hook to fetch membership detail
 */
export const useMembershipDetail = (membershipId: string) => {
  return useQuery({
    queryKey: ["membership", membershipId],
    queryFn: async () => {
      const res = await customerService.getMembershipDetail(membershipId);
      return res.data;
    },
    enabled: !!membershipId,
  });
};

/**
 * Hook to fetch loyalty stats for a membership
 */
export const useLoyaltyStats = (businessCustomerId: string) => {
  return useQuery({
    queryKey: ["loyaltyStats", businessCustomerId],
    queryFn: async () => {
      const res = await loyaltyService.getLoyaltyStats(businessCustomerId);
      return res.data;
    },
    enabled: !!businessCustomerId,
  });
};

/**
 * Hook to fetch customer's loyalty requests for a specific business
 */
export const useCustomerLoyaltyRequests = (businessCustomerId: string) => {
  return useQuery({
    queryKey: ["customerLoyaltyRequests", businessCustomerId],
    queryFn: async () => {
      const res = await loyaltyService.getCustomerRequests(businessCustomerId);
      return res.data;
    },
    enabled: !!businessCustomerId,
  });
};

/**
 * Hook to join a business loyalty program
 */
export const useJoinBusinessMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (businessId: string) => customerService.joinBusiness(businessId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customerMemberships"] });
      void queryClient.invalidateQueries({ queryKey: ["businessCards"] });
    },
  });
};

/**
 * Hook to change customer password
 */
export const useChangeCustomerPasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => customerService.changeCustomerPassword(currentPassword, newPassword),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
    },
  });
};

/**
 * Hook to fetch customer's activity history (all loyalty requests)
 * Cached with queryKey ["activityHistory"] for state management
 */
export const useActivityHistory = (page: number = 1, limit: number = 10, status: string = "all") => {
  return useQuery({
    queryKey: ["activityHistory", page, limit, status],
    queryFn: async () => {
      const response = await customerService.getActivityHistory(page, limit, status);
      // Response structure: { success, data: [...], meta: {...}, message }
      console.log("[useActivityHistory] Raw response:", response);
      return response;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
