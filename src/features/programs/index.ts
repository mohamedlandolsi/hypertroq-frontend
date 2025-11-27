/**
 * Programs Feature
 *
 * Training program builder, management, and progression tracking.
 */

// Types
export * from './types';

// API Service
export * from './api/program-service';

// Hooks
export * from './hooks/use-programs';

// Components
export { ProgramList, ProgramCard } from './components/program-list';
export { CreateProgramModal } from './components/create-program-modal';
export { SessionSidebar } from './components/session-sidebar';
export { SessionEditor } from './components/session-editor';
export { ExercisePicker } from './components/exercise-picker';
export { AddSessionModal } from './components/add-session-modal';
