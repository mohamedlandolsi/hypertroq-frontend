/**
 * API Client for HypertroQ Backend
 * 
 * Centralized HTTP client with authentication, error handling, and type safety.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

class APIError extends Error {
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
 * Get authentication token from storage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

/**
 * Set authentication token in storage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
}

/**
 * Remove authentication token from storage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

/**
 * Make an authenticated API request
 */
async function fetchAPI<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...rest } = config;

  // Build headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add auth token if required
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Make request
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
  });

  // Handle response
  if (!response.ok) {
    let errorDetails;
    try {
      errorDetails = await response.json();
    } catch {
      errorDetails = { message: response.statusText };
    }

    throw new APIError(
      errorDetails.detail || errorDetails.message || 'An error occurred',
      response.status,
      errorDetails
    );
  }

  // Return parsed JSON or null for 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

/**
 * API Client Methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, config?: RequestConfig) =>
    fetchAPI<T>(endpoint, { ...config, method: 'GET' }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    fetchAPI<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    fetchAPI<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    fetchAPI<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, config?: RequestConfig) =>
    fetchAPI<T>(endpoint, { ...config, method: 'DELETE' }),
};

export { APIError };
