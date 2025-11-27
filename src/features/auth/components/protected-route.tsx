/**
 * Protected Route Component
 * 
 * Wrapper component that ensures user is authenticated before rendering children
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, loadProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Try to load profile on mount if token exists
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('access_token') 
      : null;

    if (token && !isAuthenticated && !isLoading) {
      loadProfile()
        .then((loadedUser) => {
          // Check if user has pending deletion
          if (loadedUser.deletion_requested_at) {
            router.push('/account-recovery');
          }
        })
        .catch(() => {
          // Profile load failed, redirect to login
          router.push(redirectTo);
        });
    } else if (!token && !isAuthenticated) {
      // No token, redirect immediately
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, loadProfile, router, redirectTo]);

  // Check if authenticated user has pending deletion
  useEffect(() => {
    if (isAuthenticated && user?.deletion_requested_at) {
      router.push('/account-recovery');
    }
  }, [isAuthenticated, user, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated, will redirect
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated, render children
  return <>{children}</>;
}
