'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, X } from 'lucide-react';
import {
  useExercises,
  ExerciseList,
  MUSCLE_GROUPS,
  MUSCLE_GROUP_LABELS,
  type MuscleGroup,
} from '@/features/exercises';

export default function ExercisesPage() {
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<MuscleGroup | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch exercises with muscle group filter
  const { data: exercises = [], isLoading, isError } = useExercises(
    muscleGroupFilter !== 'ALL' ? { muscle_group: muscleGroupFilter } : undefined
  );

  // Client-side search filtering
  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return exercises;

    const query = searchQuery.toLowerCase();
    return exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.description?.toLowerCase().includes(query) ||
        exercise.equipment?.toLowerCase().includes(query)
    );
  }, [exercises, searchQuery]);

  // Clear all filters
  const clearFilters = () => {
    setMuscleGroupFilter('ALL');
    setSearchQuery('');
  };

  const hasActiveFilters = muscleGroupFilter !== 'ALL' || searchQuery.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
          <p className="text-muted-foreground">
            Browse and manage your exercise library.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Muscle Group Filter */}
        <Select
          value={muscleGroupFilter}
          onValueChange={(value) => setMuscleGroupFilter(value as MuscleGroup | 'ALL')}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Muscle Groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Muscle Groups</SelectItem>
            {MUSCLE_GROUPS.map((group) => (
              <SelectItem key={group} value={group}>
                {MUSCLE_GROUP_LABELS[group]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results Count */}
      {!isLoading && !isError && (
        <p className="text-sm text-muted-foreground">
          {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
          {hasActiveFilters && ' (filtered)'}
        </p>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-destructive">Failed to load exercises. Please try again.</p>
        </div>
      )}

      {/* Exercise Grid */}
      <ExerciseList
        exercises={filteredExercises}
        isLoading={isLoading}
        onExerciseClick={(exercise) => {
          // TODO: Navigate to exercise detail or open modal
          console.log('Clicked exercise:', exercise);
        }}
      />
    </div>
  );
}
