/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls.
 */

import axiosInstance from '@/lib/api-client';
import type { User, AuthTokens } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  organization_name: string;
}

/**
 * Login user with JSON data
 * POST /auth/login
 * 
 * Backend expects: { email: string, password: string }
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthTokens> {
  const response = await axiosInstance.post<AuthTokens>('/auth/login', {
    email: credentials.email,
    password: credentials.password,
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
