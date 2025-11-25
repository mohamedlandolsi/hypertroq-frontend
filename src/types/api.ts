/**
 * API Type Definitions
 * 
 * Common types for API communication
 */

/**
 * Standard API error response structure
 */
export interface APIErrorResponse {
  detail: string | { msg: string; type: string }[];
  status?: number;
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
