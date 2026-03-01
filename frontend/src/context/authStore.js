import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      userType: null, // 'user', 'company', 'admin'
      token: null,
      isAuthenticated: false,

      setAuth: (user, userType, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userType', userType);
        set({ user, userType, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        set({ user: null, userType: null, token: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
        localStorage.setItem('user', JSON.stringify({ ...state.user, ...userData }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
