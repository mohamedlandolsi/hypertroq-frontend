/**
 * Admin Dashboard Page
 * 
 * Main admin dashboard with platform management features.
 */

import { Metadata } from 'next';
import { 
  Users, 
  Dumbbell, 
  Activity, 
  TrendingUp,
  Settings,
  Database,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Dashboard | HypertroQ',
  description: 'Platform administration and management',
};

const adminCards = [
  {
    title: 'User Management',
    description: 'Manage users, roles, and permissions',
    icon: Users,
    href: '/admin/users',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Exercise Library',
    description: 'Manage global exercises and templates',
    icon: Dumbbell,
    href: '/admin/exercises',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
  {
    title: 'Platform Analytics',
    description: 'View usage statistics and metrics',
    icon: Activity,
    href: '/admin/analytics',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Subscriptions',
    description: 'Manage subscription plans and billing',
    icon: TrendingUp,
    href: '/admin/subscriptions',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    title: 'System Settings',
    description: 'Configure platform settings',
    icon: Settings,
    href: '/admin/settings',
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
  },
  {
    title: 'Database',
    description: 'Database management and backups',
    icon: Database,
    href: '/admin/database',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your platform, users, and content
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Load from API
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Load from API
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Exercises</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Load from API
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pro Subscribers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Load from API
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Sections */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Management</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href}>
                <Card className="hover:border-violet-500/50 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${card.bgColor}`}>
                        <Icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Security Note */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-amber-600 dark:text-amber-400">Security Notice</CardTitle>
          </div>
          <CardDescription>
            You are accessing the admin area. All actions are logged and monitored.
            Make sure to follow security best practices and only make changes you are authorized to make.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
