import React from 'react';
import { NavLink } from 'react-router-dom';
import { Modal } from '@/components/ui/Modal';
import { LayoutDashboard, Kanban, BarChart3, Layers, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateTaskModal: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/board', label: 'Sprint Board', icon: Kanban },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  onOpenCreateTaskModal,
}) => {
  return (
    <>
      {/* Mobile Drawer Menu Modal */}
      <Modal isOpen={isOpen} onClose={onClose} title="Menu" maxWidth="sm">
        <div className="space-y-3 py-2 text-left">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-brand-50/50 dark:bg-brand-950/40 border border-brand-200/50 dark:border-brand-900/50 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-surface-900 dark:text-surface-100">SprintDesk</div>
              <div className="text-[10px] text-surface-500">Enterprise Sprint Dashboard</div>
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400'
                        : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                    )
                  }
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* Mobile Bottom Fixed Tab Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md border-t border-surface-200 dark:border-surface-800 flex items-center justify-around px-2"
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-16 py-1 text-[11px] font-medium transition-colors',
              isActive
                ? 'text-brand-600 dark:text-brand-400 font-bold'
                : 'text-surface-500 dark:text-surface-400'
            )
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" aria-hidden="true" />
          Dashboard
        </NavLink>

        <NavLink
          to="/board"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-16 py-1 text-[11px] font-medium transition-colors',
              isActive
                ? 'text-brand-600 dark:text-brand-400 font-bold'
                : 'text-surface-500 dark:text-surface-400'
            )
          }
        >
          <Kanban className="w-5 h-5 mb-0.5" aria-hidden="true" />
          Board
        </NavLink>

        {/* Center Quick Add Button */}
        <button
          type="button"
          onClick={onOpenCreateTaskModal}
          aria-label="Create Task"
          className="w-11 h-11 -mt-4 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/30 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" aria-hidden="true" />
        </button>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-16 py-1 text-[11px] font-medium transition-colors',
              isActive
                ? 'text-brand-600 dark:text-brand-400 font-bold'
                : 'text-surface-500 dark:text-surface-400'
            )
          }
        >
          <BarChart3 className="w-5 h-5 mb-0.5" aria-hidden="true" />
          Analytics
        </NavLink>
      </nav>
    </>
  );
};
