'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dumbbell, Search, Plus, Filter } from 'lucide-react';

export default function ExercisesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
          <p className="text-muted-foreground">
            Browse and manage your exercise library.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Exercise
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Empty State */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Dumbbell className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4 text-xl">No exercises yet</CardTitle>
          <CardDescription className="mt-2 text-center max-w-sm">
            Get started by adding exercises to your library. You can create custom exercises or import from our database.
          </CardDescription>
          <Button className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Exercise
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
