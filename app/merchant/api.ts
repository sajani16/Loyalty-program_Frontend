import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { merchantService } from "@/services/merchant.service";

/**
 * Hook to fetch business profile
 */
export const useBusinessProfile = () => {
  return useQuery({
    queryKey: ["businessProfile"],
    queryFn: async () => {
      const res = await merchantService.getMyBusiness();
      return res.data;
    },
  });
};

/**
 * Hook to fetch business customer memberships
 */
export const useBusinessCustomers = () => {
  return useQuery({
    queryKey: ["businessCustomers"],
    queryFn: async () => {
      const res = await merchantService.getBusinessCustomers();
      return res.data;
    },
  });
};

/**
 * Hook to fetch pending loyalty requests for business
 */
export const usePendingRequests = () => {
  return useQuery({
    queryKey: ["pendingRequests"],
    queryFn: async () => {
      const res = await merchantService.getPendingRequests();
      return res.data;
    },
  });
};

/**
 * Hook to approve/complete a loyalty request
 */
export const useCompleteRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => merchantService.completeRequest(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
      void queryClient.invalidateQueries({ queryKey: ["businessCustomers"] });
    },
  });
};

/**
 * Hook to reject a loyalty request
 */
export const useRejectRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => merchantService.rejectRequest(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
    },
  });
};
