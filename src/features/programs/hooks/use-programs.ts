/**
 * Program Hooks
 *
 * React Query hooks for program data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  cloneProgram,
  getProgramStats,
  createSession,
  updateSession,
  deleteSession,
} from '../api/program-service';
import type {
  Program,
  ProgramFilters,
  CreateProgramData,
  UpdateProgramData,
  CloneProgramData,
  CreateSessionData,
  UpdateSessionData,
} from '../types';

// Query keys
export const programKeys = {
  all: ['programs'] as const,
  lists: () => [...programKeys.all, 'list'] as const,
  list: (filters: ProgramFilters) => [...programKeys.lists(), filters] as const,
  details: () => [...programKeys.all, 'detail'] as const,
  detail: (id: string) => [...programKeys.details(), id] as const,
  stats: (id: string) => [...programKeys.all, 'stats', id] as const,
};

/**
 * Hook to fetch all programs with optional filters
 */
export function usePrograms(filters?: ProgramFilters) {
  return useQuery({
    queryKey: programKeys.list(filters ?? {}),
    queryFn: () => getPrograms(filters),
  });
}

/**
 * Hook to fetch a single program by ID
 */
export function useProgram(id: string) {
  return useQuery({
    queryKey: programKeys.detail(id),
    queryFn: () => getProgramById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch program statistics
 */
export function useProgramStats(id: string) {
  return useQuery({
    queryKey: programKeys.stats(id),
    queryFn: () => getProgramStats(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new program
 */
export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProgramData) => createProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      toast.success('Program created successfully!');
    },
    onError: () => {
      // Error toast handled by axios interceptor
    },
  });
}

/**
 * Hook to update a program
 */
export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProgramData }) =>
      updateProgram(id, data),
    onSuccess: (
      _data: Program,
      variables: { id: string; data: UpdateProgramData }
    ) => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: programKeys.detail(variables.id),
      });
      toast.success('Program updated successfully!');
    },
    onError: () => {
      // Error toast handled by axios interceptor
    },
  });
}

/**
 * Hook to delete a program
 */
export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProgram(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      toast.success('Program deleted successfully!');
    },
    onError: () => {
      // Error toast handled by axios interceptor
    },
  });
}

/**
 * Hook to clone a template program
 */
export function useCloneProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      data,
    }: {
      templateId: string;
      data?: CloneProgramData;
    }) => cloneProgram(templateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      toast.success('Program cloned successfully!');
    },
    onError: () => {
      // Error toast handled by axios interceptor
    },
  });
}

// ============================================================================
// Session Hooks
// ============================================================================

/**
 * Hook to create a new session
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      programId,
      data,
    }: {
      programId: string;
      data: CreateSessionData;
    }) => createSession(programId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: programKeys.detail(variables.programId),
      });
      toast.success('Session added successfully!');
    },
    onError: () => {
      // Error toast handled by axios interceptor
    },
  });
}

/**
 * Hook to update a session
 */
export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      programId,
      sessionId,
      data,
    }: {
      programId: string;
      sessionId: string;
      data: UpdateSessionData;
    }) => updateSession(programId, sessionId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: programKeys.detail(variables.programId),
      });
      toast.success('Session updated successfully!');
    },
    onError: () => {
      // Error toast handled by axios interceptor
    },
  });
}

/**
 * Hook to delete a session
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      programId,
      sessionId,
    }: {
      programId: string;
      sessionId: string;
    }) => deleteSession(programId, sessionId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: programKeys.detail(variables.programId),
      });
      toast.success('Session deleted successfully!');
    },
    onError: () => {
      // Error toast handled by axios interceptor
    },
  });
}
