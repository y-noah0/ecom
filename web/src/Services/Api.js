import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message = error.response?.data?.message || 'An error occurred';

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
            refreshToken: user.refreshToken
          });
          
          const { token, refreshToken } = response.data;
          localStorage.setItem('user', JSON.stringify({ ...user, token, refreshToken }));
          
          axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          
          processQueue(null, token);
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('user');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject({
      ...error,
      message
    });
  }
);

// Product Services
export const productService = {
  getAll: () => axiosInstance.get('/products'),
  getById: (id) => axiosInstance.get(`/products/${id}`),
  filter: (params) => axiosInstance.get('/products/filter', { params }),
};

// Category Services
export const categoryService = {
  getAll: () => axiosInstance.get('/categories'),
  getById: (id) => axiosInstance.get(`/categories/${id}`),
};

// Cart Services
export const cartService = {
  getCart: () => axiosInstance.get('/cart'),
  addToCart: (productData) => axiosInstance.post('/cart', productData),
  updateQuantity: (productId, quantity) => 
    axiosInstance.put(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId) => axiosInstance.delete(`/cart/${productId}`),
  clearCart: () => axiosInstance.delete('/cart'),
};

// Enhanced User Services
export const userService = {
  login: (userData) => axiosInstance.post('/users/login', userData),
  register: (userData) => axiosInstance.post('/users/register', userData),
  googleLogin: (token) => axiosInstance.post('/users/google-login', { token }),
  forgotPassword: (email) => axiosInstance.post('/users/forgot-password', { email }),
  resetPassword: (token, newPassword) => 
    axiosInstance.post('/users/reset-password', { token, newPassword }),
  updateProfile: (userData) => axiosInstance.put('/users/profile', userData),
  getProfile: () => axiosInstance.get('/users/profile'),
  verifyEmail: (token) => axiosInstance.post('/users/verify-email', { token }),
  refreshToken: (refreshToken) => 
    axiosInstance.post('/users/refresh-token', { refreshToken }),
  revokeToken: () => axiosInstance.post('/users/revoke-token'),
  changePassword: (passwords) => 
    axiosInstance.post('/users/change-password', passwords),
};

// Promotion Services
export const promotionService = {
  getAll: () => axiosInstance.get('/promotions'),
  getById: (id) => axiosInstance.get(`/promotions/${id}`),
};