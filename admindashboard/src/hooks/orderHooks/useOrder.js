import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/apiService";

export const useOrder = () => {
  const queryClient = useQueryClient();

  // Fetch all orders
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await orderService.getAll();
      return response.data;
    },
  });

  // Delete order mutation
  const deleteOrder = useMutation({
    mutationFn: (orderId) => orderService.delete(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });

  // Update order mutation
  const updateOrder = useMutation({
    mutationFn: ({ id, orderData }) => orderService.update(id, orderData),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });

  return {
    orders,
    isLoading,
    error,
    deleteOrder,
    updateOrder,
  };
};