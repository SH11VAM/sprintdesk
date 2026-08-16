import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { NotificationPopover } from '@/features/notifications/components/NotificationPopover';
import { Button } from '@/components/ui/Button';
import {
  Sun,
  Moon,
  Plus,
  Menu,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenCreateTaskModal: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Sprint Overview', subtitle: 'Real-time performance metrics and recent team activity' },
  '/board': { title: 'Active Sprint Board', subtitle: 'Manage, reorder, and track tasks across development lifecycle' },
  '/analytics': { title: 'Sprint Analytics', subtitle: 'Velocity, status distribution, and burndown trajectories' },
};

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, onOpenCreateTaskModal }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const currentPage = pageTitles[location.pathname] || {
    title: 'SprintDesk',
    subtitle: 'Sprint Management Dashboard',
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="h-16 border-b border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4 select-none">
      {/* Left: Mobile Menu Trigger + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="md:hidden p-2 rounded-xl text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:hover:text-surface-100 dark:hover:bg-surface-800 focus-ring"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-extrabold text-surface-900 dark:text-surface-50 tracking-tight truncate">
            {currentPage.title}
          </h2>
          <p className="hidden md:block text-[11px] text-surface-500 dark:text-surface-400 truncate">
            {currentPage.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Create Task */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenCreateTaskModal}
          leftIcon={<Plus className="w-4 h-4" aria-hidden="true" />}
          className="hidden sm:inline-flex shadow-sm shadow-brand-500/20"
        >
          New Task
        </Button>

        {/* Notification Bell */}
        <NotificationPopover />

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2 rounded-xl text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-800 transition-colors focus-ring"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
          ) : (
            <Moon className="w-5 h-5 text-surface-600" aria-hidden="true" />
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-expanded={isProfileOpen}
            aria-label="User menu"
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus-ring"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.username}
                width="28"
                height="28"
                loading="lazy"
                decoding="async"
                className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-500/30"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                {user?.firstName ? user.firstName.charAt(0) : 'U'}
              </div>
            )}
            <span className="hidden sm:block text-xs font-semibold text-surface-800 dark:text-surface-200">
              {user?.firstName || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-surface-400" aria-hidden="true" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-xl z-50 p-2 text-left animate-fade-in">
              <div className="px-3 py-2.5 border-b border-surface-100 dark:border-surface-800">
                <p className="text-xs font-bold text-surface-900 dark:text-surface-100">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-surface-500 dark:text-surface-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
