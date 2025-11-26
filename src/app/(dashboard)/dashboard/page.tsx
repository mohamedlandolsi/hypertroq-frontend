'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, ClipboardList, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Exercises',
      value: '0',
      description: 'Exercises in library',
      icon: Dumbbell,
      href: '/exercises',
    },
    {
      title: 'Active Programs',
      value: '0',
      description: 'Training programs',
      icon: ClipboardList,
      href: '/programs',
    },
    {
      title: 'Workouts This Week',
      value: '0',
      description: 'Sessions completed',
      icon: Calendar,
      href: '/workouts',
    },
    {
      title: 'Progress',
      value: '—',
      description: 'Weekly improvement',
      icon: TrendingUp,
      href: '/progress',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.full_name?.split(' ')[0] || 'Athlete'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s an overview of your training progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Browse Exercises
              </CardTitle>
              <CardDescription>
                Explore our exercise library with detailed instructions and muscle targeting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/exercises">View Exercises</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Create Program
              </CardTitle>
              <CardDescription>
                Build a personalized training program with AI-powered recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/programs/new">Create Program</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Track Progress
              </CardTitle>
              <CardDescription>
                View your training analytics and track your hypertrophy progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/progress">View Progress</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Getting Started Section */}
      <Card className="bg-linear-to-br from-primary/10 via-background to-background border-primary/20">
        <CardHeader>
          <CardTitle>Getting Started with HypertroQ</CardTitle>
          <CardDescription>
            New to HypertroQ? Here&apos;s how to get the most out of your training.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Explore the Exercise Library</p>
                <p className="text-sm text-muted-foreground">
                  Browse through our comprehensive collection of exercises with muscle targeting info.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Create Your Training Program</p>
                <p className="text-sm text-muted-foreground">
                  Design a program tailored to your goals, or let our AI coach help you.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Track & Optimize</p>
                <p className="text-sm text-muted-foreground">
                  Log your workouts and watch your progress with detailed analytics.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
