/**
 * Exercise API Service
 * 
 * Handles all exercise-related API calls
 */

import axiosInstance from '@/lib/api-client';
import type { Exercise, MuscleGroup } from '../types';

interface GetExercisesParams {
  muscle_group?: MuscleGroup;
  limit?: number;
  skip?: number;
}

/**
 * Fetch all exercises with optional filters
 */
export async function getExercises(params?: GetExercisesParams): Promise<Exercise[]> {
  const response = await axiosInstance.get<Exercise[] | { items: Exercise[]; data: Exercise[] }>('/exercises', {
    params: {
      ...(params?.muscle_group && { muscle_group: params.muscle_group }),
      limit: params?.limit ?? 100, // Request more items to see all exercises
      skip: params?.skip ?? 0,
    },
  });
  
  // Handle both array response and paginated response formats
  const data = response.data;
  if (Array.isArray(data)) {
    return data;
  }
  // Handle paginated response with 'items' or 'data' property
  if (data && typeof data === 'object') {
    if ('items' in data && Array.isArray(data.items)) {
      return data.items;
    }
    if ('data' in data && Array.isArray(data.data)) {
      return data.data;
    }
  }
  return [];
}

/**
 * Fetch a single exercise by ID
 */
export async function getExerciseById(id: string): Promise<Exercise> {
  const response = await axiosInstance.get<Exercise>(`/exercises/${id}`);
  return response.data;
}

/**
 * Create a new exercise
 */
export interface CreateExerciseData {
  name: string;
  description?: string;
  equipment: string;
  muscle_contributions: Record<MuscleGroup, number>;
  image_url?: string;
}

export async function createExercise(data: CreateExerciseData): Promise<Exercise> {
  const response = await axiosInstance.post<Exercise>('/exercises', data);
  return response.data;
}

/**
 * Update an existing exercise
 */
export interface UpdateExerciseData {
  name?: string;
  description?: string;
  muscle_group?: MuscleGroup;
  equipment?: string;
  muscle_contributions?: Record<MuscleGroup, number>;
  image_url?: string;
  video_url?: string;
}

export async function updateExercise(id: string, data: UpdateExerciseData): Promise<Exercise> {
  const response = await axiosInstance.put<Exercise>(`/exercises/${id}`, data);
  return response.data;
}

/**
 * Delete an exercise
 */
export async function deleteExercise(id: string): Promise<void> {
  await axiosInstance.delete(`/exercises/${id}`);
}
