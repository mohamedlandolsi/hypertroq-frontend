/**
 * Authentication Hook
 * 
 * Convenience hook for accessing auth state and actions
 */

import { useAuthStore } from '../store/auth-store';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const loadProfile = useAuthStore((state) => state.loadProfile);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    loadProfile,
  };
}
