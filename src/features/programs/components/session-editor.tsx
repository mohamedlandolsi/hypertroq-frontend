'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Plus,
  GripVertical,
  Trash2,
  Dumbbell,
  ChevronDown,
  ChevronUp,
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

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const newExercises = [...sessionExercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newExercises.length) return;

    // Swap exercises
    [newExercises[index], newExercises[targetIndex]] = [
      newExercises[targetIndex],
      newExercises[index],
    ];

    // Update order_in_session
    newExercises.forEach((ex, i) => {
      ex.order_in_session = i + 1;
    });

    onReorderExercises(newExercises);
  };

  const totalSets = sessionExercises.reduce((acc, ex) => acc + (ex.sets || 0), 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Session Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{session.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {sessionExercises.length} exercises · {totalSets} sets
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-amber-600 border-amber-300">
                Unsaved changes
              </Badge>
            )}
            <Button
              onClick={onSave}
              disabled={!hasUnsavedChanges || isSaving}
              size="sm"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto p-6">
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
          <div className="space-y-3">
            {sessionExercises.map((exercise, index) => (
              <ExerciseRow
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
                onMoveUp={() => moveExercise(index, 'up')}
                onMoveDown={() => moveExercise(index, 'down')}
                canMoveUp={index > 0}
                canMoveDown={index < sessionExercises.length - 1}
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
        )}
      </div>
    </div>
  );
}

interface ExerciseRowProps {
  exercise: SessionExerciseWithDetails;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<SessionExerciseWithDetails>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function ExerciseRow({
  exercise,
  index,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: ExerciseRowProps) {
  return (
    <Card
      className={cn(
        'transition-shadow',
        isExpanded && 'ring-1 ring-primary/20'
      )}
    >
      <CardContent className="p-0">
        {/* Main Row */}
        <div className="flex items-center gap-3 p-4">
          {/* Drag Handle & Order */}
          <div className="flex items-center gap-1">
            <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
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
              <p className="font-medium truncate">{exercise.exercise_name}</p>
              {exercise.equipment && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  {EQUIPMENT_LABELS[exercise.equipment as Equipment] ||
                    exercise.equipment}
                </Badge>
              )}
            </div>
            {exercise.primary_muscles && exercise.primary_muscles.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {exercise.primary_muscles.join(', ')}
              </p>
            )}
          </div>

          {/* Quick Inputs */}
          <div className="flex items-center gap-4">
            {/* Sets */}
            <div className="text-center">
              <Input
                type="number"
                min={1}
                max={10}
                value={exercise.sets || 3}
                onChange={(e) => onUpdate({ sets: parseInt(e.target.value) || 3 })}
                className="w-16 h-8 text-center text-sm"
              />
              <span className="text-[10px] text-muted-foreground uppercase">
                Sets
              </span>
            </div>

            {/* Reps */}
            <div className="text-center">
              <Input
                type="text"
                placeholder="8-12"
                value={exercise.target_reps || ''}
                onChange={(e) => onUpdate({ target_reps: e.target.value })}
                className="w-20 h-8 text-center text-sm"
              />
              <span className="text-[10px] text-muted-foreground uppercase">
                Reps
              </span>
            </div>

            {/* RPE */}
            <div className="text-center">
              <Input
                type="number"
                min={1}
                max={10}
                placeholder="8"
                value={exercise.rpe || ''}
                onChange={(e) =>
                  onUpdate({ rpe: parseInt(e.target.value) || undefined })
                }
                className="w-14 h-8 text-center text-sm"
              />
              <span className="text-[10px] text-muted-foreground uppercase">
                RPE
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onMoveUp}
              disabled={!canMoveUp}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onMoveDown}
              disabled={!canMoveDown}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expanded Notes Section */}
        {isExpanded && (
          <div className="px-4 pb-4 pt-0 border-t bg-muted/30">
            <div className="flex items-start gap-2 pt-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-2" />
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Notes
                </label>
                <Input
                  placeholder="Add notes for this exercise (e.g., focus on mind-muscle connection)"
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
