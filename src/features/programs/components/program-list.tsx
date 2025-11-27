'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ClipboardList,
  Calendar,
  RefreshCw,
  LayoutGrid,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProgramListItem, SplitType, StructureType } from '../types';
import { SPLIT_TYPE_LABELS, STRUCTURE_TYPE_LABELS } from '../types';

// Colors for split types
const SPLIT_TYPE_COLORS: Record<SplitType, string> = {
  UPPER_LOWER:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  PUSH_PULL_LEGS:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  FULL_BODY:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  BRO_SPLIT:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  ARNOLD_SPLIT:
    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  CUSTOM: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
};

interface ProgramCardProps {
  program: ProgramListItem;
  onClick?: () => void;
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
  // Format the last updated date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      className={cn(
        'group transition-all hover:shadow-md hover:border-primary/50',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {program.name}
          </CardTitle>
          {program.is_template && (
            <Badge variant="outline" className="shrink-0 text-xs">
              Template
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Description */}
        {program.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {program.description}
          </p>
        )}

        {/* Split Type Badge */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className={cn(
              'text-xs font-medium',
              SPLIT_TYPE_COLORS[program.split_type]
            )}
          >
            <LayoutGrid className="h-3 w-3 mr-1" />
            {SPLIT_TYPE_LABELS[program.split_type]}
          </Badge>

          {/* Structure Type Badge */}
          <Badge variant="outline" className="text-xs">
            {program.structure_type === 'WEEKLY' ? (
              <Calendar className="h-3 w-3 mr-1" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            {STRUCTURE_TYPE_LABELS[program.structure_type]}
          </Badge>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Updated {formatDate(program.updated_at)}</span>
          </div>
          {program.session_count !== undefined && (
            <span>{program.session_count} sessions</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ProgramListProps {
  programs: ProgramListItem[];
  isLoading?: boolean;
  onProgramClick?: (program: ProgramListItem) => void;
}

export function ProgramList({
  programs,
  isLoading,
  onProgramClick,
}: ProgramListProps) {
  // Ensure programs is always an array
  const programList = Array.isArray(programs) ? programs : [];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProgramCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (programList.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mt-4 text-lg font-medium">No programs found</p>
          <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
            Create your first training program to get started with your
            hypertrophy journey.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {programList.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          onClick={() => onProgramClick?.(program)}
        />
      ))}
    </div>
  );
}

function ProgramCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex justify-between pt-2 border-t">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
