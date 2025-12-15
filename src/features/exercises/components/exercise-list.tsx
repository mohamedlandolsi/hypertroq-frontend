'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dumbbell, 
  Globe, 
  Building2, 
  Layers, 
  ChevronDown, 
  Play,
  ImageIcon,
  Gauge,
  ArrowLeftRight,
  MoreVertical,
  Pencil,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { DeleteExerciseDialog } from './delete-exercise-dialog';
import { EditExerciseModal } from './edit-exercise-modal';
import type { Exercise, MuscleGroup, DifficultyLevel, ForceType } from '../types';
import { 
  MUSCLE_GROUP_LABELS, 
  MUSCLE_GROUP_COLORS, 
  EQUIPMENT_LABELS,
  DIFFICULTY_LABELS,
  FORCE_TYPE_LABELS
} from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
}

/**
 * Parses video URL to determine if it's YouTube, Vimeo, or direct video
 */
function parseVideoUrl(url: string): { type: 'youtube' | 'vimeo' | 'direct'; embedUrl: string } | null {
  // YouTube patterns
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

  // Vimeo patterns
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Direct video URL (mp4, webm, etc.)
  if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
    return {
      type: 'direct',
      embedUrl: url,
    };
  }

  return null;
}

/**
 * Video Player component that handles YouTube, Vimeo, and direct video URLs
 */
