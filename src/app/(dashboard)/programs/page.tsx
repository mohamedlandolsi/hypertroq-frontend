'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, Plus } from 'lucide-react';

export default function ProgramsPage() {
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Program
        </Button>
      </div>

      {/* Empty State */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4 text-xl">No programs yet</CardTitle>
          <CardDescription className="mt-2 text-center max-w-sm">
            Create your first training program. Our AI coach can help you design an optimized hypertrophy program.
          </CardDescription>
          <Button className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Program
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
