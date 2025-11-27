/**
 * Auth API Functions (Legacy)
 * 
 * @deprecated Use auth-service.ts instead for new code
 */

import { apiClient, setAuthToken, removeAuthToken } from '@/lib/api-client';
import type { User, AuthTokens } from '@/types';

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: { email: string; password: string; full_name: string; organization_name: string }) =>
    apiClient.post<User>('/auth/register', data),

  login: async (data: LoginData) => {
    const response = await apiClient.post<AuthTokens>('/auth/login', {
      username: data.email, // FastAPI OAuth2 uses 'username' field
      password: data.password,
    });

    // Store tokens
    setAuthToken(response.access_token, response.refresh_token);

    return response;
  },

  getCurrentUser: () => apiClient.get<User>('/users/me'),

  logout: () => {
    removeAuthToken();
    // Optional: Call backend logout endpoint if implemented
  },
};
