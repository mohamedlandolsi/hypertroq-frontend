/**
 * Utility functions for handling avatar URLs.
 * 
 * These functions handle the conversion between backend URLs and frontend-proxied URLs
 * to avoid CORS issues with static files served by the backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
// Extract just the host:port from the API URL
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

/**
 * Converts a profile image URL to the correct format for display.
 * 
 * This handles:
 * - Backend API avatar endpoint: /api/v1/users/{id}/avatar -> full backend URL
 * - Relative uploads URLs: /api/uploads/... -> proxied through frontend
 * - Absolute backend URLs: http://127.0.0.1:8000/uploads/... -> proxied
 * - Production URLs (Google Cloud Storage): https://storage.googleapis.com/... (pass through)
 * - Null/undefined: returns undefined
 * 
 * @param url - The profile image URL from the backend
 * @returns The URL to use in the frontend
 */
export function getAvatarUrl(url: string | null | undefined): string | undefined {
  if (!url) {
    return undefined;
  }

  // Backend API endpoint for avatar - prepend the backend base URL
  // Format: /api/v1/users/{id}/avatar
  if (url.startsWith('/api/v1/users/') && url.includes('/avatar')) {
    return `${BACKEND_BASE_URL}${url}`;
  }

  // Already using frontend proxy for uploads
  if (url.startsWith('/api/uploads/')) {
    return url;
  }

  // Production Google Cloud Storage URLs - pass through
  if (url.startsWith('https://storage.googleapis.com/')) {
    return url;
  }

  // Absolute backend API URLs for avatar - pass through
  if (url.includes('/api/v1/users/') && url.includes('/avatar')) {
    return url;
  }

  // Convert backend absolute upload URLs to use frontend proxy
  // http://127.0.0.1:8000/uploads/... -> /api/uploads/...
  // http://localhost:8000/uploads/... -> /api/uploads/...
  const backendUrlPattern = /^https?:\/\/[^\/]+\/uploads\/(.+)$/;
  const match = url.match(backendUrlPattern);
  if (match) {
    return `/api/uploads/${match[1]}`;
  }

  // Unknown format - return as-is and let it fail gracefully
  console.warn('Unknown avatar URL format:', url);
  return url;
}

/**
 * Adds a cache-busting parameter to a URL.
 * 
 * @param url - The URL to add cache busting to
 * @param key - The cache key (typically a timestamp)
 * @returns The URL with cache busting parameter
 */
export function withCacheBusting(url: string | undefined, key: string | number): string {
  if (!url) {
    return '';
  }
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${key}`;
}
