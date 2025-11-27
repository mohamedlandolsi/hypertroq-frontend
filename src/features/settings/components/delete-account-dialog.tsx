'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, Calendar } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { deleteAccount, type DeleteAccountResponse } from '@/features/auth/api/auth-service';
import { useAuthStore } from '@/features/auth/store/auth-store';

const deleteAccountSchema = z.object({
  confirmation: z.string().refine((val) => val === 'DELETE', {
    message: 'Please type DELETE to confirm',
  }),
});

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const logout = useAuthStore((state) => state.logout);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      confirmation: '',
    },
  });

  const confirmationValue = watch('confirmation');
  const isDeleteEnabled = confirmationValue === 'DELETE';

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (data: DeleteAccountResponse) => {
      const deletionDate = new Date(data.deletion_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      toast.success(
        `Account deletion scheduled for ${deletionDate}. You have ${data.days_remaining} days to cancel.`,
        { duration: 8000 }
      );
      // Logout and redirect to login
      logout();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to request account deletion');
    },
  });

  const onSubmit = () => {
    mutation.mutate();
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            Request account deletion. Your account will be permanently deleted
            after a 30-day grace period.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-amber-500/50 bg-amber-50 dark:bg-amber-950/30 p-4">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                30-Day Grace Period
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Your account will be scheduled for deletion. You&apos;ll have 30 days to cancel if you change your mind.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive font-medium">
            ⚠️ After the grace period:
          </p>
          <ul className="mt-2 text-sm text-muted-foreground space-y-1">
            <li>• All your training programs will be deleted</li>
            <li>• All your custom exercises will be deleted</li>
            <li>• Your account data will be permanently removed</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <span className="font-mono font-bold">DELETE</span> to
              confirm
            </Label>
            <Input
              id="confirmation"
              placeholder="Type DELETE here"
              {...register('confirmation')}
              className="font-mono"
              autoComplete="off"
            />
            {errors.confirmation && (
              <p className="text-sm text-destructive">
                {errors.confirmation.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!isDeleteEnabled || mutation.isPending}
            >
              {mutation.isPending ? 'Requesting...' : 'Request Deletion'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
