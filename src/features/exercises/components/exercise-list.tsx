'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dumbbell, Globe, Building2, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Exercise, MuscleGroup } from '../types';
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUP_COLORS, EQUIPMENT_LABELS } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
}

export function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  // Get primary muscle groups from the exercise
  const primaryMuscles = exercise.primary_muscles || [];
  const secondaryMuscles = exercise.secondary_muscles || [];

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all hover:shadow-md hover:border-primary/50',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {exercise.name}
          </CardTitle>
          <div className="flex items-center gap-1 shrink-0">
            {exercise.is_compound && (
              <span title="Compound exercise">
                <Layers className="h-4 w-4 text-muted-foreground" />
              </span>
            )}
            {exercise.is_global ? (
              <span title="Global exercise">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </span>
            ) : (
              <span title="Organization exercise">
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Description */}
        {exercise.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {exercise.description}
          </p>
        )}

        {/* Primary Muscle Badges */}
        <div className="flex flex-wrap gap-2">
          {primaryMuscles.map((muscleName) => {
            // Try to find the muscle group key from the label
            const muscleKey = Object.entries(MUSCLE_GROUP_LABELS).find(
              ([, label]) => label === muscleName
            )?.[0] as MuscleGroup | undefined;
            
            return (
              <Badge
                key={muscleName}
                variant="secondary"
                className={cn(
                  'text-xs font-medium',
                  muscleKey ? MUSCLE_GROUP_COLORS[muscleKey] : 'bg-primary/10 text-primary'
                )}
              >
                {muscleName}
              </Badge>
            );
          })}

          {/* Show secondary muscles count if any */}
          {secondaryMuscles.length > 0 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              +{secondaryMuscles.length} secondary
            </Badge>
          )}
        </div>

        {/* Equipment Badge */}
        {exercise.equipment && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Dumbbell className="h-3 w-3 mr-1" />
              {exercise.equipment_name || EQUIPMENT_LABELS[exercise.equipment] || exercise.equipment}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ExerciseListProps {
  exercises: Exercise[];
  isLoading?: boolean;
  onExerciseClick?: (exercise: Exercise) => void;
}

export function ExerciseList({ exercises, isLoading, onExerciseClick }: ExerciseListProps) {
  // Ensure exercises is always an array
  const exerciseList = Array.isArray(exercises) ? exercises : [];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ExerciseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (exerciseList.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Dumbbell className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mt-4 text-lg font-medium">No exercises found</p>
          <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
            Try adjusting your filters or search query to find what you&apos;re looking for.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {exerciseList.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onClick={() => onExerciseClick?.(exercise)}
        />
      ))}
    </div>
  );
}

function ExerciseCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
