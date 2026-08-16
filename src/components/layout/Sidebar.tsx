import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  Kanban,
  BarChart3,
  Layers,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    to: '/board',
    label: 'Sprint Board',
    icon: Kanban,
    badge: 'Active',
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    badge: null,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 transition-all duration-300 relative z-30 shrink-0 select-none',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 shrink-0">
            <Layers className="w-5 h-5" aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="font-extrabold text-base text-surface-900 dark:text-surface-50 tracking-tight leading-none">
                Sprint<span className="text-brand-600 dark:text-brand-400">Desk</span>
              </h1>
              <span className="text-[10px] font-semibold text-surface-400 uppercase tracking-widest">
                Enterprise Agile
              </span>
            </div>
          )}
        </div>

        {/* Collapse button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex p-1 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 dark:hover:text-surface-200 dark:hover:bg-surface-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold text-surface-400 uppercase tracking-wider px-3 mb-2">
          {!isCollapsed ? 'Workspace' : '•••'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group',
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold shadow-soft-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800/60 hover:text-surface-900 dark:hover:text-surface-100'
                )
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" aria-hidden="true" />
              {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Current Sprint Pill Widget */}
      {!isCollapsed && (
        <div className="p-4 m-3 rounded-2xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <span className="text-xs font-bold text-surface-900 dark:text-surface-100">Sprint 24</span>
          </div>
          <p className="text-[11px] text-surface-500 dark:text-surface-400 leading-relaxed mb-2.5">
            4 days remaining in current iteration.
          </p>
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: '68%' }} />
          </div>
        </div>
      )}
    </aside>
  );
};
