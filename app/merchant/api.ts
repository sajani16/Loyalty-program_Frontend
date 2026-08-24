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
 * Hook to update business profile
 */
export const useUpdateBusinessProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof merchantService.updateMyBusiness>[0]) =>
      merchantService.updateMyBusiness(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["businessProfile"] });
    },
  });
};

/**
 * Hook to update business logo
 */
export const useUpdateBusinessLogoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => merchantService.updateBusinessLogo(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["businessProfile"] });
    },
  });
};

/**
 * Hook to change business password
 */
export const useChangeBusinessPasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => merchantService.changeBusinessPassword(currentPassword, newPassword),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["businessProfile"] });
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
 * Hook to fetch specific business customer detail
 */
export const useBusinessCustomerDetail = (id: string) => {
  return useQuery({
    queryKey: ["businessCustomer", id],
    queryFn: async () => {
      const res = await merchantService.getBusinessCustomerDetail(id);
      return res.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to approve a membership request
 */
export const useApproveMembershipMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => merchantService.approveMembership(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["businessCustomers"] });
    },
  });
};

/**
 * Hook to reject a membership request
 */
export const useRejectMembershipMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => merchantService.rejectMembership(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["businessCustomers"] });
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
 * Hook to fetch loyalty request detail
 */
export const useLoyaltyRequestDetail = (id: string) => {
  return useQuery({
    queryKey: ["loyaltyRequest", id],
    queryFn: async () => {
      const res = await merchantService.getLoyaltyRequestDetail(id);
      return res.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to add products to a loyalty request
 */
export const useAddProductsToRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      products,
    }: {
      id: string;
      products: Parameters<typeof merchantService.addProductsToRequest>[1];
    }) => merchantService.addProductsToRequest(id, products),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
    },
  });
};

/**
 * Hook to complete a loyalty request
 */
export const useCompleteRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof merchantService.completeRequest>[1];
    }) => merchantService.completeRequest(id, payload),
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

/**
 * Hook to fetch business products
 */
export const useBusinessProducts = () => {
  return useQuery({
    queryKey: ["businessProducts"],
    queryFn: async () => {
      const res = await merchantService.getBusinessProducts();
      return res.data;
    },
  });
};

/**
 * Hook to create a product
 */
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof merchantService.createProduct>[0]) =>
      merchantService.createProduct(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["businessProducts"] });
    },
  });
};

/**
 * Hook to update a product
 */
export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof merchantService.updateProduct>[1];
    }) => merchantService.updateProduct(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["businessProducts"] });
    },
  });
};

/**
 * Hook to delete a product
 */
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => merchantService.deleteProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["businessProducts"] });
    },
  });
};
