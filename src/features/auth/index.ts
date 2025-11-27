/**
 * Authentication Feature
 *
 * Handles user authentication, registration, and session management.
 */

// API - use auth-service as the primary source
export {
  loginUser,
  registerUser,
  getCurrentUserProfile,
  logoutUser,
  type LoginCredentials,
  type RegisterData,
} from './api/auth-service';

// Legacy API - export the api object for backward compatibility
export { authApi } from './api';

// Store
export * from './store/auth-store';

// Hooks
export * from './hooks/use-auth';

// Components
export * from './components';
