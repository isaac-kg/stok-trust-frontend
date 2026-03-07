"use client";

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/shared/sidebar';
import { TopNavbar } from '@/components/shared/top-navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <TopNavbar />
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
