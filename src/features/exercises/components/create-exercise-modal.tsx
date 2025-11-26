'use client';

import { useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useCreateExercise } from '../hooks/use-exercises';
import {
  MUSCLE_GROUPS,
  MUSCLE_GROUP_LABELS,
  EQUIPMENT_OPTIONS,
  DIFFICULTY_LEVELS,
  DIFFICULTY_LABELS,
  type MuscleGroup,
  type DifficultyLevel,
} from '../types';

// Form validation schema
const createExerciseSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  muscle_group: z.enum(MUSCLE_GROUPS, {
    message: 'Please select a muscle group',
  }),
  equipment: z.string().optional(),
  difficulty_level: z.enum(DIFFICULTY_LEVELS).optional(),
});

type CreateExerciseFormData = z.infer<typeof createExerciseSchema>;

interface CreateExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateExerciseModal({ open, onOpenChange }: CreateExerciseModalProps) {
  const createExercise = useCreateExercise();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateExerciseFormData>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: {
      name: '',
      description: '',
      muscle_group: undefined,
      equipment: '',
      difficulty_level: undefined,
    },
  });

  const muscleGroup = watch('muscle_group');
  const equipment = watch('equipment');
  const difficultyLevel = watch('difficulty_level');

  const onSubmit = async (data: CreateExerciseFormData) => {
    try {
      await createExercise.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        muscle_group: data.muscle_group as MuscleGroup,
        equipment: data.equipment || undefined,
      });

      // Reset form and close modal on success
      reset();
      onOpenChange(false);
    } catch {
      // Error handling is done by the mutation hook
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Exercise</DialogTitle>
          <DialogDescription>
            Add a custom exercise to your library. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Incline Dumbbell Press"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the exercise, form tips, or notes..."
              rows={3}
              {...register('description')}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Muscle Group Field */}
          <div className="space-y-2">
            <Label htmlFor="muscle_group">
              Muscle Group <span className="text-destructive">*</span>
            </Label>
            <Select
              value={muscleGroup}
              onValueChange={(value) => setValue('muscle_group', value as MuscleGroup)}
            >
              <SelectTrigger id="muscle_group" aria-invalid={!!errors.muscle_group}>
                <SelectValue placeholder="Select muscle group" />
              </SelectTrigger>
              <SelectContent>
                {MUSCLE_GROUPS.map((group) => (
                  <SelectItem key={group} value={group}>
                    {MUSCLE_GROUP_LABELS[group]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.muscle_group && (
              <p className="text-sm text-destructive">{errors.muscle_group.message}</p>
            )}
          </div>

          {/* Equipment Field */}
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment</Label>
            <Select
              value={equipment}
              onValueChange={(value) => setValue('equipment', value)}
            >
              <SelectTrigger id="equipment">
                <SelectValue placeholder="Select equipment (optional)" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_OPTIONS.map((equip) => (
                  <SelectItem key={equip} value={equip}>
                    {equip}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Level Field */}
          <div className="space-y-2">
            <Label htmlFor="difficulty_level">Difficulty Level</Label>
            <Select
              value={difficultyLevel}
              onValueChange={(value) => setValue('difficulty_level', value as DifficultyLevel)}
            >
              <SelectTrigger id="difficulty_level">
                <SelectValue placeholder="Select difficulty (optional)" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {DIFFICULTY_LABELS[level]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createExercise.isPending}>
              {(isSubmitting || createExercise.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Exercise
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
