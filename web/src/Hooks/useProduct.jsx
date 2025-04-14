import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../Services/Api';

export const useProduct = () => {
  const queryClient = useQueryClient();

  // Get all products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productService.getAll();
      return response.data;
    }
  });

  // Get single product
  const useGetProduct = (id) => {
    return useQuery({
      queryKey: ['product', id],
      queryFn: async () => {
        const response = await productService.getById(id);
        return response.data;
      },
      enabled: !!id
    });
  };

  // Filter products
  const useFilterProducts = (params) => {
    return useQuery({
      queryKey: ['products', params],
      queryFn: async () => {
        const response = await productService.filter(params);
        return response.data;
      },
      enabled: !!params
    });
  };

  return {
    products,
    isLoading,
    error,
    useGetProduct,
    useFilterProducts
  };
};