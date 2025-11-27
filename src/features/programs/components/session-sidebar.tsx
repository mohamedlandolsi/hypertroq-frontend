'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  Calendar,
  MoreHorizontal,
  Trash2,
  GripVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { ProgramSession } from '../types';

interface SessionSidebarProps {
  sessions: ProgramSession[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onAddSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  isLoading?: boolean;
}

export function SessionSidebar({
  sessions,
  selectedSessionId,
  onSelectSession,
  onAddSession,
  onDeleteSession,
  onRenameSession,
  isLoading,
}: SessionSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartEdit = (session: ProgramSession) => {
    setEditingId(session.id);
    setEditingName(session.name);
  };

  const handleSaveEdit = (sessionId: string) => {
    if (editingName.trim()) {
      onRenameSession(sessionId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, sessionId: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(sessionId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditingName('');
    }
  };

  if (isLoading) {
    return (
      <div className="w-64 border-r bg-muted/30 p-4 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-8" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Sessions
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onAddSession}
            title="Add Session"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.length === 0 ? (
          <div className="text-center py-8 px-4">
            <Calendar className="h-8 w-8 mx-auto text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mt-2">
              No sessions yet
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={onAddSession}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add First Session
            </Button>
          </div>
        ) : (
          sessions
            .sort((a, b) => a.order_in_program - b.order_in_program)
            .map((session) => (
              <div
                key={session.id}
                className={cn(
                  'group flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition-colors',
                  selectedSessionId === session.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                )}
                onClick={() => onSelectSession(session.id)}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

                {editingId === session.id ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleSaveEdit(session.id)}
                    onKeyDown={(e) => handleKeyDown(e, session.id)}
                    className="h-7 text-sm"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.exercise_count} exercises · {session.total_sets}{' '}
                        sets
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(session);
                          }}
                        >
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            ))
        )}
      </div>

      {/* Footer with stats */}
      {sessions.length > 0 && (
        <div className="p-4 border-t bg-muted/50">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{sessions.length} sessions</span>
            <span>
              {sessions.reduce((acc, s) => acc + s.total_sets, 0)} total sets
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
