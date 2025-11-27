'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

// Form validation schema
const addSessionSchema = z.object({
  name: z
    .string()
    .min(1, 'Session name is required')
    .max(50, 'Session name must be less than 50 characters'),
});

type AddSessionForm = z.infer<typeof addSessionSchema>;

interface AddSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string }) => Promise<void>;
  isLoading: boolean;
  existingSessionCount: number;
}

export function AddSessionModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  existingSessionCount,
}: AddSessionModalProps) {
  const form = useForm<AddSessionForm>({
    resolver: zodResolver(addSessionSchema),
    defaultValues: {
      name: `Day ${existingSessionCount + 1}`,
    },
  });

  const handleSubmit = async (data: AddSessionForm) => {
    try {
      await onSubmit(data);
      form.reset({ name: `Day ${existingSessionCount + 2}` });
      onOpenChange(false);
    } catch {
      // Error handled by parent
    }
  };

  // Reset form when modal opens with new default
  const handleOpenChange = (open: boolean) => {
    if (open) {
      form.reset({ name: `Day ${existingSessionCount + 1}` });
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Session</DialogTitle>
          <DialogDescription>
            Create a new training session for your program.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Push Day, Upper Body A"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Session
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
