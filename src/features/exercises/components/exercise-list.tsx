'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dumbbell, Globe, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Exercise } from '../types';
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUP_COLORS } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
}

export function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
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
          {exercise.is_global ? (
            <span title="Global exercise">
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            </span>
          ) : (
            <span title="Organization exercise">
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Description */}
        {exercise.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {exercise.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className={cn(
              'text-xs font-medium',
              MUSCLE_GROUP_COLORS[exercise.muscle_group]
            )}
          >
            {MUSCLE_GROUP_LABELS[exercise.muscle_group]}
          </Badge>

          {exercise.equipment && (
            <Badge variant="outline" className="text-xs">
              <Dumbbell className="h-3 w-3 mr-1" />
              {exercise.equipment}
            </Badge>
          )}
        </div>
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
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ExerciseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (exercises.length === 0) {
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
      {exercises.map((exercise) => (
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
