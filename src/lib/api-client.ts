/**
 * API Client for HypertroQ Backend
 * 
 * Production-ready axios-based HTTP client with:
 * - Automatic JWT token injection
 * - 401 handling with redirect to login
 * - Toast notifications for errors
 * - Type-safe request/response handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import type { APIErrorResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

/**
 * Set authentication tokens in localStorage
 */
export function setAuthToken(accessToken: string, refreshToken?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
}

/**
 * Remove authentication tokens from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

/**
 * Redirect to login page (client-side only)
 */
function redirectToLogin(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

/**
 * Parse error message from API response
 */
function parseErrorMessage(error: AxiosError<APIErrorResponse>): string {
  if (!error.response?.data?.detail) {
    return error.message || 'An unexpected error occurred';
  }

  const { detail } = error.response.data;

  // Handle FastAPI validation errors (array format)
  if (Array.isArray(detail)) {
    return detail.map((err) => err.msg).join(', ');
  }

  // Handle simple string error
  return detail;
}

/**
 * Create axios instance with base configuration
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Request Interceptor: Inject Authorization header
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Handle errors globally
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Success response - pass through
    return response;
  },
  (error: AxiosError<APIErrorResponse>) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      removeAuthToken();
      toast.error('Session expired. Please login again.');
      redirectToLogin();
      return Promise.reject(new APIError('Unauthorized', 401));
    }

    // Handle other errors with toast notification
    const errorMessage = parseErrorMessage(error);
    const status = error.response?.status || 500;

    // Show toast for client-side errors
    if (typeof window !== 'undefined') {
      toast.error(errorMessage);
    }

    return Promise.reject(
      new APIError(errorMessage, status, error.response?.data)
    );
  }
);

/**
 * API Client - Main export
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T>(url: string, config = {}) =>
    axiosInstance.get<T>(url, config).then((res) => res.data),

  /**
   * POST request
   */
  post: <T>(url: string, data?: unknown, config = {}) =>
    axiosInstance.post<T>(url, data, config).then((res) => res.data),

  /**
   * PUT request
   */
  put: <T>(url: string, data?: unknown, config = {}) =>
    axiosInstance.put<T>(url, data, config).then((res) => res.data),

  /**
   * PATCH request
   */
  patch: <T>(url: string, data?: unknown, config = {}) =>
    axiosInstance.patch<T>(url, data, config).then((res) => res.data),

  /**
   * DELETE request
   */
  delete: <T>(url: string, config = {}) =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
};

/**
 * Export axios instance for advanced usage
 */
export default axiosInstance;
