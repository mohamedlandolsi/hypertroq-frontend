/**
 * Exercise Hooks
 * 
 * React Query hooks for exercise data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  type CreateExerciseData,
  type UpdateExerciseData,
} from '../api/exercise-service';
import type { MuscleGroup, Exercise } from '../types';

// Query keys
export const exerciseKeys = {
  all: ['exercises'] as const,
  lists: () => [...exerciseKeys.all, 'list'] as const,
  list: (filters: { muscle_group?: MuscleGroup }) =>
    [...exerciseKeys.lists(), filters] as const,
  details: () => [...exerciseKeys.all, 'detail'] as const,
  detail: (id: string) => [...exerciseKeys.details(), id] as const,
};

/**
 * Hook to fetch all exercises with optional filters
 */
export function useExercises(filters?: { muscle_group?: MuscleGroup }) {
  return useQuery({
    queryKey: exerciseKeys.list(filters ?? {}),
    queryFn: () => getExercises(filters),
  });
}

/**
 * Hook to fetch a single exercise by ID
 */
export function useExercise(id: string) {
  return useQuery({
    queryKey: exerciseKeys.detail(id),
    queryFn: () => getExerciseById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new exercise
 */
export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExerciseData) => createExercise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
      toast.success('Exercise created successfully!');
    },
    onError: () => {
      // Error toast handled by axios interceptor
    },
  });
}

/**
 * Hook to update an exercise
 */
export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExerciseData }) =>
      updateExercise(id, data),
    onSuccess: (_data: Exercise, variables: { id: string; data: UpdateExerciseData }) => {
      queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: exerciseKeys.detail(variables.id) });
      toast.success('Exercise updated successfully!');
    },
    onError: () => {
      // Error toast handled by axios interceptor
    },
  });
}

/**
 * Hook to delete an exercise
 */
export function useDeleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
      toast.success('Exercise deleted successfully!');
    },
    onError: () => {
      // Error toast handled by axios interceptor
    },
  });
}
