import { create } from 'zustand';
import { storage } from '@/services/storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'sprintdesk_theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDOM(resolved: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

const initialSavedTheme = storage.get<ThemeMode>(THEME_STORAGE_KEY, 'system');
const initialResolved = initialSavedTheme === 'system' ? getSystemTheme() : initialSavedTheme;
applyThemeToDOM(initialResolved);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialSavedTheme,
  resolvedTheme: initialResolved,

  setTheme: (theme: ThemeMode) => {
    storage.set(THEME_STORAGE_KEY, theme);
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    applyThemeToDOM(resolved);
    set({ theme, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const current = get().resolvedTheme;
    const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },
}));

export function useTheme() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeStore();
  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    setTheme,
    toggleTheme,
  };
}
