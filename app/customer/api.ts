import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loyaltyService } from "@/services/loyalty.service";
import { customerService } from "@/services/customer.service";

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
