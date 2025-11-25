/**
 * Exercise API Functions
 */

import { api } from '@/lib/api-client';
import type { Exercise } from '@/types';

export const exerciseApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<{ items: Exercise[]; total: number }>('/api/v1/exercises', {
      // TODO: Add query params
    }),

  get: (id: string) =>
    api.get<Exercise>(`/api/v1/exercises/${id}`),

  create: (data: Partial<Exercise>) =>
    api.post<Exercise>('/api/v1/exercises', data),

  update: (id: string, data: Partial<Exercise>) =>
    api.put<Exercise>(`/api/v1/exercises/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/api/v1/exercises/${id}`),
};
