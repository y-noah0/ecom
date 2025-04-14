import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../Services/Api';

export const useCart = () => {
  const queryClient = useQueryClient();

  // Get cart
  const { data: cart, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await cartService.getCart();
      return response.data;
    },
    retry: false
  });

  // Add to cart
  const addToCart = useMutation({
    mutationFn: async (productData) => {
      const response = await cartService.addToCart(productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    }
  });

  // Update quantity
  const updateQuantity = useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const response = await cartService.updateQuantity(productId, quantity);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    }
  });

  // Remove from cart
  const removeFromCart = useMutation({
    mutationFn: async (productId) => {
      const response = await cartService.removeFromCart(productId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    }
  });

  // Clear cart
  const clearCart = useMutation({
    mutationFn: async () => {
      const response = await cartService.clearCart();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    }
  });

  return {
    cart,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
};