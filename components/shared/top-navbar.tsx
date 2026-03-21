"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';
import { clearAuth } from '@/features/auth/auth-slice';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { 
  LogOut,
  Shield,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface TopNavbarProps {
  className?: string;
  /** Opens the mobile / tablet sidebar drawer (screens below `lg`). */
  onMenuClick?: () => void;
  /** Mirrors mobile drawer state for `aria-expanded` on the menu control. */
  isMobileNavOpen?: boolean;
}

export function TopNavbar({
  className,
  onMenuClick,
  isMobileNavOpen = false,
}: TopNavbarProps): React.ReactElement {
  // const user = useAppSelector((state) => state.auth.user);\
  const user = {
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      profilePhotoUrl: 'https://via.placeholder.com/150',
    },
  };
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignOut = (): void => {
    dispatch(clearAuth());
    router.push('/signin');
  };

  return (
    <header className={cn('sticky top-0 z-20 h-16 border-b border-[#e2e8f0] bg-card', className)}>
      <div className="flex h-full items-center gap-2 px-4 sm:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          aria-label="Open navigation menu"
          aria-expanded={isMobileNavOpen}
          onClick={onMenuClick}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">StokTrust</span>
          </Link>
        <div className="min-w-0 flex-1 lg:hidden" />

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-0">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 border-none">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profile?.profilePhotoUrl} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm">
                  {user?.profile?.firstName?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline">{user?.profile?.firstName} {user?.profile?.lastName}</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b border-[#e2e8f0]">
                <p className="font-medium text-sm">{user?.profile?.firstName} {user?.profile?.lastName}</p>
                <p className="text-xs text-slate-500">{user?.profile?.email}</p>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
