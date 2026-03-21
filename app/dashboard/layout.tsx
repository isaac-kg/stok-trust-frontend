"use client";

import { useCallback, useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/shared/sidebar';
import { TopNavbar } from '@/components/shared/top-navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const closeMobileNav = useCallback((): void => {
    setIsMobileNavOpen(false);
  }, []);

  const openMobileNav = useCallback((): void => {
    setIsMobileNavOpen(true);
  }, []);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    function handleEscape(e: KeyboardEvent): void {
      if (e.key === 'Escape') closeMobileNav();
    }

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen, closeMobileNav]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-main-color">
        {isMobileNavOpen ? (
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={closeMobileNav}
          />
        ) : null}
        <Sidebar isMobileOpen={isMobileNavOpen} onMobileClose={closeMobileNav} />
        <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
          <TopNavbar onMenuClick={openMobileNav} isMobileNavOpen={isMobileNavOpen} />
          <main className="flex-1 overflow-y-auto bg-main-color">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
