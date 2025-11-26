/**
 * Exercise Feature Types
 */

export const MUSCLE_GROUPS = [
  'CHEST',
  'BACK',
  'QUADS',
  'HAMSTRINGS',
  'CALVES',
  'SHOULDERS',
  'TRICEPS',
  'BICEPS',
  'FOREARMS',
  'ABS',
  'TRAPS',
  'GLUTES',
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  muscle_group: MuscleGroup;
  equipment: string | null;
  is_global: boolean;
  image_url: string | null;
  created_by_user_id: string | null;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExerciseFilters {
  muscle_group?: MuscleGroup;
  search?: string;
}

// Muscle group display names for UI
export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  CHEST: 'Chest',
  BACK: 'Back',
  QUADS: 'Quads',
  HAMSTRINGS: 'Hamstrings',
  CALVES: 'Calves',
  SHOULDERS: 'Shoulders',
  TRICEPS: 'Triceps',
  BICEPS: 'Biceps',
  FOREARMS: 'Forearms',
  ABS: 'Abs',
  TRAPS: 'Traps',
  GLUTES: 'Glutes',
};

// Muscle group colors for badges
export const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
  CHEST: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  BACK: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  QUADS: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  HAMSTRINGS: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  CALVES: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  SHOULDERS: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  TRICEPS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  BICEPS: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  FOREARMS: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  ABS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  TRAPS: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  GLUTES: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
};

// Equipment options
export const EQUIPMENT_OPTIONS = [
  'Barbell',
  'Dumbbell',
  'Machine',
  'Cable',
  'Bodyweight',
  'Kettlebell',
  'Resistance Band',
  'EZ Bar',
  'Smith Machine',
  'Other',
] as const;

export type Equipment = (typeof EQUIPMENT_OPTIONS)[number];

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
] as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};
