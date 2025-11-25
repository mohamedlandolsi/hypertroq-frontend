/**
 * Auth Components
 * 
 * Reusable authentication components (LoginForm, RegisterForm, etc.)
 */

'use client';

import { useAuth } from './hooks/use-auth';

export * from './components/protected-route';

/**
 * Example: Simple auth status component
 * This demonstrates how to use the auth store
 */
export function AuthStatus() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.full_name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

/**
 * TODO: Implement LoginForm component
 * 
 * Usage:
 * const { login, isLoading } = useAuth();
 * 
 * const handleSubmit = async (e) => {
 *   e.preventDefault();
 *   await login({ username: email, password });
 * };
 */

/**
 * TODO: Implement RegisterForm component
 * 
 * Usage:
 * const { register, isLoading } = useAuth();
 * 
 * const handleSubmit = async (e) => {
 *   e.preventDefault();
 *   await register({ email, password, full_name, organization_name });
 * };
 */
