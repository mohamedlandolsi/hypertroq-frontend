/**
 * Exercise API Service
 * 
 * Handles all exercise-related API calls
 */

import axiosInstance from '@/lib/api-client';
import type { Exercise, MuscleGroup } from '../types';

interface GetExercisesParams {
  muscle_group?: MuscleGroup;
}

/**
 * Fetch all exercises with optional filters
 */
export async function getExercises(params?: GetExercisesParams): Promise<Exercise[]> {
  const response = await axiosInstance.get<Exercise[]>('/exercises', {
    params: {
      ...(params?.muscle_group && { muscle_group: params.muscle_group }),
    },
  });
  return response.data;
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
  muscle_group: MuscleGroup;
  equipment?: string;
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
  image_url?: string;
}

export async function updateExercise(id: string, data: UpdateExerciseData): Promise<Exercise> {
  const response = await axiosInstance.patch<Exercise>(`/exercises/${id}`, data);
  return response.data;
}

/**
 * Delete an exercise
 */
export async function deleteExercise(id: string): Promise<void> {
  await axiosInstance.delete(`/exercises/${id}`);
}
