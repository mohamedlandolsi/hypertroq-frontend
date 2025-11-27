/**
 * Program Feature Types
 *
 * Aligned with backend HypertroQ domain model for training programs.
 */

// Split types for training programs
export const SPLIT_TYPES = [
  'UPPER_LOWER',
  'PUSH_PULL_LEGS',
  'FULL_BODY',
  'BRO_SPLIT',
  'ARNOLD_SPLIT',
  'CUSTOM',
] as const;

export type SplitType = (typeof SPLIT_TYPES)[number];

export const SPLIT_TYPE_LABELS: Record<SplitType, string> = {
  UPPER_LOWER: 'Upper/Lower',
  PUSH_PULL_LEGS: 'Push/Pull/Legs',
  FULL_BODY: 'Full Body',
  BRO_SPLIT: 'Bro Split',
  ARNOLD_SPLIT: 'Arnold Split',
  CUSTOM: 'Custom',
};

// Structure types for program scheduling
export const STRUCTURE_TYPES = ['WEEKLY', 'CYCLIC'] as const;

export type StructureType = (typeof STRUCTURE_TYPES)[number];

export const STRUCTURE_TYPE_LABELS: Record<StructureType, string> = {
  WEEKLY: 'Weekly',
  CYCLIC: 'Cyclic',
};

// Days of the week for weekly structure
export const DAYS_OF_WEEK = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN',
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
  SUN: 'Sunday',
};

// Structure configuration types
export interface WeeklyStructureConfig {
  days_per_week: number;
  selected_days: DayOfWeek[];
}

export interface CyclicStructureConfig {
  days_on: number;
  days_off: number;
}

export type StructureConfig = WeeklyStructureConfig | CyclicStructureConfig;

// Session exercise configuration (from API)
export interface SessionExercise {
  exercise_id: string;
  sets: number;
  order_in_session: number;
  notes?: string;
}

// Extended session exercise for UI with exercise details
export interface SessionExerciseWithDetails extends SessionExercise {
  id: string; // Local ID for UI operations
  exercise_name: string;
  equipment?: string;
  primary_muscles?: string[];
  target_reps?: string; // e.g., "8-12"
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

// Session in a program
export interface ProgramSession {
  id: string;
  program_id: string;
  name: string;
  day_number: number;
  order_in_program: number;
  exercises: SessionExercise[];
  total_sets: number;
  exercise_count: number;
}

// Create session request
export interface CreateSessionData {
  name: string;
  day_number: number;
  order_in_program: number;
  exercises: SessionExercise[];
}

// Update session request
export interface UpdateSessionData {
  name?: string;
  day_number?: number;
  order_in_program?: number;
  exercises?: SessionExercise[];
}

// Volume status for muscle groups
export type VolumeStatus = 'low' | 'optimal' | 'high' | 'excessive';

export interface MuscleVolumeStats {
  muscle: string;
  muscle_name: string;
  sets_per_week: number;
  status: VolumeStatus;
}

// Program statistics
export interface ProgramStats {
  total_sessions: number;
  total_sets: number;
  avg_sets_per_session: number;
  weekly_volume: MuscleVolumeStats[];
  training_frequency: number;
}

// Program entity
export interface Program {
  id: string;
  name: string;
  description: string;
  split_type: SplitType;
  structure_type: StructureType;
  structure_config?: StructureConfig;
  is_template: boolean;
  duration_weeks: number;
  session_count?: number;
  sessions?: ProgramSession[];
  stats?: ProgramStats;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

// Program list item (lighter version for list views)
export interface ProgramListItem {
  id: string;
  name: string;
  description: string;
  split_type: SplitType;
  structure_type: StructureType;
  is_template: boolean;
  duration_weeks: number;
  session_count: number;
  created_at: string;
  updated_at: string;
}

// Create program request
export interface CreateProgramData {
  name: string;
  description?: string;
  split_type: SplitType;
  structure_type: StructureType;
  structure_config?: StructureConfig;
  duration_weeks?: number;
}

// Update program request
export interface UpdateProgramData {
  name?: string;
  description?: string;
  duration_weeks?: number;
}

// Clone program request
export interface CloneProgramData {
  new_name?: string;
}

// API response for paginated programs
export interface ProgramsResponse {
  items: ProgramListItem[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

// Query filters for program list
export interface ProgramFilters {
  search?: string;
  split_type?: SplitType;
  structure_type?: StructureType;
  is_template?: boolean;
  skip?: number;
  limit?: number;
}
