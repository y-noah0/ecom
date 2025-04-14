import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { userService } from '../Services/Api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DataPersistenceManager from '../utils/DataPersistenceManager';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleError = (error, defaultMessage) => {
    const message = error.response?.data?.message || error.message || defaultMessage;
    setError(message);
    toast.error(message);
    throw error;
  };

  const handleAuthSuccess = async () => {
    queryClient.invalidateQueries(['user']);
    await DataPersistenceManager.handleAuthStateChange(true);
    navigate('/');
  };

  const login = useMutation({
    mutationFn: async (credentials) => {
      try {
        const response = await userService.login(credentials);
        toast.success('Successfully logged in');
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } catch (error) {
        handleError(error, 'Login failed. Please check your credentials.');
      }
    },
    onSuccess: handleAuthSuccess
  });

  const googleLogin = useMutation({
    mutationFn: async (token) => {
      try {
        const response = await userService.googleLogin(token);
        toast.success('Successfully logged in with Google');
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } catch (error) {
        handleError(error, 'Google login failed. Please try again.');
      }
    },
    onSuccess: handleAuthSuccess
  });

  const register = useMutation({
    mutationFn: async (userData) => {
      try {
        const response = await userService.register(userData);
        toast.success('Successfully registered! Please check your email for verification.');
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } catch (error) {
        handleError(error, 'Registration failed. Please try again.');
      }
    },
    onSuccess: handleAuthSuccess
  });

  const updateProfile = useMutation({
    mutationFn: async (userData) => {
      try {
        const response = await userService.updateProfile(userData);
        toast.success('Profile updated successfully');
        return response.data;
      } catch (error) {
        handleError(error, 'Failed to update profile.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
    }
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        if (!getCurrentUser()) return null;
        const response = await userService.getProfile();
        return response.data;
      } catch (error) {
        handleError(error, 'Failed to fetch user profile.');
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });

  const logout = () => {
    try {
      localStorage.removeItem('user');
      queryClient.clear();
      toast.success('Successfully logged out');
      navigate('/signin');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  // Effect to handle initial auth state
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      DataPersistenceManager.handleAuthStateChange(true);
    }
  }, []);

  return {
    login,
    googleLogin,
    register,
    updateProfile,
    logout,
    getCurrentUser,
    profile,
    error,
    clearError: () => setError(null),
    isAuthenticated: !!getCurrentUser(),
    isLoading: login.isLoading || googleLogin.isLoading || register.isLoading || updateProfile.isLoading || profileLoading
  };
};