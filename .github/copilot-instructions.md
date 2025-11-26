# HypertroQ Frontend - Copilot Instructions

You are an expert Senior Frontend Engineer specializing in **Next.js 15+ (App Router)**, **TypeScript**, and **Clean Architecture**.

## Project Context
- **Name:** HypertroQ
- **Type:** SaaS platform for Hypertrophy Training & AI Coaching.
- **Tech Stack:** Next.js 15 (App Router with Turbopack), TypeScript, Tailwind CSS, Shadcn/UI, Lucide Icons, Zustand (State), TanStack Query (Data Fetching), Axios (API).
- **Backend:** Connects to a FastAPI backend via REST API at `http://localhost:8000/api/v1`.

## Domain Model

### Hypertrophy Training Concepts
- **Volume Tracking:** Total sets per muscle group/week (key metric for growth)
- **17 Muscle Groups:** CHEST, FRONT_DELTS, SIDE_DELTS, REAR_DELTS, TRICEPS, LATS, TRAPS_RHOMBOIDS, ELBOW_FLEXORS, FOREARMS, SPINAL_ERECTORS, ABS, OBLIQUES, GLUTES, QUADRICEPS, HAMSTRINGS, ADDUCTORS, CALVES
- **Volume Contribution Levels:** Each exercise contributes fractionally to muscles:
  - PRIMARY (1.0) - Main target muscle
  - HIGH (0.75) - Strong secondary target
  - MODERATE (0.50) - Secondary involvement
  - MINIMAL (0.25) - Tertiary involvement
- **Equipment Types:** BARBELL, DUMBBELL, CABLE, MACHINE, SMITH_MACHINE, BODYWEIGHT, KETTLEBELL, RESISTANCE_BAND, OTHER

### Domain Hierarchy
```
Program → Sessions (Workouts) → Exercises → Sets
```

## Coding Standards & Principles

### 1. Architecture (Feature-Based)
- Organize code by **Feature** modules in `src/features/`.
- **Structure:**
  - `src/features/auth/` -> `components/`, `api/`, `store/`, `types.ts`, `hooks/`
  - `src/features/exercises/` -> `components/`, `api/`, `hooks/`, `types.ts`
  - `src/features/programs/`
- Each feature exports via `index.ts` barrel file
- Shared UI components go in `src/components/ui/` (shadcn).
- Shared layout components go in `src/components/layout/`.

### 2. State Management
- **Server State:** Use **TanStack Query (React Query)** for all API data fetching.
  - Always create custom hooks in `hooks/use-*.ts` files (e.g., `useExercises`, `useCreateExercise`).
  - Use query key factories for cache management (e.g., `exerciseKeys.list(filters)`).
  - Invalidate queries after mutations for optimistic updates.
- **Client State:** Use **Zustand** for global UI state (Auth store, Sidebar toggle).
- **Form State:** Use **React Hook Form** + **Zod** for validation.

### 3. UI & Design System
- **Component Library:** Strictly use **shadcn/ui** components. Do not invent new UI primitives unless necessary.
- **Styling:** Use **Tailwind CSS** utility classes. Avoid inline styles.
- **Responsiveness:** Always implement Mobile-First design.
- **Icons:** Use `lucide-react`.
- **Toasts:** Use `sonner` for notifications (success, error, info).
- **Accessibility:** Always add `aria-*` attributes, titles, and proper labels.

### 4. TypeScript Rules
- **Strict Mode:** Enabled. No `any`.
- **Interfaces:** Define interfaces for all API responses and Props.
- **Types Location:**
  - Feature-specific types -> `src/features/[feature]/types.ts`
  - Shared types -> `src/types/`
- **Enums as const arrays:** Use `as const` for type-safe enums (e.g., `MUSCLE_GROUPS`, `EQUIPMENT_OPTIONS`).

### 5. API Integration
- Use the axios instance `axiosInstance` from `src/lib/api-client.ts`.
- Do not hardcode URLs. Use `NEXT_PUBLIC_API_URL` environment variable.
- Handle loading and error states explicitly in the UI (Skeleton loaders, Toast notifications).
- API responses are paginated: `{ items: T[], total, page, page_size, has_next, has_previous }`.
- Extract `items` from paginated responses in service functions.

### 6. Authentication
- JWT tokens stored in localStorage (`access_token`, `refresh_token`).
- Auth state managed by Zustand store in `src/features/auth/store/auth-store.ts`.
- Protected routes wrap content with auth checks.
- 401 responses automatically redirect to login via axios interceptor.

## Preferred Patterns
- **Functional Components:** Use `const Component = () => {}` syntax.
- **Imports:** Use absolute imports `@/components/...`.
- **Error Handling:** Wrap API calls in `try/catch`, mutations handle errors via `onError` callback.
- **Loading States:** Use `isLoading` from React Query, show Skeleton components.
- **Forms:** Use react-hook-form with zodResolver for validation.

## File Naming Conventions
- Components: `kebab-case.tsx` (e.g., `exercise-list.tsx`, `create-exercise-modal.tsx`)
- Hooks: `use-*.ts` (e.g., `use-exercises.ts`)
- Types: `types.ts` per feature
- API Services: `*-service.ts` (e.g., `exercise-service.ts`)

## Backend API Alignment
- Muscle groups and equipment use UPPERCASE enum values (e.g., `"CHEST"`, `"BARBELL"`)
- Exercise creation requires `muscle_contributions` dict: `{ "CHEST": 1.0, "TRICEPS": 0.75 }`
- All exercises must have at least one PRIMARY (1.0) muscle contribution
