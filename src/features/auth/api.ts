/**
 * Auth API Functions
 */

import { api } from '@/lib/api-client';
import type { User, AuthTokens } from '@/types';

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  organization_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterData) =>
    api.post<User>('/api/v1/auth/register', data, { requiresAuth: false }),

  login: (data: LoginData) =>
    api.post<AuthTokens>('/api/v1/auth/login', data, { requiresAuth: false }),

  getCurrentUser: () =>
    api.get<User>('/api/v1/auth/me'),

  logout: () => {
    // Client-side logout
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  },
};
