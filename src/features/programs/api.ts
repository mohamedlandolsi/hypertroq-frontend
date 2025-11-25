/**
 * Program API Functions
 */

import { api } from '@/lib/api-client';
import type { Program } from '@/types';

export const programApi = {
  list: () =>
    api.get<{ items: Program[]; total: number }>('/api/v1/programs'),

  get: (id: string) =>
    api.get<Program>(`/api/v1/programs/${id}`),

  create: (data: Partial<Program>) =>
    api.post<Program>('/api/v1/programs', data),

  update: (id: string, data: Partial<Program>) =>
    api.put<Program>(`/api/v1/programs/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/api/v1/programs/${id}`),
};
