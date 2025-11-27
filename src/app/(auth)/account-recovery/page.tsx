'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, RefreshCw, LogOut, Calendar, Shield, CheckCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cancelDeletion, getCurrentUserProfile } from '@/features/auth/api/auth-service';
import { useAuthStore } from '@/features/auth/store/auth-store';

export default function AccountRecoveryPage() {
  const router = useRouter();
  const { user, logout, setUser, isAuthenticated } = useAuthStore();
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [deletionDate, setDeletionDate] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand hydration from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Wait for hydration before making decisions
    if (!isHydrated) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // If authenticated but no pending deletion, redirect to dashboard
    if (!user.deletion_requested_at) {
      router.push('/dashboard');
      return;
    }

    // Calculate days remaining
    const requestedAt = new Date(user.deletion_requested_at);
    const deletionDateObj = new Date(requestedAt);
    deletionDateObj.setDate(deletionDateObj.getDate() + 30);
    
    const now = new Date();
    const diffTime = deletionDateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    setDaysRemaining(Math.max(0, diffDays));
    setDeletionDate(deletionDateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, [user, router, isHydrated, isAuthenticated]);

  const cancelMutation = useMutation({
    mutationFn: cancelDeletion,
    onSuccess: async () => {
      // Refresh user profile to get updated deletion status
      const updatedUser = await getCurrentUserProfile();
      setUser(updatedUser);
      
      toast.success('Account restored successfully! Welcome back.', { duration: 5000 });
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to restore account');
    },
  });

  const handleRestore = () => {
    cancelMutation.mutate();
  };

  const handleLogout = () => {
    logout();
  };

  // Show loading while waiting for hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Will redirect via useEffect if conditions aren't met
  if (!isAuthenticated || !user || !user.deletion_requested_at) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-background to-amber-950/10">
      <Card className="w-full max-w-lg border-amber-500/50 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 ring-2 ring-amber-500/50">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Account Pending Deletion</CardTitle>
          <CardDescription className="text-base">
            Your account is scheduled to be permanently deleted
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Countdown Display */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Time Remaining</span>
            </div>
            <div className="text-5xl font-bold text-amber-600 dark:text-amber-400 mb-1">
              {daysRemaining}
            </div>
            <div className="text-sm text-muted-foreground">
              days until permanent deletion
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Scheduled for: <span className="font-medium text-foreground">{deletionDate}</span>
            </div>
          </div>

          {/* What Happens Section */}
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive mb-2">
              After deletion, you will lose:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                All training programs and workout history
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                Custom exercises you&apos;ve created
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                All account data and settings
              </li>
            </ul>
          </div>

          {/* Restore Info */}
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Changed your mind?
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click &quot;Restore Account&quot; to cancel the deletion and continue using HypertroQ.
                  Your data is still safe.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button 
              onClick={handleRestore}
              disabled={cancelMutation.isPending}
              className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
            >
              {cancelMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Restore My Account
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full"
              disabled={cancelMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout and Keep Deletion Scheduled
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            If you have questions, contact support before your account is deleted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
