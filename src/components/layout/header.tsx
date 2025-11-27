'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { MobileSidebar } from './sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronRight, LogOut, User, Settings, Bell } from 'lucide-react';

// Helper to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  
  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { title, href };
  });
}

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const breadcrumbs = generateBreadcrumbs(pathname);

  // Get user initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="glass-header sticky top-0 z-40 flex h-16 items-center gap-4 px-4 md:px-6">
      {/* Mobile Sidebar Toggle */}
      <MobileSidebar />

      {/* Breadcrumbs */}
      <nav className="hidden md:flex items-center space-x-1 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-border" />}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">{crumb.title}</span>
            ) : (
              <Link 
                href={crumb.href}
                className="hover:text-foreground transition-colors duration-200"
              >
                {crumb.title}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Mobile Title */}
      <div className="md:hidden flex-1">
        <span className="font-semibold text-foreground">
          {breadcrumbs[breadcrumbs.length - 1]?.title || 'Dashboard'}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1 hidden md:block" />

      {/* Notification Bell */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative h-9 w-9 rounded-xl hover:bg-accent transition-colors duration-200"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {/* Notification dot */}
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-500" />
        <span className="sr-only">Notifications</span>
      </Button>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-violet-500/20 transition-all duration-200"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.profile_image_url || ''} alt={user?.full_name || 'User'} />
              <AvatarFallback className="bg-linear-to-br from-violet-500 to-indigo-600 text-white font-medium text-sm">
                {getInitials(user?.full_name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-xl shadow-soft-lg" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none">{user?.full_name || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer rounded-lg">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer rounded-lg">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
