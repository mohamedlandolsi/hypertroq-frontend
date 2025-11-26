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
import { Loader2, Plus, X } from 'lucide-react';
import { useCreateExercise } from '../hooks/use-exercises';
import {
  MUSCLE_GROUPS,
  MUSCLE_GROUP_LABELS,
  EQUIPMENT_OPTIONS,
  EQUIPMENT_LABELS,
  VOLUME_CONTRIBUTIONS,
  VOLUME_CONTRIBUTION_LABELS,
  type MuscleGroup,
  type Equipment,
  type VolumeContribution,
} from '../types';

// Form validation schema
const createExerciseSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  equipment: z.enum(EQUIPMENT_OPTIONS, {
    message: 'Please select equipment type',
  }),
  primary_muscle: z.enum(MUSCLE_GROUPS, {
    message: 'Please select a primary muscle group',
  }),
});

type CreateExerciseFormData = z.infer<typeof createExerciseSchema>;

interface SecondaryMuscle {
  muscle: MuscleGroup;
  contribution: VolumeContribution;
}

interface CreateExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateExerciseModal({ open, onOpenChange }: CreateExerciseModalProps) {
  const createExercise = useCreateExercise();
  const [secondaryMuscles, setSecondaryMuscles] = useState<SecondaryMuscle[]>([]);
  const [newSecondaryMuscle, setNewSecondaryMuscle] = useState<MuscleGroup | ''>('');
  const [newSecondaryContribution, setNewSecondaryContribution] = useState<VolumeContribution>(0.5);

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
      equipment: undefined,
      primary_muscle: undefined,
    },
  });

  const primaryMuscle = watch('primary_muscle');
  const equipment = watch('equipment');

  // Get available muscles for secondary selection (exclude primary and already selected)
  const availableSecondaryMuscles = MUSCLE_GROUPS.filter(
    (muscle) =>
      muscle !== primaryMuscle &&
      !secondaryMuscles.some((sm) => sm.muscle === muscle)
  );

  const addSecondaryMuscle = () => {
    if (newSecondaryMuscle && !secondaryMuscles.some((sm) => sm.muscle === newSecondaryMuscle)) {
      setSecondaryMuscles([
        ...secondaryMuscles,
        { muscle: newSecondaryMuscle, contribution: newSecondaryContribution },
      ]);
      setNewSecondaryMuscle('');
      setNewSecondaryContribution(0.5);
    }
  };

  const removeSecondaryMuscle = (muscle: MuscleGroup) => {
    setSecondaryMuscles(secondaryMuscles.filter((sm) => sm.muscle !== muscle));
  };

  const onSubmit = async (data: CreateExerciseFormData) => {
    try {
      // Build muscle_contributions dict with primary at 1.0 and secondary muscles
      const muscle_contributions: Record<MuscleGroup, number> = {
        [data.primary_muscle]: 1.0,
      };
      
      secondaryMuscles.forEach((sm) => {
        muscle_contributions[sm.muscle] = sm.contribution;
      });

      await createExercise.mutateAsync({
        name: data.name,
        description: data.description || '',
        equipment: data.equipment,
        muscle_contributions,
      });

      // Reset form and close modal on success
      reset();
      setSecondaryMuscles([]);
      onOpenChange(false);
    } catch {
      // Error handling is done by the mutation hook
    }
  };

  const handleClose = () => {
    reset();
    setSecondaryMuscles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exercise</DialogTitle>
          <DialogDescription>
            Add a custom exercise to your library. Define primary and secondary muscle targets.
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

          {/* Equipment Field */}
          <div className="space-y-2">
            <Label htmlFor="equipment">
              Equipment <span className="text-destructive">*</span>
            </Label>
            <Select
              value={equipment}
              onValueChange={(value) => setValue('equipment', value as Equipment)}
            >
              <SelectTrigger id="equipment" aria-invalid={!!errors.equipment}>
                <SelectValue placeholder="Select equipment type" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_OPTIONS.map((equip) => (
                  <SelectItem key={equip} value={equip}>
                    {EQUIPMENT_LABELS[equip]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.equipment && (
              <p className="text-sm text-destructive">{errors.equipment.message}</p>
            )}
          </div>

          {/* Primary Muscle Group Field */}
          <div className="space-y-2">
            <Label htmlFor="primary_muscle">
              Primary Muscle <span className="text-destructive">*</span>
            </Label>
            <Select
              value={primaryMuscle}
              onValueChange={(value) => setValue('primary_muscle', value as MuscleGroup)}
            >
              <SelectTrigger id="primary_muscle" aria-invalid={!!errors.primary_muscle}>
                <SelectValue placeholder="Select primary muscle group" />
              </SelectTrigger>
              <SelectContent>
                {MUSCLE_GROUPS.map((group) => (
                  <SelectItem key={group} value={group}>
                    {MUSCLE_GROUP_LABELS[group]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.primary_muscle && (
              <p className="text-sm text-destructive">{errors.primary_muscle.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              The main muscle targeted by this exercise (100% volume contribution)
            </p>
          </div>

          {/* Secondary Muscles Section */}
          <div className="space-y-2">
            <Label>Secondary Muscles (Optional)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Add muscles that receive partial volume from this exercise
            </p>
            
            {/* List of added secondary muscles */}
            {secondaryMuscles.length > 0 && (
              <div className="space-y-2 mb-3">
                {secondaryMuscles.map((sm) => (
                  <div
                    key={sm.muscle}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <span className="text-sm">
                      {MUSCLE_GROUP_LABELS[sm.muscle]} -{' '}
                      {VOLUME_CONTRIBUTION_LABELS[sm.contribution]}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSecondaryMuscle(sm.muscle)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add secondary muscle controls */}
            {primaryMuscle && availableSecondaryMuscles.length > 0 && (
              <div className="flex gap-2">
                <Select
                  value={newSecondaryMuscle}
                  onValueChange={(value) => setNewSecondaryMuscle(value as MuscleGroup)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select muscle" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSecondaryMuscles.map((muscle) => (
                      <SelectItem key={muscle} value={muscle}>
                        {MUSCLE_GROUP_LABELS[muscle]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={String(newSecondaryContribution)}
                  onValueChange={(value) => setNewSecondaryContribution(Number(value) as VolumeContribution)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOLUME_CONTRIBUTIONS.filter((c) => c < 1.0).map((contribution) => (
                      <SelectItem key={contribution} value={String(contribution)}>
                        {VOLUME_CONTRIBUTION_LABELS[contribution]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addSecondaryMuscle}
                  disabled={!newSecondaryMuscle}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
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
