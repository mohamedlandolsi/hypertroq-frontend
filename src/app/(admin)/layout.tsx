/**
 * Admin Layout
 * 
 * Protected layout for admin-only routes.
 * Redirects non-admin users to the dashboard.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { Sidebar, MobileSidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Shield, ShieldX } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Wait for auth state to load
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // If authenticated but not admin, redirect to dashboard
    if (user && user.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-violet-500 animate-pulse" />
          </div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or not admin - will redirect
  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center max-w-md px-4">
          <div className="flex justify-center mb-4">
            <ShieldX className="h-16 w-16 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access this area. 
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  // User is admin - render the admin layout
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <div className="md:hidden fixed top-4 left-4 z-50">
          <MobileSidebar />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {/* Admin badge indicator */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 text-sm font-medium">
              <Shield className="h-4 w-4" />
              Admin Dashboard
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
