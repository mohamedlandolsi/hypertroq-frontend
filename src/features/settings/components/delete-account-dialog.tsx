'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

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
import { deleteAccount } from '@/features/auth/api/auth-service';
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
    onSuccess: () => {
      toast.success('Your account has been deleted. Goodbye!');
      // Logout and redirect to login
      logout();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete account');
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
            This action is <strong>permanent and irreversible</strong>. All your
            data, including programs, exercises, and settings will be deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive font-medium">
            ⚠️ Warning: This cannot be undone!
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
              {mutation.isPending ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
