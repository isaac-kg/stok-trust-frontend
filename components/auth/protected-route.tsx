"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): React.ReactElement | null {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  //TODO UNCOMMENT THIS WHEN THE NAVIGATION BAR IS CREATED.
  
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/signin');
  //   }
  // }, [isAuthenticated, router]);

  // if (!isAuthenticated) {
  //   return null;
  // }

  return <>{children}</>;
}
