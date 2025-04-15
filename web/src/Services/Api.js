import axios from "axios";
import SessionManager from "../utils/SessionManager";

const API_BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = SessionManager.getStoredUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = SessionManager.getStoredUser();
        if (!user?.refreshToken) throw new Error("No refresh token");

        const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
          refreshToken: user.refreshToken
        });

        const { token, refreshToken } = response.data;
        const updatedUser = { ...user, token, refreshToken };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        SessionManager.handleSessionExpired();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
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

// User Services
export const userService = {
  login: (userData) => axiosInstance.post("/users/login", userData),
  register: (userData) => axiosInstance.post("/users/register", userData),
  googleLogin: (token) => axiosInstance.post("/users/google-login", { token }),
  getProfile: () => axiosInstance.get("/users/profile"),
  updateProfile: (userData) => axiosInstance.put("/users/profile", userData),
  forgotPassword: (email) => axiosInstance.post("/users/forgot-password", { email }),
  resetPassword: (token, newPassword) => 
    axiosInstance.post("/users/reset-password", { token, newPassword }),
  verifyEmail: (token) => axiosInstance.post("/users/verify-email", { token }),
  getOrders: () => axiosInstance.get("/orders/my-orders"),
};

// Order Services
export const orderService = {
  getAll: (queryString) => axiosInstance.get(`/orders?${queryString}`),
  getOne: (id) => axiosInstance.get(`/orders/${id}`),
  create: (orderData) => axiosInstance.post('/orders', orderData),
  updateStatus: (id, statusData) => axiosInstance.patch(`/orders/${id}/status`, statusData),
};

// Promotion Services
export const promotionService = {
  getAll: () => axiosInstance.get('/promotions'),
  getById: (id) => axiosInstance.get(`/promotions/${id}`),
};

export default axiosInstance;