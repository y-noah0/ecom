import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL =  'http://localhost:5000';

export const useProduct = () => {
  const queryClient = useQueryClient();

  // Fetch all products
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/products`);
      return response.data;
    },
  });

  // Fetch single product
  const useGetProduct = (id) => {
    return useQuery({
      queryKey: ['product', id],
      queryFn: async () => {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        return response.data;
      },
    });
  };

  // Create new product
  const createProduct = useMutation({
    mutationFn: async (productData) => {
      const response = await axios.post(`${API_URL}/api/products`, productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });

  // Update product
  const updateProduct = useMutation({
    mutationFn: async ({ id, productData }) => {
      const response = await axios.put(`${API_URL}/api/products/${id}`, productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });

  // Delete product
  const deleteProduct = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`${API_URL}/api/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });

  return {
    products,
    isLoading,
    error,
    useGetProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};