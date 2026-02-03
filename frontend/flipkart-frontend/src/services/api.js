import axios from 'axios';

const API_BASE = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add user ID to all requests
api.interceptors.request.use((config) => {
  // Use a consistent user ID for the session
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'test-user-123'; // Default test user from seed
    localStorage.setItem('userId', userId);
  }
  config.headers['x-user-id'] = userId;
  return config;
});

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get(`/products/search/${query}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id, params = {}) => api.get(`/categories/${id}`, { params }),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart', { product_id: productId, quantity }),
  update: (cartItemId, quantity) => api.put(`/cart/${cartItemId}`, { quantity }),
  remove: (cartItemId) => api.delete(`/cart/${cartItemId}`),
  clear: () => api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  create: (shippingAddress, paymentMethod = 'COD') => 
    api.post('/orders', { shipping_address: shippingAddress, payment_method: paymentMethod }),
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

export default api;
