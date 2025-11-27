'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateProgram } from '../hooks/use-programs';
import type { SplitType, StructureType } from '../types';
import { SPLIT_TYPES, SPLIT_TYPE_LABELS } from '../types';

// Form validation schema
const createProgramSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  split_type: z.enum(SPLIT_TYPES),
  structure_type: z.enum(['WEEKLY', 'CYCLIC'] as const),
});

type CreateProgramForm = z.infer<typeof createProgramSchema>;

interface CreateProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProgramModal({
  open,
  onOpenChange,
}: CreateProgramModalProps) {
  const router = useRouter();
  const createProgram = useCreateProgram();

  const form = useForm<CreateProgramForm>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      name: '',
      description: '',
      split_type: 'UPPER_LOWER',
      structure_type: 'WEEKLY',
    },
  });

  const onSubmit = async (data: CreateProgramForm) => {
    try {
      const program = await createProgram.mutateAsync(data);
      onOpenChange(false);
      form.reset();
      // Redirect to program editor
      router.push(`/programs/${program.id}/edit`);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Program</DialogTitle>
          <DialogDescription>
            Set up the basics for your training program. You can add sessions
            and exercises after creating it.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Program Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., My Upper/Lower Split"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your training goals for this program..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Split Type */}
            <FormField
              control={form.control}
              name="split_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a split type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SPLIT_TYPES.map((split) => (
                        <SelectItem key={split} value={split}>
                          {SPLIT_TYPE_LABELS[split]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How you want to organize your training days
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Structure Type - Radio Cards */}
            <FormField
              control={form.control}
              name="structure_type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Schedule Structure</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Weekly Option */}
                      <button
                        type="button"
                        onClick={() => field.onChange('WEEKLY')}
                        className={cn(
                          'flex flex-col items-center gap-3 rounded-lg border-2 p-4 text-center transition-all hover:border-primary/50',
                          field.value === 'WEEKLY'
                            ? 'border-primary bg-primary/5'
                            : 'border-muted'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-full',
                            field.value === 'WEEKLY'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium">Weekly</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Fixed days each week
                          </p>
                          <p className="text-xs text-muted-foreground">
                            (e.g., Mon/Wed/Fri)
                          </p>
                        </div>
                      </button>

                      {/* Cyclic Option */}
                      <button
                        type="button"
                        onClick={() => field.onChange('CYCLIC')}
                        className={cn(
                          'flex flex-col items-center gap-3 rounded-lg border-2 p-4 text-center transition-all hover:border-primary/50',
                          field.value === 'CYCLIC'
                            ? 'border-primary bg-primary/5'
                            : 'border-muted'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-full',
                            field.value === 'CYCLIC'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          <RefreshCw className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium">Cyclic</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Repeating pattern
                          </p>
                          <p className="text-xs text-muted-foreground">
                            (e.g., 3 on, 1 off)
                          </p>
                        </div>
                      </button>
                    </div>
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
                disabled={createProgram.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createProgram.isPending}>
                {createProgram.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Program
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
