import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useToastStore } from '../useToast';

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.getState().clearToasts();
    vi.useRealTimers();
  });

  it('adds a toast notification successfully', () => {
    const id = useToastStore.getState().addToast({
      type: 'success',
      title: 'Task Created',
      message: 'Task #10 was created successfully',
      duration: 5000,
    });

    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].id).toBe(id);
    expect(toasts[0].title).toBe('Task Created');
    expect(toasts[0].type).toBe('success');
  });

  it('removes a toast notification by ID', () => {
    const id = useToastStore.getState().addToast({
      type: 'info',
      title: 'Info Notice',
      duration: 0,
    });

    expect(useToastStore.getState().toasts).toHaveLength(1);

    useToastStore.getState().removeToast(id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('auto-dismisses a toast after specified duration', () => {
    vi.useFakeTimers();

    useToastStore.getState().addToast({
      type: 'warning',
      title: 'Warning Alert',
      duration: 3000,
    });

    expect(useToastStore.getState().toasts).toHaveLength(1);

    // Fast-forward 3000ms
    vi.advanceTimersByTime(3000);

    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('clears all active toasts', () => {
    useToastStore.getState().addToast({ type: 'info', title: 'T1', duration: 0 });
    useToastStore.getState().addToast({ type: 'error', title: 'T2', duration: 0 });

    expect(useToastStore.getState().toasts).toHaveLength(2);

    useToastStore.getState().clearToasts();
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
