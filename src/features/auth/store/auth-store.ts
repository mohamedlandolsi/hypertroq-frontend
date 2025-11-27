/**
 * Authentication Store
 * 
 * Zustand store for managing authentication state.
 * Handles login, register, logout, and profile loading.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { setAuthToken, removeAuthToken } from '@/lib/api-client';
import {
  loginUser,
  registerUser,
  getCurrentUserProfile,
  type LoginCredentials,
  type RegisterData,
} from '../api/auth-service';
import type { User } from '@/types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<User>;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Set loading state
      setLoading: (loading) => set({ isLoading: loading }),

      // Set user (for profile updates)
      setUser: (user) => set({ user }),

      // Login action - returns user for caller to handle redirects
      login: async (credentials) => {
        try {
          set({ isLoading: true });

          // Call login API
          const tokens = await loginUser(credentials);

          // Store tokens
          setAuthToken(tokens.access_token, tokens.refresh_token);

          // Load user profile
          const user = await getCurrentUserProfile();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Return user so caller can check deletion status and redirect appropriately
          return user;
        } catch (error) {
          set({ isLoading: false });
          // Error toast already shown by axios interceptor
          throw error;
        }
      },

      // Register action
      register: async (data) => {
        try {
          set({ isLoading: true });

          // Call register API
          const user = await registerUser(data);

          // After registration, login automatically
          await useAuthStore.getState().login({
            email: data.email,
            password: data.password,
          });

          toast.success('Account created successfully!');
        } catch (error) {
          set({ isLoading: false });
          // Error toast already shown by axios interceptor
          throw error;
        }
      },

      // Logout action
      logout: () => {
        removeAuthToken();
        set({
          user: null,
          isAuthenticated: false,
        });
        toast.info('Logged out successfully');

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      // Load user profile - returns user for caller to handle redirects if needed
      loadProfile: async () => {
        try {
          set({ isLoading: true });

          const user = await getCurrentUserProfile();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return user;
        } catch (error) {
          // If profile load fails, clear auth state
          removeAuthToken();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        // Only persist user and isAuthenticated
        // Don't persist isLoading
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
