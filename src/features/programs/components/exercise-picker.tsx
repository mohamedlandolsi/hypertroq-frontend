'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Search, Plus, Dumbbell, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExercises } from '@/features/exercises/hooks/use-exercises';
import type { Exercise as ExerciseType } from '@/features/exercises/types';
import {
  MUSCLE_GROUP_LABELS,
  MUSCLE_GROUP_COLORS,
  EQUIPMENT_LABELS,
} from '@/features/exercises/types';
import type { MuscleGroup } from '@/features/exercises/types';

interface ExercisePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExercise: (exercise: ExerciseType) => void;
  addedExerciseIds: string[];
}

export function ExercisePicker({
  open,
  onOpenChange,
  onAddExercise,
  addedExerciseIds,
}: ExercisePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: exercises = [], isLoading } = useExercises();

  // Filter exercises based on search query
  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return exercises;

    const query = searchQuery.toLowerCase();
    return exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.description?.toLowerCase().includes(query) ||
        exercise.primary_muscles?.some((m) => m.toLowerCase().includes(query)) ||
        exercise.equipment?.toLowerCase().includes(query)
    );
  }, [exercises, searchQuery]);

  // Group exercises by primary muscle
  const groupedExercises = useMemo(() => {
    const groups: Record<string, ExerciseType[]> = {};

    filteredExercises.forEach((exercise) => {
      const primaryMuscle = exercise.primary_muscles?.[0] || 'Other';
      if (!groups[primaryMuscle]) {
        groups[primaryMuscle] = [];
      }
      groups[primaryMuscle].push(exercise);
    });

    return groups;
  }, [filteredExercises]);

  const handleAddExercise = (exercise: ExerciseType) => {
    onAddExercise(exercise);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
        title="Add Exercise"
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Add Exercise
          </SheetTitle>
        </SheetHeader>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Dumbbell className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-sm text-muted-foreground">
                No exercises found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {Object.entries(groupedExercises).map(
                ([muscleName, muscleExercises]) => (
                  <div key={muscleName}>
                    {/* Muscle Group Header */}
                    <div className="sticky top-0 px-4 py-2 bg-muted/70 backdrop-blur-sm">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {muscleName}
                      </p>
                    </div>

                    {/* Exercises in Group */}
                    <div className="divide-y divide-muted/50">
                      {muscleExercises.map((exercise) => {
                        const isAdded = addedExerciseIds.includes(exercise.id);

                        return (
                          <div
                            key={exercise.id}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer',
                              isAdded && 'bg-primary/5'
                            )}
                            onClick={() => !isAdded && handleAddExercise(exercise)}
                          >
                            {/* Exercise Icon/Image */}
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                              <Dumbbell className="h-5 w-5 text-muted-foreground" />
                            </div>

                            {/* Exercise Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {exercise.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {exercise.equipment && (
                                  <span className="text-xs text-muted-foreground">
                                    {EQUIPMENT_LABELS[exercise.equipment] ||
                                      exercise.equipment}
                                  </span>
                                )}
                                {exercise.is_compound && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1 py-0"
                                  >
                                    Compound
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Add Button */}
                            {isAdded ? (
                              <div className="flex items-center gap-1 text-primary">
                                <Check className="h-4 w-4" />
                                <span className="text-xs">Added</span>
                              </div>
                            ) : (
                              <Button variant="ghost" size="sm" className="h-8">
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            {addedExerciseIds.length} exercises added to session
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
