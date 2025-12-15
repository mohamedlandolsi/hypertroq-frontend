/**
 * Exercise Feature Types
 * 
 * Aligned with backend HypertroQ domain model for hypertrophy training.
 */

// 17 muscle groups tracked for hypertrophy volume
export const MUSCLE_GROUPS = [
  'CHEST',
  'FRONT_DELTS',
  'SIDE_DELTS',
  'REAR_DELTS',
  'TRICEPS',
  'LATS',
  'TRAPS_RHOMBOIDS',
  'ELBOW_FLEXORS',
  'FOREARMS',
  'SPINAL_ERECTORS',
  'ABS',
  'OBLIQUES',
  'GLUTES',
  'QUADRICEPS',
  'HAMSTRINGS',
  'ADDUCTORS',
  'CALVES',
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

// Volume contribution levels (0.25, 0.5, 0.75, 1.0)
export const VOLUME_CONTRIBUTIONS = [0.25, 0.5, 0.75, 1.0] as const;
export type VolumeContribution = (typeof VOLUME_CONTRIBUTIONS)[number];

export const VOLUME_CONTRIBUTION_LABELS: Record<number, string> = {
  0.25: 'Minimal (25%)',
  0.5: 'Moderate (50%)',
  0.75: 'High (75%)',
  1.0: 'Primary (100%)',
};

// Muscle contribution response from backend
export interface MuscleContributionResponse {
  muscle: MuscleGroup;
  muscle_name: string;
  contribution: VolumeContribution;
  contribution_percentage: number;
  contribution_label: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  equipment: Equipment;
  equipment_name: string;
  image_url: string | null;
  video_url: string | null;
  difficulty_level: DifficultyLevel | null;
  force_type: ForceType | null;
  is_global: boolean;
  created_by_user_id: string | null;
  organization_id: string | null;
  muscle_contributions: MuscleContributionResponse[];
  primary_muscles: string[];
  secondary_muscles: string[];
  total_contribution: number;
  is_compound: boolean;
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
  FRONT_DELTS: 'Front Delts',
  SIDE_DELTS: 'Side Delts',
  REAR_DELTS: 'Rear Delts',
  TRICEPS: 'Triceps',
  LATS: 'Lats',
  TRAPS_RHOMBOIDS: 'Traps & Rhomboids',
  ELBOW_FLEXORS: 'Elbow Flexors (Biceps)',
  FOREARMS: 'Forearms',
  SPINAL_ERECTORS: 'Spinal Erectors',
  ABS: 'Abs',
  OBLIQUES: 'Obliques',
  GLUTES: 'Glutes',
  QUADRICEPS: 'Quadriceps',
  HAMSTRINGS: 'Hamstrings',
  ADDUCTORS: 'Adductors',
  CALVES: 'Calves',
};

// Muscle group categories
export const MUSCLE_GROUP_CATEGORIES: Record<MuscleGroup, string> = {
  CHEST: 'Upper Push',
  FRONT_DELTS: 'Upper Push',
  SIDE_DELTS: 'Upper Push',
  REAR_DELTS: 'Upper Pull',
  TRICEPS: 'Upper Push',
  LATS: 'Upper Pull',
  TRAPS_RHOMBOIDS: 'Upper Pull',
  ELBOW_FLEXORS: 'Upper Pull',
  FOREARMS: 'Upper Pull',
  SPINAL_ERECTORS: 'Core',
  ABS: 'Core',
  OBLIQUES: 'Core',
  GLUTES: 'Lower Body',
  QUADRICEPS: 'Lower Body',
  HAMSTRINGS: 'Lower Body',
  ADDUCTORS: 'Lower Body',
  CALVES: 'Lower Body',
};

// Muscle group colors for badges
export const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
  CHEST: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  FRONT_DELTS: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  SIDE_DELTS: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  REAR_DELTS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  TRICEPS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  LATS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  TRAPS_RHOMBOIDS: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  ELBOW_FLEXORS: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  FOREARMS: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  SPINAL_ERECTORS: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  ABS: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-400',
  OBLIQUES: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  GLUTES: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  QUADRICEPS: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  HAMSTRINGS: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  ADDUCTORS: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
  CALVES: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
};

// Equipment options (matching backend Equipment enum)
export const EQUIPMENT_OPTIONS = [
  'BARBELL',
  'DUMBBELL',
  'CABLE',
  'MACHINE',
  'SMITH_MACHINE',
  'BODYWEIGHT',
  'KETTLEBELL',
  'RESISTANCE_BAND',
  'OTHER',
] as const;

export type Equipment = (typeof EQUIPMENT_OPTIONS)[number];

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  BARBELL: 'Barbell',
  DUMBBELL: 'Dumbbell',
  CABLE: 'Cable',
  MACHINE: 'Machine',
  SMITH_MACHINE: 'Smith Machine',
  BODYWEIGHT: 'Bodyweight',
  KETTLEBELL: 'Kettlebell',
  RESISTANCE_BAND: 'Resistance Band',
  OTHER: 'Other',
};

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

// Force types for exercises
export const FORCE_TYPES = [
  'PUSH',
  'PULL',
  'STATIC',
] as const;

export type ForceType = (typeof FORCE_TYPES)[number];

export const FORCE_TYPE_LABELS: Record<ForceType, string> = {
  PUSH: 'Push',
  PULL: 'Pull',
  STATIC: 'Static',
};
