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
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignOut = (): void => {
    dispatch(clearAuth());
    router.push('/signin');
  };

  return (
    <header className={cn('sticky top-0 z-20 h-16 border-b bg-card', className)}>
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
        <div className="min-w-0 flex-1 lg:hidden" />

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
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
              <Button variant="ghost" className="flex items-center gap-2 h-auto py-2 px-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                  {user?.profile?.firstName?.[0]?.toUpperCase() || user?.profile?.lastName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium leading-none">
                    {user?.profile?.firstName} {user?.profile?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground leading-none mt-1">
                    {user?.profile?.idNumber || 'User'}
                  </p>
                </div>
                <svg className="h-4 w-4 text-muted-foreground hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.profile?.firstName} {user?.profile?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.profile?.idNumber || 'User'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
