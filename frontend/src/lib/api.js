export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
export const getToken = () => sessionStorage.getItem('collab-token') || '';
export const apiFetch = (path, options = {}) => fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers, Authorization: `Bearer ${getToken()}` },
});
