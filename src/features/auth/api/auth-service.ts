/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls.
 * Note: Login uses form-urlencoded, not JSON!
 */

import axiosInstance from '@/lib/api-client';
import type { User, AuthTokens } from '@/types';

export interface LoginCredentials {
  username: string; // FastAPI OAuth2 expects 'username' field (email)
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  organization_name: string;
}

/**
 * Login user with form-urlencoded data
 * POST /auth/login
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthTokens> {
  // Convert to form-urlencoded format
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await axiosInstance.post<AuthTokens>('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
}

/**
 * Register new user with JSON data
 * POST /auth/register
 */
export async function registerUser(data: RegisterData): Promise<User> {
  const response = await axiosInstance.post<User>('/auth/register', data);
  return response.data;
}

/**
 * Get current user profile
 * GET /users/me
 */
export async function getCurrentUserProfile(): Promise<User> {
  const response = await axiosInstance.get<User>('/users/me');
  return response.data;
}

/**
 * Logout (client-side only - clears tokens)
 */
export async function logoutUser(): Promise<void> {
  // Optional: Call backend logout endpoint if it exists
  // await axiosInstance.post('/auth/logout');
}
