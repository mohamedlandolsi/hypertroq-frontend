'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Plus,
  GripVertical,
  Trash2,
  Dumbbell,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProgramSession, SessionExerciseWithDetails } from '../types';
import { EQUIPMENT_LABELS } from '@/features/exercises/types';
import type { Equipment } from '@/features/exercises/types';

interface SessionEditorProps {
  session: ProgramSession | null;
  sessionExercises: SessionExerciseWithDetails[];
  onUpdateExercise: (
    exerciseId: string,
    updates: Partial<SessionExerciseWithDetails>
  ) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: SessionExerciseWithDetails[]) => void;
  onOpenExercisePicker: () => void;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  isSaving: boolean;
}

export function SessionEditor({
  session,
  sessionExercises,
  onUpdateExercise,
  onRemoveExercise,
  onReorderExercises,
  onOpenExercisePicker,
  hasUnsavedChanges,
  onSave,
  isSaving,
}: SessionEditorProps) {
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    null
  );

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/30" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Select a session
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a session from the sidebar to start editing
          </p>
        </div>
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sessionExercises.findIndex((ex) => ex.id === active.id);
      const newIndex = sessionExercises.findIndex((ex) => ex.id === over.id);

      const newExercises = arrayMove(sessionExercises, oldIndex, newIndex);

      // Update order_in_session
      newExercises.forEach((ex, i) => {
        ex.order_in_session = i + 1;
      });

      onReorderExercises(newExercises);
    }
  };

  const totalSets = sessionExercises.reduce((acc, ex) => acc + (ex.sets || 0), 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Session Header */}
      <div className="border-b bg-background px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-semibold truncate">{session.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {sessionExercises.length} exercises · {totalSets} sets
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-amber-600 border-amber-300 hidden sm:flex">
                Unsaved
              </Badge>
            )}
            <Button
              onClick={onSave}
              disabled={!hasUnsavedChanges || isSaving}
              size="sm"
              className={hasUnsavedChanges ? 'animate-pulse' : ''}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
        {sessionExercises.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Dumbbell className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="mt-4 text-lg font-medium">No exercises yet</p>
              <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
                Add exercises to this session to start building your workout.
              </p>
              <Button className="mt-6" onClick={onOpenExercisePicker}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Exercise
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sessionExercises.map((ex) => ex.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {sessionExercises.map((exercise, index) => (
                  <SortableExerciseRow
                    key={exercise.id}
                    exercise={exercise}
                    index={index}
                    isExpanded={expandedExerciseId === exercise.id}
                    onToggleExpand={() =>
                      setExpandedExerciseId(
                        expandedExerciseId === exercise.id ? null : exercise.id
                      )
                    }
                    onUpdate={(updates) => onUpdateExercise(exercise.id, updates)}
                    onRemove={() => onRemoveExercise(exercise.id)}
                  />
                ))}

                {/* Add Exercise Button */}
                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={onOpenExercisePicker}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

interface SortableExerciseRowProps {
  exercise: SessionExerciseWithDetails;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<SessionExerciseWithDetails>) => void;
  onRemove: () => void;
}

function SortableExerciseRow({
  exercise,
  index,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onRemove,
}: SortableExerciseRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'transition-shadow',
        isExpanded && 'ring-1 ring-primary/20',
        isDragging && 'opacity-50 shadow-lg ring-2 ring-primary/40 z-50'
      )}
    >
      <CardContent className="p-0">
        {/* Main Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 md:p-4">
          {/* Top row on mobile: Order, Name, Actions */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto sm:flex-1">
            {/* Drag Handle & Order */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                className="touch-none cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-muted transition-colors"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground/50" />
              </button>
              <span className="text-sm font-medium text-muted-foreground w-5">
                {index + 1}
              </span>
            </div>

            {/* Exercise Info */}
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={onToggleExpand}
            >
              <div className="flex items-center gap-2">
                <p className="font-medium truncate text-sm md:text-base">{exercise.exercise_name}</p>
                {exercise.equipment && (
                  <Badge variant="secondary" className="text-xs shrink-0 hidden sm:flex">
                    {EQUIPMENT_LABELS[exercise.equipment as Equipment] ||
                      exercise.equipment}
                  </Badge>
                )}
              </div>
              {exercise.primary_muscles && exercise.primary_muscles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {exercise.primary_muscles.join(', ')}
                </p>
              )}
            </div>

            {/* Mobile-only inline actions */}
            <div className="flex items-center gap-1 sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={onRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bottom row on mobile: Inputs */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Sets */}
            <div className="flex-1 sm:flex-initial">
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1 text-center">
                Target Sets
              </label>
              <Input
                type="number"
                min={1}
                max={20}
                value={exercise.sets || 3}
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 1);
                  onUpdate({ sets: value });
                }}
                className="w-full sm:w-20 h-10 text-center text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Reps */}
            <div className="flex-1 sm:flex-initial">
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1 text-center">
                Target Reps
              </label>
              <Input
                type="text"
                placeholder="8-12"
                value={exercise.target_reps || ''}
                onChange={(e) => onUpdate({ target_reps: e.target.value })}
                className="w-full sm:w-24 h-10 text-center text-sm font-medium"
              />
            </div>

            {/* Desktop Delete Button */}
            <div className="hidden sm:flex items-end pb-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                onClick={onRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Notes Section */}
        {isExpanded && (
          <div className="px-3 md:px-4 pb-3 md:pb-4 pt-0 border-t bg-muted/30">
            <div className="flex items-start gap-2 pt-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-2 hidden sm:block" />
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Notes
                </label>
                <Input
                  placeholder="Add notes for this exercise..."
                  value={exercise.notes || ''}
                  onChange={(e) => onUpdate({ notes: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
