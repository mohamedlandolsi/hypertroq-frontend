'use client';

import { useState, useEffect } from 'react';
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
import { useUpdateExercise } from '../hooks/use-exercises';
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
  type Exercise,
} from '../types';

// Form validation schema
const editExerciseSchema = z.object({
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
  image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  video_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type EditExerciseFormData = z.infer<typeof editExerciseSchema>;

interface SecondaryMuscle {
  muscle: MuscleGroup;
  contribution: VolumeContribution;
}

interface EditExerciseModalProps {
  exercise: Exercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditExerciseModal({ exercise, open, onOpenChange }: EditExerciseModalProps) {
  const updateExercise = useUpdateExercise();
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
  } = useForm<EditExerciseFormData>({
    resolver: zodResolver(editExerciseSchema),
    defaultValues: {
      name: '',
      description: '',
      equipment: undefined,
      primary_muscle: undefined,
      image_url: '',
      video_url: '',
    },
  });

  const primaryMuscle = watch('primary_muscle');
  const equipment = watch('equipment');

  // Populate form when exercise changes
  useEffect(() => {
    if (exercise && open) {
      // Find primary muscle from muscle_contributions (the one with 1.0 contribution)
      const primaryMuscleEntry = exercise.muscle_contributions.find(
        (mc) => mc.contribution === 1.0
      );
      const primaryMuscleKey = primaryMuscleEntry?.muscle as MuscleGroup | undefined;

      // Find secondary muscles (contributions < 1.0)
      const secondaries = exercise.muscle_contributions
        .filter((mc) => mc.contribution < 1.0)
        .map((mc) => ({
          muscle: mc.muscle as MuscleGroup,
          contribution: mc.contribution as VolumeContribution,
        }));

      reset({
        name: exercise.name,
        description: exercise.description || '',
        equipment: exercise.equipment,
        primary_muscle: primaryMuscleKey,
        image_url: exercise.image_url || '',
        video_url: exercise.video_url || '',
      });

      setSecondaryMuscles(secondaries);
    }
  }, [exercise, open, reset]);

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

  const onSubmit = async (data: EditExerciseFormData) => {
    if (!exercise) return;

    try {
      // Build muscle_contributions dict with primary at 1.0 and secondary muscles
      const muscle_contributions: Partial<Record<MuscleGroup, number>> = {
        [data.primary_muscle]: 1.0,
      };

      secondaryMuscles.forEach((sm) => {
        muscle_contributions[sm.muscle] = sm.contribution;
      });

      // Build update data, only including fields that should be updated
      const updateData: any = {
        name: data.name,
        description: data.description || '',
        equipment: data.equipment,
        muscle_contributions: muscle_contributions as Record<MuscleGroup, number>,
      };

      // Only include image_url if it has a valid value
      if (data.image_url && data.image_url.trim()) {
        updateData.image_url = data.image_url;
      }

      // Only include video_url if it has a valid value
      if (data.video_url && data.video_url.trim()) {
        updateData.video_url = data.video_url;
      }

      await updateExercise.mutateAsync({
        id: exercise.id,
        data: updateData,
      });

      // Close modal on success
      onOpenChange(false);
    } catch {
      // Error handling is done by the mutation hook
    }
  };

  const handleClose = () => {
    reset();
    setSecondaryMuscles([]);
    setNewSecondaryMuscle('');
    setNewSecondaryContribution(0.5);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
          <DialogDescription>
            Update the exercise details. Changes will be saved immediately.
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

          {/* Image URL Field */}
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://example.com/exercise-image.jpg"
              {...register('image_url')}
              aria-invalid={!!errors.image_url}
            />
            {errors.image_url && (
              <p className="text-sm text-destructive">{errors.image_url.message}</p>
            )}
          </div>

          {/* Video URL Field */}
          <div className="space-y-2">
            <Label htmlFor="video_url">Video URL (Optional)</Label>
            <Input
              id="video_url"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              {...register('video_url')}
              aria-invalid={!!errors.video_url}
            />
            {errors.video_url && (
              <p className="text-sm text-destructive">{errors.video_url.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Supports YouTube, Vimeo, and direct video links
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || updateExercise.isPending}>
              {(isSubmitting || updateExercise.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
