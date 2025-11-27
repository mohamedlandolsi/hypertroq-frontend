'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageWrapper, StaggerContainer, StaggerItem, FadeIn } from '@/components/layout/page-wrapper';
import { 
  Dumbbell, 
  ClipboardList, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  Plus,
  Target,
  Flame,
  Trophy,
  Zap,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    {
      title: 'Workouts Completed',
      value: '24',
      change: '+3 this week',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'hover:border-orange-500/30',
    },
    {
      title: 'Active Programs',
      value: '2',
      change: 'Push/Pull/Legs',
      icon: ClipboardList,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
      borderColor: 'hover:border-violet-500/30',
    },
    {
      title: 'Weekly Volume',
      value: '156',
      change: 'Total sets',
      icon: BarChart3,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'hover:border-emerald-500/30',
    },
    {
      title: 'Current Streak',
      value: '7',
      change: 'Days in a row',
      icon: Trophy,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'hover:border-amber-500/30',
    },
  ];

  const quickActions = [
    {
      title: 'Log Workout',
      description: 'Record your training session',
      icon: Plus,
      href: '/workouts/log',
      color: 'text-white',
      bgColor: 'bg-linear-to-br from-violet-500 to-indigo-600',
      hoverBg: 'hover:from-violet-600 hover:to-indigo-700',
    },
    {
      title: 'Create Program',
      description: 'Build a new training plan',
      icon: ClipboardList,
      href: '/programs/new',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      hoverBg: 'hover:bg-indigo-500/20',
    },
    {
      title: 'Browse Exercises',
      description: 'Explore exercise library',
      icon: Dumbbell,
      href: '/exercises',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      hoverBg: 'hover:bg-emerald-500/20',
    },
    {
      title: 'View Progress',
      description: 'Check your analytics',
      icon: TrendingUp,
      href: '/progress',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
      hoverBg: 'hover:bg-amber-500/20',
    },
  ];

  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* Welcome Hero Section */}
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-violet-500/10 via-indigo-500/5 to-transparent p-8 md:p-10">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
            
            <div className="relative">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-2">
                {getGreeting()}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                Welcome back, <br className="md:hidden" />
                <span className="text-gradient">{user?.full_name?.split(' ')[0] || 'Athlete'}</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                You&apos;re on a <span className="text-amber-500 font-semibold">7-day streak</span>! 
                Keep pushing to hit your hypertrophy goals.
              </p>
              
              {/* Mini stats inline */}
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10">
                    <Target className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">This Week</p>
                    <p className="font-semibold">5 workouts</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-violet-500/10">
                    <Zap className="h-4 w-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="font-semibold">+12% vs last week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Bento Grid - Metrics Cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4 tracking-tight flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            Your Stats
          </h2>
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <StaggerItem key={stat.title}>
                  <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${stat.borderColor}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                          <Icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-3xl md:text-4xl font-bold tracking-tight">{stat.value}</p>
                        <p className="text-sm font-medium text-foreground">{stat.title}</p>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Quick Actions Row */}
        <div>
          <h2 className="text-xl font-semibold mb-4 tracking-tight flex items-center gap-2">
            <Zap className="h-5 w-5 text-muted-foreground" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const isGradient = index === 0;
              
              return (
                <Link key={action.title} href={action.href}>
                  <Card className={`group h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isGradient ? 'border-transparent' : ''}`}>
                    <CardContent className={`p-5 h-full flex flex-col items-center text-center ${isGradient ? action.bgColor + ' rounded-2xl' : ''}`}>
                      <div className={`p-4 rounded-2xl mb-3 transition-all duration-300 ${isGradient ? 'bg-white/20' : action.bgColor} ${action.hoverBg}`}>
                        <Icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <p className={`font-semibold ${isGradient ? 'text-white' : ''}`}>{action.title}</p>
                      <p className={`text-xs mt-1 ${isGradient ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Row - Getting Started + Recent Activity */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Getting Started - Takes 3 columns */}
          <Card className="lg:col-span-3 overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                Getting Started with HypertroQ
              </CardTitle>
              <CardDescription>
                New to HypertroQ? Here&apos;s how to maximize your gains.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Explore the Exercise Library', desc: 'Browse 100+ exercises with muscle targeting info' },
                  { step: 2, title: 'Create Your Training Program', desc: 'Design a program or use AI-powered recommendations' },
                  { step: 3, title: 'Track & Optimize', desc: 'Log workouts and watch your progress with analytics' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 text-white text-sm font-bold shrink-0 transition-transform group-hover:scale-110">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <Button asChild variant="gradient" className="w-full sm:w-auto">
                  <Link href="/exercises" className="flex items-center gap-2">
                    Start Exploring
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity - Takes 2 columns */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest training sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Push Day', time: 'Today, 8:30 AM', sets: 24, color: 'bg-violet-500' },
                  { name: 'Pull Day', time: 'Yesterday', sets: 22, color: 'bg-indigo-500' },
                  { name: 'Leg Day', time: '2 days ago', sets: 20, color: 'bg-emerald-500' },
                ].map((workout, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className={`h-2 w-2 rounded-full ${workout.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{workout.name}</p>
                      <p className="text-xs text-muted-foreground">{workout.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{workout.sets}</p>
                      <p className="text-xs text-muted-foreground">sets</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button asChild variant="ghost" className="w-full mt-4">
                <Link href="/workouts" className="flex items-center justify-center gap-2">
                  View All Workouts
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
