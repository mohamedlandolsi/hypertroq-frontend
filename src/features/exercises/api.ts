/**
 * Exercise API Functions
 */

import { apiClient } from '@/lib/api-client';
import type { Exercise } from '@/types';

export const exerciseApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<Exercise[]>('/exercises', {
      params, // axios handles query params automatically
    }),

  get: (id: string) =>
    apiClient.get<Exercise>(`/exercises/${id}`),

  create: (data: Partial<Exercise>) =>
    apiClient.post<Exercise>('/exercises', data),

  update: (id: string, data: Partial<Exercise>) =>
    apiClient.put<Exercise>(`/exercises/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/exercises/${id}`),
};
