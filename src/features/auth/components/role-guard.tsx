/**
 * Role-Based Access Control Guard Component
 * 
 * Conditionally renders children based on user's role.
 * Use to hide UI elements from users who don't have permission.
 */

'use client';

import { useAuthStore } from '../store/auth-store';

export type UserRole = 'USER' | 'ADMIN';

interface RoleGuardProps {
  /**
   * Roles that are allowed to see the children
   */
  allowedRoles: UserRole[];
  /**
   * Content to render if user has permission
   */
  children: React.ReactNode;
  /**
   * Optional fallback content to render if user doesn't have permission
   * Defaults to null (render nothing)
   */
  fallback?: React.ReactNode;
}

/**
 * RoleGuard component for conditional rendering based on user role.
 * 
 * @example
 * ```tsx
 * // Only show for admins
 * <RoleGuard allowedRoles={['ADMIN']}>
 *   <AdminDashboardLink />
 * </RoleGuard>
 * 
 * // Show for both users and admins
 * <RoleGuard allowedRoles={['USER', 'ADMIN']}>
 *   <UserContent />
 * </RoleGuard>
 * 
 * // With fallback
 * <RoleGuard allowedRoles={['ADMIN']} fallback={<p>Admin only</p>}>
 *   <AdminPanel />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback = null 
}: RoleGuardProps) {
  const user = useAuthStore((state) => state.user);

  // If no user is logged in, don't render anything
  if (!user) {
    return <>{fallback}</>;
  }

  // Check if user's role is in the allowed roles
  const hasPermission = allowedRoles.includes(user.role);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook to check if current user has a specific role
 */
export function useHasRole(roles: UserRole[]): boolean {
  const user = useAuthStore((state) => state.user);
  
  if (!user) return false;
  
  return roles.includes(user.role);
}

/**
 * Hook to check if current user is an admin
 */
export function useIsAdmin(): boolean {
  return useHasRole(['ADMIN']);
}