function VideoPlayer({ url }: { url: string }) {
  const parsed = parseVideoUrl(url);

  if (!parsed) {
    return (
      <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">Unsupported video format</p>
      </div>
    );
  }

  if (parsed.type === 'direct') {
    return (
      <video
        className="w-full h-auto rounded-lg"
        controls
        preload="metadata"
      >
        <source src={parsed.embedUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  // YouTube or Vimeo iframe
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
      <iframe
        src={parsed.embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Exercise video"
      />
    </div>
  );
}

/**
 * Difficulty badge with appropriate styling
 */
function DifficultyBadge({ level }: { level: DifficultyLevel }) {
  const colors: Record<DifficultyLevel, string> = {
    BEGINNER: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    INTERMEDIATE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    ADVANCED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <Badge variant="secondary" className={cn('text-xs', colors[level])}>
      <Gauge className="h-3 w-3 mr-1" />
      {DIFFICULTY_LABELS[level]}
    </Badge>
  );
}

/**
 * Force type badge
 */
function ForceTypeBadge({ forceType }: { forceType: ForceType }) {
  const colors: Record<ForceType, string> = {
    PUSH: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    PULL: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    STATIC: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  };

  return (
    <Badge variant="secondary" className={cn('text-xs', colors[forceType])}>
      <ArrowLeftRight className="h-3 w-3 mr-1" />
      {FORCE_TYPE_LABELS[forceType]}
    </Badge>
  );
}

export function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Get current user for permission check
  const user = useAuthStore((state) => state.user);
  
  // Check if user can edit/delete this exercise
  const canManageExercise = user && (
    user.role === 'ADMIN' || 
    user.id === exercise.created_by_user_id
  );
  
  // Get primary muscle groups from the exercise
  const primaryMuscles = exercise.primary_muscles || [];
  const secondaryMuscles = exercise.secondary_muscles || [];

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      className={cn(
        'group transition-all hover:shadow-md hover:border-primary/50 overflow-hidden',
        onClick && 'cursor-pointer'
      )}
      onClick={handleCardClick}
    >
      {/* Collapsed View - Always visible */}
      <div className="flex">
        {/* Thumbnail */}
        <div className="relative w-24 h-24 shrink-0 bg-muted">
          {exercise.image_url ? (
            <Image
              src={exercise.image_url}
              alt={exercise.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}
          {/* Video indicator */}
          {exercise.video_url && (
            <div className="absolute bottom-1 right-1 bg-black/70 rounded-full p-1">
              <Play className="h-3 w-3 text-white fill-white" />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <CardHeader className="pb-2 pt-3 px-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {exercise.name}
              </CardTitle>
              <div className="flex items-center gap-1 shrink-0">
                {exercise.is_compound && (
                  <span title="Compound exercise">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </span>
                )}
                {exercise.is_global ? (
                  <span title="Global exercise">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </span>
                ) : (
                  <span title="Organization exercise">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </span>
                )}
                {/* Context Menu - Only show if user can manage */}
                {canManageExercise && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0 space-y-2">
            {/* Primary Muscle & Equipment - Compact view */}
            <div className="flex flex-wrap items-center gap-1.5">
              {primaryMuscles.slice(0, 2).map((muscleName) => {
                const muscleKey = Object.entries(MUSCLE_GROUP_LABELS).find(
                  ([, label]) => label === muscleName
                )?.[0] as MuscleGroup | undefined;
                
                return (
                  <Badge
                    key={muscleName}
                    variant="secondary"
                    className={cn(
                      'text-xs font-medium py-0',
                      muscleKey ? MUSCLE_GROUP_COLORS[muscleKey] : 'bg-primary/10 text-primary'
                    )}
                  >
                    {muscleName}
                  </Badge>
                );
              })}
              {primaryMuscles.length > 2 && (
                <Badge variant="outline" className="text-xs py-0">
                  +{primaryMuscles.length - 2}
                </Badge>
              )}
            </div>

            {/* Equipment */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs py-0">
                <Dumbbell className="h-3 w-3 mr-1" />
                {exercise.equipment_name || EQUIPMENT_LABELS[exercise.equipment] || exercise.equipment}
              </Badge>
              
              {/* Expand Button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleExpandClick}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>

      {/* Expanded View - Animated */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t space-y-4">
              {/* Full Description */}
              {exercise.description && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Description
                  </h4>
                  <p className="text-sm text-foreground">
                    {exercise.description}
                  </p>
                </div>
              )}

              {/* Secondary Muscles */}
              {secondaryMuscles.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Secondary Muscles
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {secondaryMuscles.map((muscleName) => {
                      const muscleKey = Object.entries(MUSCLE_GROUP_LABELS).find(
                        ([, label]) => label === muscleName
                      )?.[0] as MuscleGroup | undefined;
                      
                      return (
                        <Badge
                          key={muscleName}
                          variant="outline"
                          className={cn(
                            'text-xs',
                            muscleKey ? MUSCLE_GROUP_COLORS[muscleKey] : ''
                          )}
                        >
                          {muscleName}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Difficulty & Force Type */}
              {(exercise.difficulty_level || exercise.force_type) && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Details
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {exercise.difficulty_level && (
                      <DifficultyBadge level={exercise.difficulty_level} />
                    )}
                    {exercise.force_type && (
                      <ForceTypeBadge forceType={exercise.force_type} />
                    )}
                  </div>
                </div>
              )}

              {/* Video Player */}
              {exercise.video_url && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Video Tutorial
                  </h4>
                  <VideoPlayer url={exercise.video_url} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit/Delete Dialogs - Rendered outside Card click handler */}
      <DeleteExerciseDialog
        exercise={exercise}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
      <EditExerciseModal
        exercise={isEditModalOpen ? exercise : null}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </Card>
  );
}

interface ExerciseListProps {
  exercises: Exercise[];
  isLoading?: boolean;
  onExerciseClick?: (exercise: Exercise) => void;
}

export function ExerciseList({ exercises, isLoading, onExerciseClick }: ExerciseListProps) {
  // Ensure exercises is always an array
  const exerciseList = Array.isArray(exercises) ? exercises : [];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ExerciseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (exerciseList.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Dumbbell className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mt-4 text-lg font-medium">No exercises found</p>
          <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
            Try adjusting your filters or search query to find what you&apos;re looking for.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {exerciseList.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onClick={() => onExerciseClick?.(exercise)}
        />
      ))}
    </div>
  );
}

function ExerciseCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
