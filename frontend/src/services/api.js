import axios from 'axios';
import { API_BASE_URL } from './apiBaseUrl';
import { useAuthStore } from '../context/authStore';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = String(error.config?.url || '');

      // Si falla un endpoint de auth (login/recover/reset), no forzar logout/redirect.
      // Dejamos que la pantalla actual muestre el mensaje de error correspondiente.
      if (requestUrl.includes('/auth/')) {
        return Promise.reject(error);
      }

      // Token inválido o expirado: limpiar estado y navegar dentro del SPA
      const previousUserType = localStorage.getItem('userType');
      const currentPath = window.location.pathname || '';
      useAuthStore.getState().logout();

      const isAdminAuthAttempt = requestUrl.includes('/auth/admin/login');
      const isInAdminAccess = currentPath.startsWith('/acceso-admin') || currentPath.startsWith('/admin');
      const targetPath =
        isAdminAuthAttempt || isInAdminAccess || previousUserType === 'admin'
          ? '/acceso-admin'
          : '/login';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
