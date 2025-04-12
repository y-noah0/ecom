import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  return user ? { Authorization: `Bearer ${user.token}` } : {};
};

// User Services
export const userService = {
  login: (userData) => axios.post(`${API_BASE_URL}/users/login`, userData),
  register: (userData) => axios.post(`${API_BASE_URL}/users/register`, userData),
  getAll: () => axios.get(`${API_BASE_URL}/users/all-users`, { headers: getAuthHeaders() }),
  getById: (id) => axios.get(`${API_BASE_URL}/users/${id}`, { headers: getAuthHeaders() }),
  update: (id, userData) => axios.put(`${API_BASE_URL}/users/${id}`, userData, { headers: getAuthHeaders() }),
  delete: (id) => axios.delete(`${API_BASE_URL}/users/${id}`, { headers: getAuthHeaders() }),
};

// Product Services
export const productService = {
  getAll: () => axios.get(`${API_BASE_URL}/products`),
  getById: (id) => axios.get(`${API_BASE_URL}/products/${id}`),
  create: (productData) => axios.post(`${API_BASE_URL}/products`, productData, { headers: getAuthHeaders() }),
  update: (id, productData) => axios.put(`${API_BASE_URL}/products/${id}`, productData, { headers: getAuthHeaders() }),
  delete: (id) => axios.delete(`${API_BASE_URL}/products/${id}`, { headers: getAuthHeaders() }),
};

// Order Services
export const orderService = {
  getAll: () => axios.get(`${API_BASE_URL}/orders`, { headers: getAuthHeaders() }),
  getById: (id) => axios.get(`${API_BASE_URL}/orders/${id}`, { headers: getAuthHeaders() }),
  create: (orderData) => axios.post(`${API_BASE_URL}/orders`, orderData, { headers: getAuthHeaders() }),
  update: (id, orderData) => axios.put(`${API_BASE_URL}/orders/${id}`, orderData, { headers: getAuthHeaders() }),
  delete: (id) => axios.delete(`${API_BASE_URL}/orders/${id}`, { headers: getAuthHeaders() }),
};

// Category Services
export const categoryService = {
  getAll: () => axios.get(`${API_BASE_URL}/categories`),
  getById: (id) => axios.get(`${API_BASE_URL}/categories/${id}`),
  create: (categoryData) => axios.post(`${API_BASE_URL}/categories`, categoryData, { headers: getAuthHeaders() }),
  update: (id, categoryData) => axios.put(`${API_BASE_URL}/categories/${id}`, categoryData, { headers: getAuthHeaders() }),
  delete: (id) => axios.delete(`${API_BASE_URL}/categories/${id}`, { headers: getAuthHeaders() }),
};

// Cart Services
export const cartService = {
  getCart: () => axios.get(`${API_BASE_URL}/cart`, { headers: getAuthHeaders() }),
  addToCart: (productData) => axios.post(`${API_BASE_URL}/cart`, productData, { headers: getAuthHeaders() }),
  updateQuantity: (productId, quantity) => axios.put(`${API_BASE_URL}/cart/${productId}`, { quantity }, { headers: getAuthHeaders() }),
  removeFromCart: (productId) => axios.delete(`${API_BASE_URL}/cart/${productId}`, { headers: getAuthHeaders() }),
  clearCart: () => axios.delete(`${API_BASE_URL}/cart`, { headers: getAuthHeaders() }),
};

// Promotion Services
export const promotionService = {
  getAll: () => axios.get(`${API_BASE_URL}/promotions`),
  getById: (id) => axios.get(`${API_BASE_URL}/promotions/${id}`),
  create: (promotionData) => axios.post(`${API_BASE_URL}/promotions`, promotionData, { headers: getAuthHeaders() }),
  update: (id, promotionData) => axios.put(`${API_BASE_URL}/promotions/${id}`, promotionData, { headers: getAuthHeaders() }),
  delete: (id) => axios.delete(`${API_BASE_URL}/promotions/${id}`, { headers: getAuthHeaders() }),
};