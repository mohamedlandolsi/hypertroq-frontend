/**
 * Program API Service
 *
 * Handles all program-related API calls
 */

import axiosInstance from '@/lib/api-client';
import type {
  Program,
  ProgramListItem,
  ProgramsResponse,
  ProgramFilters,
  CreateProgramData,
  UpdateProgramData,
  CloneProgramData,
  ProgramStats,
  ProgramSession,
  CreateSessionData,
  UpdateSessionData,
} from '../types';

/**
 * Fetch all programs with optional filters
 */
export async function getPrograms(
  params?: ProgramFilters
): Promise<ProgramListItem[]> {
  const response = await axiosInstance.get<
    ProgramListItem[] | ProgramsResponse
  >('/programs', {
    params: {
      ...(params?.search && { search: params.search }),
      ...(params?.split_type && { split_type: params.split_type }),
      ...(params?.structure_type && { structure_type: params.structure_type }),
      ...(params?.is_template !== undefined && {
        is_template: params.is_template,
      }),
      limit: params?.limit ?? 50,
      skip: params?.skip ?? 0,
    },
  });

  // Handle both array response and paginated response formats
  const data = response.data;
  if (Array.isArray(data)) {
    return data;
  }
  // Handle paginated response with 'items' property
  if (data && typeof data === 'object' && 'items' in data) {
    return data.items;
  }
  return [];
}

/**
 * Fetch a single program by ID with full details
 */
export async function getProgramById(id: string): Promise<Program> {
  const response = await axiosInstance.get<Program>(`/programs/${id}`);
  return response.data;
}

/**
 * Create a new program
 */
export async function createProgram(data: CreateProgramData): Promise<Program> {
  const response = await axiosInstance.post<Program>('/programs', data);
  return response.data;
}

/**
 * Update an existing program
 */
export async function updateProgram(
  id: string,
  data: UpdateProgramData
): Promise<Program> {
  const response = await axiosInstance.put<Program>(`/programs/${id}`, data);
  return response.data;
}

/**
 * Delete a program
 */
export async function deleteProgram(id: string): Promise<void> {
  await axiosInstance.delete(`/programs/${id}`);
}

/**
 * Clone a template program
 */
export async function cloneProgram(
  templateId: string,
  data?: CloneProgramData
): Promise<Program> {
  const response = await axiosInstance.post<Program>(
    `/programs/${templateId}/clone`,
    data
  );
  return response.data;
}

/**
 * Get program statistics
 */
export async function getProgramStats(programId: string): Promise<ProgramStats> {
  const response = await axiosInstance.get<ProgramStats>(
    `/programs/${programId}/stats`
  );
  return response.data;
}

// ============================================================================
// Session API Functions
// ============================================================================

/**
 * Add a new session to a program
 */
export async function createSession(
  programId: string,
  data: CreateSessionData
): Promise<ProgramSession> {
  const response = await axiosInstance.post<ProgramSession>(
    `/programs/${programId}/sessions`,
    data
  );
  return response.data;
}

/**
 * Update an existing session
 */
export async function updateSession(
  programId: string,
  sessionId: string,
  data: UpdateSessionData
): Promise<ProgramSession> {
  const response = await axiosInstance.put<ProgramSession>(
    `/programs/${programId}/sessions/${sessionId}`,
    data
  );
  return response.data;
}

/**
 * Delete a session from a program
 */
export async function deleteSession(
  programId: string,
  sessionId: string
): Promise<void> {
  await axiosInstance.delete(`/programs/${programId}/sessions/${sessionId}`);
}
