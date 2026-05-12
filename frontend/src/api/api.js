import axios from 'axios';
const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});
api.interceptors.response.use((res) => res, (err) => {
    if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/auth';
    }
    return Promise.reject(err);
});
export const authApi = {
    register: (name, email, password) => api.post('/auth/register', { name, email, password }),
    login: (email, password) => api.post('/auth/login', { email, password }),
};
export const categoriesApi = {
    getAll: () => api.get('/categories'),
    getItems: (id) => api.get(`/categories/${id}/items`),
};
export const itemsApi = {
    create: (name, category_id) => api.post('/items', { name, category_id }),
    remove: (id) => api.delete(`/items/${id}`),
};
export const spinApi = {
    spin: (categoryId) => api.post(`/spin/${categoryId}`),
    getAi: (historyId) => api.post(`/spin/${historyId}/ai`),
    getHistory: () => api.get('/spin/history'),
};
export const aiApi = {
    generate: (categoryName) => api.post('/ai/generate', { category_name: categoryName }),
};
export const favoritesApi = {
    add: (itemId) => api.post(`/favorites/${itemId}`),
    getAll: () => api.get('/favorites'),
    remove: (itemId) => api.delete(`/favorites/${itemId}`),
};
export const excludedApi = {
    add: (itemId) => api.post(`/excluded/${itemId}`),
    remove: (itemId) => api.delete(`/excluded/${itemId}`),
};
export default api;
