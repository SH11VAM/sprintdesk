import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNavigation } from './MobileNavigation';
import { CreateTaskModal } from '@/features/board/components/CreateTaskModal';
import { ToastContainer } from '@/components/ui/Toast';
import { useNotificationPolling } from '@/features/notifications/hooks/useNotificationPolling';

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  // Initialize smart notification polling
  useNotificationPolling();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-50 dark:bg-surface-950">
      {/* Sidebar (Desktop & Tablet) */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Column */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenCreateTaskModal={() => setIsCreateTaskModalOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Drawer Navigation & Bottom Bar */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenCreateTaskModal={() => setIsCreateTaskModalOpen(true)}
      />

      {/* Global Task Creation Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
      />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
