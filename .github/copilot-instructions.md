# HypertroQ Frontend - Copilot Instructions

You are an expert Senior Frontend Engineer specializing in **Next.js 14+ (App Router)**, **TypeScript**, and **Clean Architecture**.

## Project Context
- **Name:** HypertroQ
- **Type:** SaaS platform for Hypertrophy Training & AI Coaching.
- **Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Lucide Icons, Zustand (State), TanStack Query (Data Fetching), Axios (API).
- **Backend:** Connects to a FastAPI backend via REST API.

## Coding Standards & Principles

### 1. Architecture (Feature-Based)
- Organize code by **Feature** modules in `src/features/`.
- **Structure:**
  - `src/features/auth/` -> `components/`, `api/`, `store/`, `types/`
  - `src/features/exercises/`
  - `src/features/programs/`
- Shared UI components go in `src/components/ui/` (shadcn).
- Shared layout components go in `src/components/layout/`.

### 2. State Management
- **Server State:** Use **TanStack Query (React Query)** for all API data fetching.
  - Always create custom hooks for queries (e.g., `useExercises`, `useCreateProgram`).
- **Client State:** Use **Zustand** for global UI state (Auth, Sidebar toggle).
- **Form State:** Use **React Hook Form** + **Zod** for validation.

### 3. UI & Design System
- **Component Library:** Strictly use **shadcn/ui** components. Do not invent new UI primitives unless necessary.
- **Styling:** Use **Tailwind CSS** utility classes. Avoid inline styles.
- **Responsiveness:** Always implement Mobile-First design.
- **Icons:** Use `lucide-react`.

### 4. TypeScript Rules
- **Strict Mode:** Enabled. No `any`.
- **Interfaces:** Define interfaces for all API responses and Props.
- **Types Location:**
  - Feature-specific types -> `src/features/[feature]/types.ts`
  - Shared types -> `src/types/`

### 5. API Integration
- Use the singleton `apiClient` from `src/lib/api-client.ts`.
- Do not hardcode URLs. Use `NEXT_PUBLIC_API_URL` environment variable.
- Handle loading and error states explicitly in the UI (Skeleton loaders, Toast notifications).

## Preferred Patterns
- **Functional Components:** Use `const Component = () => {}` syntax.
- **Imports:** Use absolute imports `@/components/...`.
- **Error Handling:** Wrap server actions or API calls in `try/catch` and trigger UI feedback.
