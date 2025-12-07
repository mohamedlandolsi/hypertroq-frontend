'use client';

import { useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  RefreshCw,
  LayoutGrid,
  Menu,
  ChevronDown,
} from 'lucide-react';
import {
  useProgram,
  useCreateSession,
  useUpdateSession,
  useDeleteSession,
  SPLIT_TYPE_LABELS,
  STRUCTURE_TYPE_LABELS,
} from '@/features/programs';
import type {
  ProgramSession,
  SessionExerciseWithDetails,
  SessionExercise,
} from '@/features/programs';
import { SessionSidebar } from '@/features/programs/components/session-sidebar';
import { SessionEditor } from '@/features/programs/components/session-editor';
import { ExercisePicker } from '@/features/programs/components/exercise-picker';
import { AddSessionModal } from '@/features/programs/components/add-session-modal';
import type { Exercise } from '@/features/exercises/types';

export default function ProgramEditorPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.id as string;

  // Fetch program data
  const { data: program, isLoading, isError } = useProgram(programId);

  // Session mutations
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  // UI State
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Local state for unsaved changes
  const [localExercises, setLocalExercises] = useState<
    Record<string, SessionExerciseWithDetails[]>
  >({});
  const [modifiedSessions, setModifiedSessions] = useState<Set<string>>(
    new Set()
  );

  // Get current session
  const currentSession = useMemo(() => {
    if (!program?.sessions || !selectedSessionId) return null;
    return program.sessions.find((s) => s.id === selectedSessionId) || null;
  }, [program?.sessions, selectedSessionId]);

  // Get exercises for current session (local state or from server)
  const currentSessionExercises = useMemo((): SessionExerciseWithDetails[] => {
    if (!selectedSessionId) return [];

    // Check local state first
    if (localExercises[selectedSessionId]) {
      return localExercises[selectedSessionId];
    }

    // Fall back to server data
    if (currentSession?.exercises) {
      return currentSession.exercises.map((ex, index) => ({
        ...ex,
        id: `${ex.exercise_id}-${index}`,
        exercise_name: ex.exercise_name || `Exercise ${index + 1}`,
        target_reps: '',
        rpe: undefined,
      }));
    }

    return [];
  }, [selectedSessionId, localExercises, currentSession?.exercises]);

  // Check if current session has unsaved changes
  const hasUnsavedChanges = selectedSessionId
    ? modifiedSessions.has(selectedSessionId)
    : false;

  // Set initial selected session when program loads
  useMemo(() => {
    if (program?.sessions?.length && !selectedSessionId) {
      setSelectedSessionId(program.sessions[0].id);
    }
  }, [program?.sessions, selectedSessionId]);

  // Handlers
  const handleSelectSession = useCallback((sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsMobileSidebarOpen(false); // Close mobile sidebar on selection
  }, []);

  const handleAddSession = async (data: { name: string }) => {
    if (!program) return;

    const newSession = {
      name: data.name,
      day_number: (program.sessions?.length || 0) + 1,
      order_in_program: (program.sessions?.length || 0) + 1,
      exercises: [],
    };

    const result = await createSession.mutateAsync({
      programId,
      data: newSession,
    });

    // Select the new session
    setSelectedSessionId(result.id);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!program?.sessions || program.sessions.length <= 1) {
      toast.error('Cannot delete the last session');
      return;
    }

    try {
      await deleteSession.mutateAsync({ programId, sessionId });

      // Clear local state for deleted session
      setLocalExercises((prev) => {
        const next = { ...prev };
        delete next[sessionId];
        return next;
      });
      setModifiedSessions((prev) => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });

      // Select another session if the deleted one was selected
      if (selectedSessionId === sessionId) {
        const remainingSessions = program.sessions.filter(
          (s) => s.id !== sessionId
        );
        setSelectedSessionId(remainingSessions[0]?.id || null);
      }
    } catch {
      // Error handled by mutation
    }
  };

  const handleRenameSession = async (sessionId: string, newName: string) => {
    try {
      await updateSession.mutateAsync({
        programId,
        sessionId,
        data: { name: newName },
      });
    } catch {
      // Error handled by mutation
    }
  };

  const handleAddExercise = useCallback(
    (exercise: Exercise) => {
      if (!selectedSessionId) return;

      const newExercise: SessionExerciseWithDetails = {
        id: `${exercise.id}-${Date.now()}`,
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        equipment: exercise.equipment,
        primary_muscles: exercise.primary_muscles,
        sets: 3,
        order_in_session: currentSessionExercises.length + 1,
        target_reps: '8-12',
        rpe: 8,
        notes: '',
      };

      setLocalExercises((prev) => ({
        ...prev,
        [selectedSessionId]: [...(prev[selectedSessionId] || currentSessionExercises), newExercise],
      }));

      setModifiedSessions((prev) => new Set(prev).add(selectedSessionId));
    },
    [selectedSessionId, currentSessionExercises]
  );

  const handleUpdateExercise = useCallback(
    (exerciseId: string, updates: Partial<SessionExerciseWithDetails>) => {
      if (!selectedSessionId) return;

      setLocalExercises((prev) => ({
        ...prev,
        [selectedSessionId]: (
          prev[selectedSessionId] || currentSessionExercises
        ).map((ex) => (ex.id === exerciseId ? { ...ex, ...updates } : ex)),
      }));

      setModifiedSessions((prev) => new Set(prev).add(selectedSessionId));
    },
    [selectedSessionId, currentSessionExercises]
  );

  const handleRemoveExercise = useCallback(
    (exerciseId: string) => {
      if (!selectedSessionId) return;

      setLocalExercises((prev) => {
        const exercises = (
          prev[selectedSessionId] || currentSessionExercises
        ).filter((ex) => ex.id !== exerciseId);

        // Update order_in_session
        exercises.forEach((ex, i) => {
          ex.order_in_session = i + 1;
        });

        return {
          ...prev,
          [selectedSessionId]: exercises,
        };
      });

      setModifiedSessions((prev) => new Set(prev).add(selectedSessionId));
    },
    [selectedSessionId, currentSessionExercises]
  );

  const handleReorderExercises = useCallback(
    (exercises: SessionExerciseWithDetails[]) => {
      if (!selectedSessionId) return;

      setLocalExercises((prev) => ({
        ...prev,
        [selectedSessionId]: exercises,
      }));

      setModifiedSessions((prev) => new Set(prev).add(selectedSessionId));
    },
    [selectedSessionId]
  );

  const handleSaveSession = async () => {
    if (!selectedSessionId || !currentSession) return;

    const exercises: SessionExercise[] = currentSessionExercises.map((ex) => ({
      exercise_id: ex.exercise_id,
      sets: ex.sets,
      order_in_session: ex.order_in_session,
      notes: ex.notes,
    }));

    try {
      await updateSession.mutateAsync({
        programId,
        sessionId: selectedSessionId,
        data: { exercises },
      });

      // Clear local state for this session after successful save
      setLocalExercises((prev) => {
        const next = { ...prev };
        delete next[selectedSessionId];
        return next;
      });
      setModifiedSessions((prev) => {
        const next = new Set(prev);
        next.delete(selectedSessionId);
        return next;
      });
    } catch {
      // Error handled by mutation
    }
  };

  // Get IDs of exercises already added to the current session
  const addedExerciseIds = useMemo(
    () => currentSessionExercises.map((ex) => ex.exercise_id),
    [currentSessionExercises]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)]">
        <div className="hidden md:block w-64 border-r bg-muted/30 p-4 space-y-2">
          <Skeleton className="h-5 w-20 mb-4" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !program) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/programs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Programs
        </Button>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-lg font-medium">Program not found</p>
            <p className="text-sm text-muted-foreground mt-2">
              The program you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have access to it.
            </p>
            <Button className="mt-4" onClick={() => router.push('/programs')}>
              Back to Programs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="border-b bg-background px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => router.push('/programs')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-xl font-semibold truncate">{program.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  <LayoutGrid className="h-3 w-3 mr-1" />
                  {SPLIT_TYPE_LABELS[program.split_type]}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {program.structure_type === 'WEEKLY' ? (
                    <Calendar className="h-3 w-3 mr-1" />
                  ) : (
                    <RefreshCw className="h-3 w-3 mr-1" />
                  )}
                  {STRUCTURE_TYPE_LABELS[program.structure_type]}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Session Selector */}
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden fixed bottom-4 left-4 z-50 h-14 gap-2 rounded-2xl bg-card border shadow-lg px-4"
            >
              <Menu className="h-5 w-5" />
              <span className="font-medium">
                {currentSession?.name || 'Sessions'}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0" title="Sessions">
            <SessionSidebar
              sessions={program.sessions || []}
              selectedSessionId={selectedSessionId}
              onSelectSession={handleSelectSession}
              onAddSession={() => {
                setIsAddSessionModalOpen(true);
                setIsMobileSidebarOpen(false);
              }}
              onDeleteSession={handleDeleteSession}
              onRenameSession={handleRenameSession}
              isMobile
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Session Sidebar */}
        <div className="hidden md:block">
          <SessionSidebar
            sessions={program.sessions || []}
            selectedSessionId={selectedSessionId}
            onSelectSession={handleSelectSession}
            onAddSession={() => setIsAddSessionModalOpen(true)}
            onDeleteSession={handleDeleteSession}
            onRenameSession={handleRenameSession}
          />
        </div>

        {/* Session Editor */}
        <SessionEditor
          session={currentSession}
          sessionExercises={currentSessionExercises}
          onUpdateExercise={handleUpdateExercise}
          onRemoveExercise={handleRemoveExercise}
          onReorderExercises={handleReorderExercises}
          onOpenExercisePicker={() => setIsExercisePickerOpen(true)}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={handleSaveSession}
          isSaving={updateSession.isPending}
        />
      </div>

      {/* Modals */}
      <AddSessionModal
        open={isAddSessionModalOpen}
        onOpenChange={setIsAddSessionModalOpen}
        onSubmit={handleAddSession}
        isLoading={createSession.isPending}
        existingSessionCount={program.sessions?.length || 0}
      />

      <ExercisePicker
        open={isExercisePickerOpen}
        onOpenChange={setIsExercisePickerOpen}
        onAddExercise={handleAddExercise}
        addedExerciseIds={addedExerciseIds}
      />
    </div>
  );
}
