'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, Plus } from 'lucide-react';
import {
  ProgramList,
  CreateProgramModal,
  usePrograms,
} from '@/features/programs';
import type { ProgramListItem } from '@/features/programs';

export default function ProgramsPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch user's programs (non-templates only)
  const { data: programs = [], isLoading } = usePrograms({ is_template: false });

  const handleProgramClick = (program: ProgramListItem) => {
    router.push(`/programs/${program.id}/edit`);
  };

  const hasPrograms = programs.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
          <p className="text-muted-foreground">
            Create and manage your training programs.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Program
        </Button>
      </div>

      {/* Program List or Empty State */}
      {hasPrograms || isLoading ? (
        <ProgramList
          programs={programs}
          isLoading={isLoading}
          onProgramClick={handleProgramClick}
        />
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4 text-xl">No programs yet</CardTitle>
            <CardDescription className="mt-2 text-center max-w-sm">
              Create your first training program. Our AI coach can help you
              design an optimized hypertrophy program.
            </CardDescription>
            <Button className="mt-6" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Program
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Program Modal */}
      <CreateProgramModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
