/**
 * Program API Functions
 */

import { apiClient } from '@/lib/api-client';
import type { Program } from '@/types';

export const programApi = {
  list: () =>
    apiClient.get<Program[]>('/programs'),

  get: (id: string) =>
    apiClient.get<Program>(`/programs/${id}`),

  create: (data: Partial<Program>) =>
    apiClient.post<Program>('/programs', data),

  update: (id: string, data: Partial<Program>) =>
    apiClient.put<Program>(`/programs/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/programs/${id}`),
};
