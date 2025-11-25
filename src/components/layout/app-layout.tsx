/**
 * Main Application Layout
 * 
 * Provides the shell structure for authenticated pages
 */

import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* TODO: Add Sidebar */}
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
