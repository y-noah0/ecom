import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/apiService";

export const useOrder = (filters = {}) => {
  const queryClient = useQueryClient();

  // Fetch all orders with filters
  const {
    data: orderData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 10,
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate.toISOString() }),
        ...(filters.endDate && { endDate: filters.endDate.toISOString() }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.search && { search: filters.search }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder })
      }).toString();

      const response = await orderService.getAll(queryParams);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    },
    keepPreviousData: true, // Keep previous data while fetching new data
    retry: 1, // Retry once if request fails
  });

  // Delete order mutation
  const deleteOrder = useMutation({
    mutationFn: (orderId) => orderService.delete(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (error) => {
      console.error('Delete order error:', error);
      throw error;
    }
  });

  // Update order status mutation
  const updateOrderStatus = useMutation({
    mutationFn: ({ id, status }) => {
      if (!['pending', 'processing', 'shipped', 'filled'].includes(status)) {
        throw new Error('Invalid status value');
      }
      return orderService.updateStatus(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (error) => {
      console.error('Update status error:', error);
      throw error;
    }
  });

  return {
    orders: orderData?.orders || [],
    pagination: orderData?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      hasMore: false,
    },
    isLoading,
    error,
    deleteOrder,
    updateOrderStatus,
    refetch,
  };
};

export const useOrderDetail = (orderId) => {
  const {
    data: order,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await orderService.getOne(orderId);
      if (!response.data) {
        throw new Error('Order not found');
      }
      return response.data;
    },
    enabled: !!orderId,
    retry: 1,
  });

  return {
    order,
    isLoading,
    error,
    refetch
  };
};

export const useLatestOrders = (limit) => {
  const {
    data: orderData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["latestOrders", limit],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: 1,
        limit,
        sortBy: "createdAt",
        sortOrder: "-1"  // Changed to string "-1"
      }).toString();

      const response = await orderService.getAll(queryParams);
      return response.data; // Server already returns {orders, pagination}
    },
    keepPreviousData: true,
    retry: 1,
  });

  return {
    orders: orderData?.orders || [],
    pagination: orderData?.pagination,
    isLoading,
    error,
    refetch
  };
};