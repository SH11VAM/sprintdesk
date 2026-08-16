import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React application error:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface-50 dark:bg-surface-950 text-center">
          <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-xl space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50">
                Something went wrong
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
                An unexpected error occurred in the application view. We apologize for the inconvenience.
              </p>
              {this.state.error && (
                <div className="p-3 bg-surface-100 dark:bg-surface-800 rounded-xl text-left font-mono text-[11px] text-rose-600 dark:text-rose-400 overflow-x-auto max-h-24">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={this.handleReload}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="w-full"
              >
                Reload Page
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={this.handleReset}
                leftIcon={<Home className="w-4 h-4" />}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
