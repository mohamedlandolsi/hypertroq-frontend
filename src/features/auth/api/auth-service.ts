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

export interface UpdateProfileData {
  full_name: string;
  email?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
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
 * Update user profile
 * PUT /users/me
 */
export async function updateUserProfile(data: UpdateProfileData): Promise<User> {
  const response = await axiosInstance.put<User>('/users/me', data);
  return response.data;
}

/**
 * Change user password
 * PUT /users/me/password
 */
export async function changePassword(data: ChangePasswordData): Promise<{ message: string }> {
  const response = await axiosInstance.put<{ message: string }>('/users/me/password', data);
  return response.data;
}

/**
 * Upload user profile image
 * PUT /users/me/image
 */
export async function uploadAvatar(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await axiosInstance.put<User>('/users/me/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export interface DeleteAccountResponse {
  requested_at: string;
  deletion_date: string;
  days_remaining: number;
  message: string;
}

/**
 * Request account deletion (30-day grace period)
 * DELETE /users/me
 */
export async function deleteAccount(): Promise<DeleteAccountResponse> {
  const response = await axiosInstance.delete<DeleteAccountResponse>('/users/me');
  return response.data;
}

/**
 * Cancel account deletion request
 * POST /users/me/cancel-deletion
 */
export async function cancelDeletion(): Promise<{ message: string }> {
  const response = await axiosInstance.post<{ message: string }>('/users/me/cancel-deletion');
  return response.data;
}

/**
 * Logout (client-side only - clears tokens)
 */
export async function logoutUser(): Promise<void> {
  // Optional: Call backend logout endpoint if it exists
  // await axiosInstance.post('/auth/logout');
}
