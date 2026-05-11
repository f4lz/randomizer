import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  },
);

export const authApi = {
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getItems: (id: number) => api.get(`/categories/${id}/items`),
};

export const itemsApi = {
  create: (name: string, category_id: number) =>
    api.post('/items', { name, category_id }),
  remove: (id: number) => api.delete(`/items/${id}`),
};

export const spinApi = {
  spin: (categoryId: number) => api.post(`/spin/${categoryId}`),
  getAi: (historyId: number) => api.post(`/spin/${historyId}/ai`),
  getHistory: () => api.get('/spin/history'),
};

export const aiApi = {
  generate: (categoryName: string) =>
    api.post<{ idea: string }>('/ai/generate', { category_name: categoryName }),
};

export const favoritesApi = {
  add: (itemId: number) => api.post(`/favorites/${itemId}`),
  getAll: () => api.get('/favorites'),
  remove: (itemId: number) => api.delete(`/favorites/${itemId}`),
};

export const excludedApi = {
  add: (itemId: number) => api.post(`/excluded/${itemId}`),
  remove: (itemId: number) => api.delete(`/excluded/${itemId}`),
};

export default api;
